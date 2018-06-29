import './prototype'
import { validateFile } from './file-validator'
import { processArgs } from './process-args'
import { processCsv } from './process-csv'
import { showHelpMessage } from './help-message'

// Get passed command-line args, ignore first two (node executable and index.js file).
const [ , , ...args ] = process.argv

// Generates a help message from the options in ./options.
if (['-h', '--help'].some(x => args.includes(x))) {
  showHelpMessage()
  process.exit()
}

// Find given .csv file. It could be any argument, or not exist.
const file = args.find(x => x.endsWith('.csv'))

// Checks if file was given and file exists.
validateFile(file)

// Go through each argument and configure the options.
const { uniqueColumns } = processArgs(args)

// Process the CSV and return the result.
const processedData = processCsv(file as string, uniqueColumns)

// TODO: Write new CSV
