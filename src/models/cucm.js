const request = require('request-promise-native')

let url
if (process.env.NODE_ENV === 'production') {
  // production
  const hostname = process.env.SESSION_HOST || 'rp-cwcc-abilene-rtp-1.cxdemo.net'
  url = 'https://' + hostname + '/api/v1/cwcc/provision'
} else {
  // development
  url = 'http://localhost:3050/api/v1/cwcc/provision'
}

// get or start CUCM provision inside dcloud demo session
module.exports = {
  get (authorization) {
    return request({
      url,
      method: 'GET',
      // ignore self-signed certificate
      rejectUnauthorized: false,
      headers: {
        // pass user's JWT to the provision service inside the demo session
        Authorization: authorization
      },
      json: true
    })
  },
  post (authorization, body) {
    return request({
      url,
      method: 'POST',
      // ignore self-signed certificate
      rejectUnauthorized: false,
      headers: {
        // pass user's JWT to the provision service inside the demo session
        Authorization: authorization
      },
      // pass body from parameters
      body,
      json: true
    })
  }
}
