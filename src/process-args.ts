import { OptionName, options } from './options'

export const processArgs = (args: string[]) => {
  const uniqueColumns: string[] = []
  let skip = false
  args.forEach((arg, i) => {
    if (skip) {
      skip = false
      return
    }
    const argFiltered = arg.removeAll('-')
    if (isOption(argFiltered)) {
      if (arg.startsWith('--')) {
        if (args[i + 1] && isBool(args[i + 1])) {
          options[argFiltered].value = Boolean(args[i + 1])
          skip = true
          return
        }
        if (Number(args[i + 1])) {
          options[argFiltered].value = Number(args[i + 1])
          skip = true
          return
        }
      }
      options[argFiltered].value = true
      return
    }
    if (!arg.endsWith('.csv')) {
      uniqueColumns.push(arg)
    }
  })

  return {
    uniqueColumns
  }
}

function isOption (x: string): x is OptionName {
  return !!options[x as OptionName]
}

function isBool (val: string) {
  return val === 'true' || val === 'false'
}
