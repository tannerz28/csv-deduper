import chalk from 'chalk'
import { existsSync } from 'fs'
import { noIndent } from './no-indent'

export const validateFile = (file: string | undefined) => {
  if (!file) {
    throw new Error(noIndent`
      ${chalk.redBright('Invalid CSV argument.')}
      ${chalk.redBright('Received:')} node index.js ${file}
      ${chalk.blueBright('Expected:')} node index.js <file>.csv
    `)
  }

  if (!existsSync(file)) {
    throw new Error(chalk.redBright(`Could not find file ${file}. Please ensure the file exists and the correct path is given.`))
  }
}
