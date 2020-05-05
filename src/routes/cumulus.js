const express = require('express')
const router = express.Router()
const DB = require('../models/db')
const db = new DB('toolbox')

// get user demo config
router.get('/', async function (req, res, next) {
  const username = req.user.username
  const clientIp = req.clientIp
  const method = req.method
  const path = req.originalUrl
  const operation = 'get demo config'

  try {
    console.log('user', username, 'at IP', clientIp, operation, method, path, 'requested')
    const q = {username}
    const projection = {'demo.cwcc': 1}
    const data = await db.findOne('users', q, {projection})
    if (data === null) {
      // user not found - we should not be here with a logged-in user
      // return 404 NOT FOUND
      return res.status(404).send('user ' + username + ' not found?')
    }
    let demo
    try {
      demo = data.demo.cwcc || {}
    } catch (e) {
      demo = {}
    }
    // found
    let dataLength
    try {
      dataLength = Object.keys(demo).size
    } catch (e) {
      datalength = 0
    }
    console.log('user', username, 'at IP', clientIp, operation, method, path, 'successful', demo)
    // return 200 OK with data
    res.status(200).send(demo)
  } catch (e) {
    // error
    console.log('user', username, 'at IP', clientIp, operation, method, path, 'failed:', e.message)
    // return 500 SERVER ERROR
    res.status(500).send(e.message)
  }
})

// save user demo config
router.post('/', async function (req, res, next) {
  const username = req.user.username
  const clientIp = req.clientIp
  const method = req.method
  const path = req.originalUrl
  const operation = 'save demo config'

  try {
    console.log('user', 'at IP', clientIp, operation, method, path, 'requested')
    const q = { username }
    await db.updateOne('users', q, {$set: {'demo.cwcc': req.body} })
    console.log('user', 'at IP', clientIp, operation, method, path, 'successful')
    // return 202 ACCEPTED
    res.status(202).send()
  } catch (e) {
    // error
    console.log('user', 'at IP', clientIp, operation, method, path, 'failed:', e.message)
    // return 500 SERVER ERROR
    res.status(500).send(e.message)
  }
})

module.exports = router
