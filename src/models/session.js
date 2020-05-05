const request = require('request-promise-native')

let url
if (process.env.NODE_ENV === 'production') {
  // production
  url = 'https://rp-cwcc-rtp-1.cxdemo.net/api/v1/cwcc/session'
} else {
  // development
  url = 'http://localhost:3050/api/v1/cwcc/session'
}

// get dcloud session information from the session
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
  }
}
