const gitmojis = require('./gitmojis').gitmojis

const hasGitmoji = ({ commit }) => gitmojis.some(gitmoji => commit.message.includes(gitmoji.emoji))

const mergeCommitRegex = /[Mm]erge/

function isMergeCommit({ commit }) {
  return mergeCommitRegex.test(commit.message)
}

const allCommitsAreValid = commits =>
  commits.every(commit => hasGitmoji(commit) || isMergeCommit(commit))

const checkForEmojis = async context => {
  const { github, payload } = context
  const repo = payload.repository.name
  const owner = payload.repository.owner.login
  const { sha } = payload.pull_request.head

  const response = await github.pullRequests.getCommits({
    owner,
    repo,
    number: payload.pull_request.number,
  })

  const [state, description] = allCommitsAreValid(response.data)
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
