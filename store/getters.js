import _find from 'lodash/find'
import _filter from 'lodash/filter'

export default {
  aliases: state => state.aliases,
  authorization: (state, getters) => getters.authToken ? `Bearer ${getters.authToken.value}` : null,
  authTokens: state => state.auth.tokens,
  authToken: state => _find(state.auth.tokens, { active: true }),
  authTokenByName: state => name => _find(state.auth.tokens, { name: name }),
  deployments: state => project => project ? _filter(state.deployments, { name: project.name }) : state.deployments,
  deploymentProjects: state => state.deploymentProjects,
  error: state => state.error,
  menus: state => state.menus
}
