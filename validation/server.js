// server.js
'use strict'

// Require the framework and instantiate it
const fastify = require('fastify')({ 
  logger: {
    transport:{
      target: 'pino-pretty',
    }
  }
})


const Ajv = require('ajv')
const schemaCompilers = {
  body: new Ajv({
    removeAdditional: false, // remove additional properties
    coerceTypes: false, // change data type of data to match type keyword
    // useDefaults: true, // replace missing properties and items with the values from corresponding default keyword

    // Explicitly set allErrors to `false`.
    // When set to `true`, a DoS attack is possible.
    allErrors: true
  }),
  params: new Ajv({
    removeAdditional: false,
    coerceTypes: true,
    allErrors: true
  }),
  querystring: new Ajv({
    removeAdditional: false,
    coerceTypes: true,
    allErrors: true
  }),
  headers: new Ajv({
    removeAdditional: false,
    coerceTypes: true,
    allErrors: true
  })
}

fastify.setValidatorCompiler(req => {
  if (!req.httpPart) {
    throw new Error('Missing httpPart')
  }
  const compiler = schemaCompilers[req.httpPart]
  if (!compiler) {
    throw new Error(`Missing compiler for ${req.httpPart}`)
  }
  return compiler.compile(req.schema)
})

fastify.setErrorHandler(function (error, request, reply) {
  const statusCode = error.statusCode
  let response

  const { validation, validationContext } = error

  // check if we have a validation error
  if (validation) {
    response = {
      // validationContext will be 'body' or 'params' or 'headers' or 'query'
      message: `A validation error occurred when validating the ${validationContext}...`,
      // this is the result of your validation library...
      errors: validation
    }
  } else {
    response = {
      message: 'An error occurred...'
    }
  }

  // any additional work here, eg. log error
  // ...

  reply.status(statusCode).send(response)
})

// Declare a route
fastify.get('/hello', async (request, reply) => {
  return { hello: 'world' }
})
  
fastify.get('/', {
  schema: {
    querystring: {
      type: 'object',
      properties: {
        ids: {
          type: 'array',
          default: []
        },
      },
    }
  }
}, (request, reply) => {
  reply.send({ params: request.query }) // echo the querystring
})

fastify.get('/foo_bar', {
  schema: {
    querystring: {
      type: "object",
      properties: {
        foo: {type: "integer"},
        bar: {type: "string"}
      },
      required: ["foo"],
      additionalProperties: false
    }
  }
}, (request, reply) => {
  reply.send({ params: request.query }) // echo the querystring
})

// Run the server!
const start = async () => {
  try {
    await fastify.listen({ port: 3000 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
