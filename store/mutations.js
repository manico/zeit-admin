import _isNil from 'lodash/isNil'
import _isUndefined from 'lodash/isUndefined'
import _each from 'lodash/each'
import types from './mutationTypes'

export default {
  [types.SET_AUTH_TOKEN] (state, { token }) {
    _each(state.auth.tokens, (n) => {
      n.active = n.name === token.name
    })
  },
  [types.SET_DEPLOYMENTS] (state, { deploymentProjects, deployments }) {
    state.deployments = _isNil(deployments) ? [] : deployments
    state.deploymentProjects = _isNil(deploymentProjects) ? [] : deploymentProjects
  },
  [types.SET_ERROR] (state, error) {
    state.error = _isUndefined(error) ? null : error
  }
}
