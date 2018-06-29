interface String {
  removeAll: (...searchValues: string[]) => string
}

const escapeRegex = (val: string) => {
  return val.startsWith('\\') ? val : `\\${val}`
}

String.prototype.removeAll = function (this: string, ...searchValues: string[]): string {
  let result = this
  searchValues.forEach(val => {
    result = result.replace(new RegExp(escapeRegex(val), 'g'), '')
  })
  return result
}
