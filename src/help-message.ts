import { options, OptionName } from './options'
import { noIndent } from './no-indent'
const { name, description, version, license } = require('../package.json')

export const showHelpMessage = () => {
  let helpMessage = noIndent`
    ${name} v${version} (${license}) - ${description}

    Usage: node index.js <file.csv> <columns> [options]
    Example: node index.js ~/users.csv Email Username "Phone Number" --excludeEmpty

    Options:
    `
  Object.keys(options).forEach(key => {
    helpMessage = `${helpMessage}\n  --${key}: ${options[key as OptionName].description}`
  })
  console.info(helpMessage)
}
