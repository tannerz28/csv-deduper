import { options } from './options'
import * as csv from 'fast-csv'
import { createReadStream } from 'fs'

export const processCsv = (file: string, uniqueColumns: string[]) => {
  // Hold all column data that needs to be unique. Stores processed data for reference.
  const parsedData: { [ key: string ]: string[] } = {}

  // Adds an empty array for each column to track.
  if (uniqueColumns) {
    console.log(`Filtering these columns: ${uniqueColumns}`)
    uniqueColumns.forEach(columnName => {
      parsedData[columnName] = []
    })
  }

  const stream = createReadStream(file as string)

  if (!stream) {
    throw new Error('Failed to read file.')
  }

  let originalCount: number = 0
  let newCount: number = 0
  const columnsNotExist: string[] = []

  const filtered: any[] = []

  csv.fromStream(stream, { headers: true, objectMode: true })
  .on('data', data => {
    if (options.limit && Number(options.limit.value) > 0 && originalCount >= Number(options.limit.value)) {
      return
    }

    let unique = true
    let valid = true
    const row = data as any
    originalCount++
    while (unique && valid) {
      if (uniqueColumns) {
        uniqueColumns.forEach(columnName => {
          if (!(row as Object).hasOwnProperty(columnName)) {
            if (!columnsNotExist.includes(columnName)) {
              columnsNotExist.push(columnName)
            }
            return
          }
          if (options.excludeEmpty && !row[columnName]) {
            valid = false
            return
          }
          if (parsedData[columnName].find(x => row[columnName] === x)) {
            unique = false
            return
          }
          parsedData[columnName].push(row[columnName])
        })
        if (unique && valid) {
          filtered.push(row)
          newCount++
        }
      }
      break
    }
  })
  .on('end', () => {
    console.log('Finished processing!')
    console.log(`Filtered file has ${newCount} rows.`)
    console.log(`The original file had ${originalCount} rows.`)
    console.log(`${originalCount - newCount} rows had duplicate or invalid values.`)
    if (columnsNotExist && columnsNotExist.length > 0) {
      console.log(`The following columns were not recognized, and were excluded from processing: ${columnsNotExist}`)
    }
  })
  .on('error', err => {
    throw err
  })

  return filtered
}
