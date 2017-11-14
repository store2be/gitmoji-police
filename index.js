const checkForEmojis = require('./check-for-emojis')

module.exports = (robot) => {
  robot.on('pull_request', checkForEmojis)
}
