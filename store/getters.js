import _filter from 'lodash/filter'

export default {
  authTokens: state => state.auth.tokens,
  authToken: state => state.auth.tokens[0],
  deployments: state => project => project ? _filter(state.deployments, { name: project.name }) : state.deployments,
  deploymentProjects: state => state.deploymentProjects
}
