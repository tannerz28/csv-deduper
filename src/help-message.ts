import { options, OptionName } from './options'
import { noIndent } from './no-indent'
const { name, description } = require('../package.json')

export const showHelpMessage = () => {
  let helpMessage = noIndent`
    ${name} - ${description}

    Usage: node index.js <columns> [options]

    Options:
    `
  Object.keys(options).forEach(key => {
    helpMessage = `${helpMessage}\n  --${key}: ${options[key as OptionName].description}`
  })
  console.info(helpMessage)
}
