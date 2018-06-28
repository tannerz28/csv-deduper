interface String {
  removeAll: (searchValue: string) => string
}

String.prototype.removeAll = function (this: string, searchValue: string): string {
  return this.replace(new RegExp(searchValue, 'g'), '')
}
