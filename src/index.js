const prompt = require('inquirer').createPromptModule()
const { hook, hookStart, next } = require('appache/effects')
const modifySchema = require('./modifySchema')


function findOption(options, id) {
  return options && options.find((option) => {
    return option.config && option.config.id === id
  })
}

function* inquire(option) {
  let { name, description, inquire } = option
  let endChar, message, type

  if (option.type === 'boolean') {
    type = 'confirm'
    endChar = '?'
  } else {
    type = 'input'
    endChar = ':'
  }

  if (typeof inquire === 'string') {
    message = inquire
  } else if (description) {
    message = description + endChar
  } else {
    message = name[0].toUpperCase() + name.substr(1) + endChar
  }

  let question = { name, type, message }
  let answer = yield prompt(question)
  return answer[name]
}

function* processCommand(command) {
  let { config, options } = command

  if (!config || !config.options || !config.options.length) {
    return command
  }

  options = options.slice()

  for (let i = 0; i < config.options.length; i++) {
    let option = config.options[i]

    if (!option.inquire || findOption(options, option.id)) {
      continue
    }

    let value = yield* inquire(option)

    options.push({
      value,
      name: option.name,
      inputName: option.name,
      config: option,
    })
  }

  return Object.assign({}, command, { options })
}

module.exports = function* cliInquirePlugin() {
  yield hook('schema', function* (schema) {
    schema = modifySchema(schema)
    return yield next(schema)
  })

  yield hookStart('process', function* (config, command) {
    command = yield* processCommand(command)
    return yield next(config, command)
  })
}
