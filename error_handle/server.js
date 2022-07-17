// server.js
'use strict'

module.exports = async function (fastify, opts) {

  // fastify.setErrorHandler(function (error, request, reply) {
  //   request.log.warn(error)
  //   var statusCode = error.statusCode >= 400 ? error.statusCode : 500
  //   reply
  //     .code(statusCode) // This is HTTP status code
  //     .type('text/plain')
  //     .send(statusCode >= 500 ? "{sample}" : error.message)
  // })

  fastify.get('/', async (request, reply) => {
    return { hello: 'world' }
  })

  fastify.get('/error_gone', async (request, reply) => {
    reply.send(httpErrors.Gone())
  })

  fastify.get('/custom_error_with_schema', {
    schema: {
      response: {
        501: {
          type: 'object',
          properties: {
            statusCode: { type: 'number' },
            code: { type: 'string' },
            error: { type: 'string' },
            message: { type: 'string' },
            time: { type: 'string' }
          }
        }
      }
    }
  }, function (request, reply) {
    const error = new Error('This endpoint has not been implemented')
    error.time = 'it will be implemented in two weeks'
    error.code = 'error code'
    // return { hello: 'world' }
    reply.code(501).send(error)
  })
}