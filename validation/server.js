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
const addFormats = require("ajv-formats")

const schemaCompilers = {
  body: addFormats(new Ajv({
    removeAdditional: false, // remove additional properties
    coerceTypes: false, // change data type of data to match type keyword
    // useDefaults: true, // replace missing properties and items with the values from corresponding default keyword

    // Explicitly set allErrors to `false`.
    // When set to `true`, a DoS attack is possible.
    allErrors: false
  })),
  params: addFormats(new Ajv({
    removeAdditional: false,
    coerceTypes: true,
    allErrors: false
  })),
  querystring: addFormats(new Ajv({
    removeAdditional: false,
    coerceTypes: true,
    allErrors: false
  })),
  headers: addFormats(new Ajv({
    removeAdditional: false,
    coerceTypes: true,
    allErrors: false
  }))
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
  let statusCode = error.statusCode
  let response

  const { validation, validationContext } = error

  // console.log(error)

  // check if we have a validation error
  if (validation) {
    statusCode = 422
    var errors = validation.map(function(elem) {
      // return elem;
      return {
        "resource" : elem.instancePath.substring(1),
        "message" : elem.message
      };
    });
    

    response = {
      // validationContext will be 'body' or 'params' or 'headers' or 'query'
      message: `A validation error occurred when validating the ${validationContext}...`,
      // this is the result of your validation library...
      errors: errors
    }
  } else {
    response = error
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

fastify.get('/setting', {
  schema: {
    querystring: {
      type: "object",
      properties: {
        new_date: {
          type: "string",
          format: "date",
        },
        new_email: {
          type: "string",
          format: "email"
        },
        new_phone_number: {
          type: "string",
          pattern: "^\[0-9]{9,12}$"
        }
      },
      required: ["new_date"]
    }
  }
}, (request, reply) => {
  reply.send({ params: request.query }) // echo the querystring
})

fastify.delete('/setting', {
  schema: {
    querystring: {
      type: "object",
      properties: {
        new_date: {
          type: "string",
          format: "date",
        },
      },
      required: ["new_date"]
    }
  }
}, (request, reply) => {
  reply.send({
    params: request.query
  })
})

fastify.post('/setting', {
  schema: {
    body: {
      type: "object",
      properties: {
        new_date: {
          type: "string",
          format: "date",
        },
      },
      required: ["new_date"]
    }
  }
}, (request, reply) => {
  reply.send({
    body: request.body
  })
})

fastify.put('/setting', {
  schema: {
    body: {
      type: "object",
      properties: {
        new_date: {
          type: "string",
          format: "date",
        },
      },
      required: ["new_date"]
    }
  }
}, (request, reply) => {
  // reply.send({ params: request.query }) // echo the querystring
  reply.send({
    body: request.body
  })
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
