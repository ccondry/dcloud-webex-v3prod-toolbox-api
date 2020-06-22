const express = require('express')
const router = express.Router()
const pkg = require('../../package.json')

// get version info for this software
router.get('/', async function (req, res, next) {
  console.log('request to get version info...')
  const clientIp = req.clientIp
  const method = req.method
  const path = req.originalUrl
  const operation = 'get version info'

  try {
    console.log('client at IP', clientIp, operation, method, path, 'requested')
    return res.status(200).send({version: pkg.version})
  } catch (e) {
    // error
    console.log('client at IP', clientIp, operation, method, path, 'error', e.message)
    // return 500 SERVER ERROR
    return res.status(500).send(e.message)
  }
})

module.exports = router
