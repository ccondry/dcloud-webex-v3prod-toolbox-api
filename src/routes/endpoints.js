const express = require('express')
const router = express.Router()
const model = require('../models/endpoints')

// get REST endpoint URLs
router.get('/', async function (req, res, next) {
  // const username = req.user.username
  const method = req.method
  const host = req.get('host')
  const path = req.originalUrl
  const operation = 'get endpoints'

  console.log('user', 'at IP', req.clientIp, operation, method, path, 'requested')

  const endpoints = model

  try {
    // get meta info about the response
    let dataType
    let dataLength
    if (Array.isArray(endpoints)) {
      // array
      dataType = 'array'
      dataLength = endpoints.length
    } else {
      // object
      dataType = 'object'
      dataLength = Object.keys(endpoints).length
    }

    // return HTTP response
    res.status(200).send(endpoints)
  } catch (error) {
    console.log('user', 'at IP', req.clientIp, 'get endpoints', 'error', error.message)
    // return both error messages
    res.status(500).send(error.message)
  }
})

module.exports = router
