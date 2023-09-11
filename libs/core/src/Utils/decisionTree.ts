export type Condition = {
  field: string
  oldValue: any
  newValue: any
  blockId: string
  action: any
}

export interface DecisionTreeConfig {
  conditions: Condition[]
}

export const evaluateDecisionTree = (
  oldData: Record<string, any>,
  newData: Record<string, any>,
  config: DecisionTreeConfig
): any[] => {
  const conditions = config.conditions
  const satisfiedConditions = []
  for (const condition of conditions) {
    if (condition.blockId !== oldData['blockId']) continue
    const field = condition.field
    const oldValueCondition = condition.oldValue
    const newValueCondition = condition.newValue
    const action = condition.action
    let oldConditionMet = true
    const oldFieldValue = oldData[field]
    const newFieldValue = newData[field]
    // Evaluate the conditions based on old and new values. Ignore old value if condition not given or is 'any'
    if (oldValueCondition || oldValueCondition !== 'any')
      oldConditionMet = evaluateCondition(oldFieldValue, oldValueCondition)
    const newConditionMet = evaluateCondition(newFieldValue, newValueCondition)

    // If both old and new conditions are met, perform the action
    if (oldConditionMet && newConditionMet) {
      // Perform the desired action
      satisfiedConditions.push(action)
    }
  }
  return satisfiedConditions
}

const evaluateCondition = (value: any, condition: string): boolean => {
  // Implement your condition evaluation logic here
  // For example, check if value meets a certain condition
  return value && condition && value === condition
}
