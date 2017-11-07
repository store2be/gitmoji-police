const axios = require('axios')

const gitmojis = require('./gitmojis').gitmojis

module.exports = (robot) => {
  console.log('Yay, the app was loaded!')

  robot.on('pull_request', async context => {
    console.log('Something happened to a PR!')
    const response = await axios.get(context.payload.pull_request.commits_url)
    const commits = response.data
    if (commits.every(({ commit }) => gitmojis.some(gitmoji => commit.message.includes(gitmoji.emoji)))) {
      console.log('Go ahead sir!')
    } else {
      console.log('HOW DARE YOU? Monster.')
    }
  })
}
