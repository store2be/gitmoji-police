const axios = require('axios')

const gitmojis = require('./gitmojis').gitmojis

const hasGitmoji = ({ commit }) =>
  gitmojis.some(gitmoji => commit.message.includes(gitmoji.emoji))

const allCommitsHaveGitmojis = commits => commits.every(hasGitmoji)

const checkForEmojis = async (context) => {
  const { github, payload } = context
  const repo = payload.repository.name
  const owner = payload.repository.owner.login
  const { sha } = payload.pull_request.head

  const response = await axios.get(context.payload.pull_request.commits_url)

  const [state, description] = allCommitsHaveGitmojis(response.data)
    ? ['success', 'The Gitmoji Police is satisfied with your commit messages.']
    : ['failure', 'This PR is missing Gitmojis.']

  github.repos.createStatus({
    context: 'Gitmoji Police',
    description,
    owner,
    repo,
    state,
    sha,
  })
}

module.exports = checkForEmojis
