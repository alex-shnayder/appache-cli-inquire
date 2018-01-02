const { preHook } = require('appache/effects')
const modifySchema = require('./modifySchema')
const inquire = require('./inquire')


function schematizeHandler(schema) {
  schema = modifySchema(schema)
  return [schema]
}

function* executeHandler(config, batch) {
  if (
    (!this.interface || !this.interface.includes('cli')) &&
    (!this.source.interface || !this.source.interface.includes('cli'))
  ) {
    return
  }

  batch = yield* inquire(config, batch)
  return [config, batch]
}


module.exports = function* cliInquirePlugin() {
  yield preHook('schematize', schematizeHandler)

  yield preHook({
    event: 'execute',
    tags: ['addOption'],
    goesAfter: ['identifyCommand'],
    goesBefore: ['addOption'],
  }, executeHandler)
}
