const throttle = (callback: Function, timeFrame: number) => {
  let lastTime = 0
  return function (args) {
    const now = Date.now()
    if (now - lastTime >= timeFrame) {
      callback(args)
      lastTime = now
    }
  }
}

const remove = (array: any[], truthCheck: Function) => {
  const toRemove = []
  const result = array.filter((item, i) => truthCheck(item) && toRemove.push(i))

  toRemove.reverse().forEach((i) => array.splice(i, 1))
  return result
}

const range = (start: number, end?: number, increment?: number) => {
  const isEndDef = typeof end !== 'undefined'
  end = isEndDef ? end : start
  start = isEndDef ? start : 0

  if (typeof increment === 'undefined') {
    increment = Math.sign(end - start)
  }

  const length = Math.abs((end - start) / (increment || 1))

  const { result } = Array.from<any>({ length }).reduce(
    ({ result, current }) => ({
      result: [...result, current],
      current: current + increment
    }),
    { current: start, result: [] }
  )

  return result
}

export { throttle, remove, range }
