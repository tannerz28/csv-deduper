import { options } from './options'
import * as csv from 'fast-csv'
import { createReadStream, createWriteStream } from 'fs'
import { noIndent } from './no-indent'

export const processCsv = (file: string, uniqueColumns: string[]) => {
  // Hold all column data that needs to be unique. Stores processed data for reference.
  const parsedData: { [ key: string ]: string[] } = {}

  // Adds an empty array for each column to track.
  if (uniqueColumns) {
    console.log(`\nFiltering these columns: ${uniqueColumns}\n`)
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
    console.log('\nBegin write to new file.\n')

    const dateString = new Date().toISOString().removeAll('\.').removeAll('-').removeAll(':')
    const fileNameNoExtension = file.substring(0, file.lastIndexOf('.csv'))

    const newFileName = `${fileNameNoExtension}-${dateString}.csv`
    const csvStream = csv.createWriteStream({ headers: true })
    const writableStream = createWriteStream(newFileName)

    writableStream.on('finish', () => {
      console.info(noIndent`
        Done! The filtered data was saved in ${newFileName}.

        Processing Summary:

        Filtered file has ${newCount} rows.
        The original file had ${originalCount} rows.
        ${originalCount - newCount} rows had duplicate or invalid values and were excluded.
        ${columnsNotExist && columnsNotExist.length > 0 ?
          noIndent`The following columns were not recognized, and were excluded from processing: ${ columnsNotExist }` : ''
        }
      `)
    })

    csvStream.pipe(writableStream)
    filtered.forEach(item => csvStream.write(item))
    csvStream.end()
  })
  .on('error', err => {
    throw err
  })
}
