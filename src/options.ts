export type OptionName = 'compareEmpty' | 'overwrite' | 'excludeEmpty' | 'limit'

type Option = {
  [key: string]: {}
  description: string
  value: any
}

export const options: Record<OptionName, Option> = {
  compareEmpty: {
    description: 'When filtering by column(s), should multiple empty values be treated as duplicates? Defaults to false.',
    value: false
  },
  overwrite: {
    description: 'Do you want the original file to be overwritten? If set to false, a new file will be created, leaving the original file unmodified. Defaults to false.',
    value: false
  },
  excludeEmpty: {
    description: 'If columns are passed as arguments, but the row has no value in any of those columns, exclude that row from the filtered results. Defaults to false.',
    value: false
  },
  limit: {
    description: 'Limit the number of rows to process. Setting this to 0 will process the entire file. Defaults to 0.',
    value: 0
  }
}
