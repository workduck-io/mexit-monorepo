import { generateTempId } from './idGenerator'

export type getValuefn = (obj?: any) => string
export type getDatafn = (data?: any) => any

export interface Add {
  key: string
  // Get the value for the new key, the old obj is passed as well as the data.
  value: getValuefn
}

export interface Move {
  from: string
  to: string
  // If not provided, old value is used
  value?: getValuefn
}

export interface Update {
  key: string
  value: getValuefn
}

export interface GeneralTransform {
  // Keys to be added
  add?: Add[]

  // Keys whose value will be updated
  update?: Update[]

  // Keys which will be renamed, perhaps with a change of value
  move?: Move[]

  // Array of keys to be deleted
  delete?: string[]
}

// These are applied to the elements (Object) of the array
// for a value: Array<Object>
// Applied to the Objects
export interface ArrayTransform extends GeneralTransform {
  type: 'ArrayTransform'
}

// These are applied to the value (Object) of the keys
//
// for a value: Record<string, Object>
// Applied to the Object for each string
export interface ObjectTransform extends GeneralTransform {
  type: 'ObjectTransform'
}

// These are applied to the value (Object) of the keys
export interface CustomTransform extends GeneralTransform {
  type: 'Custom'
  custom: string
}

// A transformation is a group of transforms that bump version
// and can be applied to achieve one upper version
//
// After applying the transformation, the version is incremented
//

export interface KeysTransformation {
  // Version of mex.
  // Keeps incrementing transforms till it reaches the version for the update
  version: string

  type: 'KeysTransformation'
  // The keys on which transforms will be applied
  keys?: Record<string, ArrayTransform | ObjectTransform | CustomTransform>
}

export interface CustomTransformation {
  type: 'CustomTransformation'
  version: string
  custom?: getDatafn
}

export type DataTransformation = KeysTransformation | CustomTransformation

export const applyAddTransform = (ob: any, t: Add[]): any => {
  return {
    ...ob,
    ...t.reduce((p, c) => ({ ...p, [c.key]: c.value(ob) }), {})
  }
}

export const applyDeleteTransform = (ob: any, t: string[]): any => {
  const newOb = { ...ob }
  t.forEach((s) => {
    delete newOb[s]
  })
  return newOb
}

export const applyMoveTransform = (ob: any, t: Move[]): any => {
  const newOb = { ...ob }
  t.forEach((s) => {
    newOb[s.to] = s.value !== undefined ? s.value(ob) : newOb[s.from]
    delete newOb[s.from]
  })
  // console.log('\n\n\nMoving: ', JSON.stringify({ ob, t }, null, 2))
  return newOb
}

export const applyUpdateTransform = (ob: any, t: Update[]) => {
  const newOb = { ...ob }
  t.forEach((u) => {
    newOb[u.key] = u.value(ob)
  })
  return newOb
}

export const applyGeneralTransform = (ob: any, t: GeneralTransform) => {
  const afterAdd = t.add ? applyAddTransform(ob, t.add) : ob
  const afterUpdate = t.update ? applyUpdateTransform(afterAdd, t.update) : ob
  const afterMove = t.move ? applyMoveTransform(afterUpdate, t.move) : ob
  const afterDelete = t.delete ? applyDeleteTransform(afterMove, t.delete) : ob
  return afterDelete
}

export const applyArrayTransformation = (a: any[], t: ArrayTransform): any[] => {
  const newa = a.map((ob) => applyGeneralTransform(ob, t))
  return newa
}

export const idUpdateFunction = (block) => {
  return {
    ...block,
    id: generateTempId()
  }
}

export const updateIds = (blockToUpdate: any, withType?: boolean, idGenerator: () => string = generateTempId) => {
  if (!blockToUpdate) return

  const block = Object.assign({}, blockToUpdate)
  const addIdIfType = withType && block?.type

  if (block.id || addIdIfType) {
    const newId = idGenerator()
    block.id = newId
  }
  if (block.children) {
    block.children = block.children.map((bl) => {
      return updateIds(bl, addIdIfType, idGenerator)
    })
  }
  return block
}

export const applyObjectTransform = (rec: Record<string, any>, t: ObjectTransform) => {
  return Object.entries(rec).reduce((p, c) => {
    const [k, v] = c
    // console.log('\n\n\nObjectified Transform: ', JSON.stringify({ rec, c, k, v }, null, 2))
    return {
      ...p,
      [k]: applyGeneralTransform(v, t)
    }
  }, {})
}

// A custom transform, applied to the elements (Object) of the array of the keys
// for a value: Record<string, Array<Object>>
// Applied to the Objects of the array of the value at Record[string]
export const applyArrayedObjectTransform = (rec: Record<string, Array<any>>, t: CustomTransform) => {
  return Object.entries(rec).reduce((p, c) => {
    const [k, v] = c
    // console.log('\n\n\nObjectified Transform: ', JSON.stringify({ rec, c, k, v }, null, 2))
    return {
      ...p,
      [k]: v.map((ob) => applyGeneralTransform(ob, t))
    }
  }, {})
}

export const applyKeysTransform = (d: any, t: KeysTransformation): any => {
  const newD = { ...d }
  Object.entries(t.keys).map(([k, t]) => {
    switch (t.type) {
      case 'ArrayTransform': {
        newD[k] = applyArrayTransformation(d[k], t)
        break
      }
      case 'ObjectTransform': {
        break
      }
      case 'Custom': {
        switch (t.custom) {
          case 'ArrayedObjectTransform': {
            newD[k] = applyArrayedObjectTransform(d[k], t)
          }
        }
        break
      }
    }
  })
  return { ...newD, version: t.version !== '*' ? t.version : newD.version }
}

export const addBaseVersionIfNeeded = (d: any): any => {
  if (d.version !== undefined) return d
  return { ...d, version: '0.0.0' }
}

// TODO: See what these do and uncomment and add later
// export const requiresTransform = (d: any): boolean => {
//   // console.log(d.version, app.getVersion())
//   if (d.version) {
//     if (d.version !== app.getVersion()) return true
//     return false
//   }
//   return true
// }

// export const applyTransforms = (d: any, transforms: DataTransformation[]): { data: any; toWrite: boolean } => {
//   // const fromTransformIndex = transforms.map(t => t.version)

//   // Only apply transforms that are a version up of the data
//   const toApplyTransform = transforms
//     .filter((t) => semver.gt(t.version, addBaseVersionIfNeeded(d).version, true))
//     .sort((a, b) => semver.compareLoose(a.version, b.version))

//   const transformedData = toApplyTransform.reduce((pd, t) => {
//     if (t.type === 'KeysTransformation') {
//       return applyKeysTransform(pd, t)
//     } else if (t.type === 'CustomTransformation') {
//       return t.custom ? t.custom(pd) : pd
//     }
//   }, d)

//   const transformedDataWithDefaultTransforms = DefaultTransforms.reduce((pd, t) => {
//     if (t.type === 'KeysTransformation') {
//       return applyKeysTransform(pd, t)
//     } else if (t.type === 'CustomTransformation') {
//       return t.custom ? t.custom(pd) : pd
//     }
//   }, transformedData)

//   console.log('BigBrainDataTransform', { v: transformedData.version, toApplyTransform, transforms })

//   return { data: transformedDataWithDefaultTransforms, toWrite: toApplyTransform.length > 0 }
// }

// export const clearLocalStorage = (fileDataVersion: string, currVersion: string) => {
//   const compareFileDataVersion = semver.compare(fileDataVersion, ForceLogutVersion)
//   const compareCurrentVersion = semver.compare(currVersion, ForceLogutVersion)

//   if (compareFileDataVersion <= 0 && compareCurrentVersion > 0) return true
//   return false
// }
