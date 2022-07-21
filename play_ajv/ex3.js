const Ajv = require("ajv")
const addFormats = require("ajv-formats")

const ajv = new Ajv() // options can be passed, e.g. {allErrors: true}
addFormats(ajv)

const schema = {
  type: "object",
  properties: {
    foo: {type: "string", format: "date"},
  },
  required: ["foo"],
  additionalProperties: false
}

const validate = ajv.compile(schema)

const data = {
  // foo: 1,
  foo: "1",
  // foo: "1990-03-03",
}

const valid = validate(data)
if (!valid) console.log(validate.errors)

console.log("finish")