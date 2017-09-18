const { assign } = require('appache/common')


const OPTION_PROPERTIES = {
  inquire: {
    type: ['boolean', 'string'],
    default: false,
  },
}


module.exports = function modifySchema(schema) {
  schema = assign(schema, 'definitions.option.properties', OPTION_PROPERTIES)
  return schema
}
