const express = require('express')
const router = express.Router()
// v2 provision
const model = require('../models/provision')
const cucmModel = require('../models/cucm')

// provision user for CWCC demo
router.post('/', async function (req, res, next) {
  const username = req.user.username
  const userId = req.user.id
  const clientIp = req.clientIp
  const method = req.method
  const path = req.originalUrl
  const operation = 'provision user for Webex v3 demo'

  try {
    console.log('user', username, userId, 'at IP', clientIp, operation, method, path, 'requested')
    // do provisioning in CJP
    const results = await model.go(userId)
    console.log('user', username, userId, 'CWCC provisioning done for Webex v3 demo:', results)
    // results: {
    //   team,
    //   supervisor,
    //   agent,
    //   virtualTeam,
    //   routingStrategy,
    //   queueId
    // }

    console.log('marking user', username, userId, 'as provisioned but not done for Webex v3')
    // mark user provisioned but not done in our cloud db
    await model.set({username, userId, isDone: false})

    console.log('sending CUCM provision request to Webex v3 demo session...')
    // forward the JWT to the CUCM inside the demo session
    const response = await cucmModel.post(req.headers.authorization)
    console.log('CUCM provision request to Webex v3 demo session sent successfully', response)

    // return 200 OK
    return res.status(200).send()
  } catch (e) {
    // error
    console.log('user', username, userId, 'at IP', clientIp, operation, method, path, 'error', e.message)
    // return 500 SERVER ERROR
    res.status(500).send(e.message)
  }
})

module.exports = router
