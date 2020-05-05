const DB = require('../db')
const db = new DB('toolbox')

const userTemplate = require('./templates/user')
const userProfileTemplate = require('./templates/user-profile')
const upsertUserProfile = require('./user-profile').upsert
const upsertRoutingStrategy = require('./routing-strategy').upsert
const upsertCurrentRoutingStrategy = require('./current-routing-strategy').upsert
const upsertVirtualTeam = require('./virtual-team').upsert
const upsertTeam = require('./team').upsert
const upsertUser = require('./user').upsert

// main function block
async function go (dCloudUserId) {
  const teamName = 'T_dCloud_' + dCloudUserId
  // const agentUsername = 'sjeffers' + dCloudUserId + '@dcloud.cisco.com'
  const supervisorUsername = 'rbarrows' + dCloudUserId + '@dcloud.cisco.com'
  const virtualTeamName = 'Q_dCloud_' + dCloudUserId
  // const virtualTeamChatName = 'EP_Chat_' + dCloudUserId
  const routingStrategyName = 'RS_dCloud_' + dCloudUserId
  const userProfileName = 'Supervisor ' + dCloudUserId
  // const supervisorProfileId = 'AWwbV8tvhW2lRXH-xsW8'
  const agentProfileId = 'AWX8rlaq_1uTFjV88ROQ'

  // voice queue
  const virtualTeam = await upsertVirtualTeam({name: virtualTeamName})

  // chat queue
  // const virtualTeamChat = await upsertVirtualTeam({
  //   name: virtualTeamChatName,
  //   serviceLevelThreshold: 9999,
  //   maxActiveCalls: 4,
  //   channelType: 4
  // })

  // get voice queue ID
  const virtualTeamId = virtualTeam.id

  // get voice queue ID
  // const virtualTeamChatId = virtualTeamChat.id

  // create user profile template
  const upt = userProfileTemplate({
    name: userProfileName,
    queueId: virtualTeamId
  })

  // create user profile
  const userProfile = await upsertUserProfile(upt)

  // get user-specific user profile ID for supervisor
  const supervisorProfileId = userProfile.id

  const team = await upsertTeam(teamName)

  // create user template
  const supervisorUserTemplate = userTemplate({
    username: supervisorUsername,
    teamId: team.id,
    firstName: 'Rick',
    lastName: 'Barrows',
    profileId: supervisorProfileId
  })

  // create user template
  // const agentUserTemplate = userTemplate({
  //   username: agentUsername,
  //   teamId: team.id,
  //   firstName: 'Sandra',
  //   lastName: 'Jefferson',
  //   profileId: agentProfileId
  // })

  // create supervisor
  const supervisor = await upsertUser(supervisorUserTemplate)

  // agent
  // const agent = await upsertUser(agentUserTemplate)

  // extract usable queue ID as a string
  const queueId = virtualTeam.attributes.dbId__l + ''

  // routing strategy
  const routingStrategy = await upsertRoutingStrategy({
    name: routingStrategyName,
    virtualTeamId: virtualTeam.id,
    virtualTeamName,
    virtualTeamDbId: virtualTeam.attributes.dbId__l,
    teamName,
    teamId: team.attributes.dbId__l
  })

  // current routing strategy
  const currentRoutingStrategy = await upsertCurrentRoutingStrategy(routingStrategy)
  // return all objects
  return {
    team,
    supervisor,
    agent,
    virtualTeam,
    routingStrategy,
    currentRoutingStrategy,
    queueId,
    userProfile
    // virtualTeamChat
  }
}

// mark user as partially provisioned
function setProvisionFlag (username, id) {
  // build provision data query
  const q = { username, demo: 'webex', version: 'v3prod' }
  // build provision data object
  const data = {
    username,
    id,
    demo: 'webex',
    version: 'v3prod',
    isDone: false
  }
  // add or update provision data to mongo db
  return db.upsert('provision', q, data)
}

function setQueueId ({userId, queueId}) {
  return db.upsert('cwcc.queue', {userId}, {
    userId,
    queueId,
    isNew: '1'
  })
}

// run async
// go('0325').catch(e => console.log(e.message))

module.exports = {
  go,
  setProvisionFlag,
  setQueueId
}
