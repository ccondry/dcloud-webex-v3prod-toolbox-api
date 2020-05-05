const express = require('express')
const router = express.Router()
const model = require('../models/session')

// get dcloud instant demo session information
router.get('/', async function (req, res, next) {
  const username = req.user.username
  const clientIp = req.clientIp
  const method = req.method
  const path = req.originalUrl
  const operation = 'get dCloud session information'

  try {
    console.log('user', username, 'at IP', clientIp, operation, method, path, 'requested')

    const results = await model.get(req.headers.authorization)

    console.log('user', username, 'at IP', clientIp, operation, method, path, 'successful')
    // if no data found, return empty object instead of null
    const data = results
    const dataLength = Object.keys(data)
    response = `(JSON object with ${dataLength} properties)`
    // return results
    res.status(200).send(data)
  } catch (e) {
    // error
    console.log('user', username, 'at IP', clientIp, operation, method, path, 'error', e.message)
    // return 500 SERVER ERROR
    res.status(500).send(e.message)
  }
})

module.exports = router
