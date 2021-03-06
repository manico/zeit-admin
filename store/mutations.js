import _assign from 'lodash/assign'
import _isNil from 'lodash/isNil'
import _isUndefined from 'lodash/isUndefined'
import _each from 'lodash/each'
import _filter from 'lodash/filter'
import _find from 'lodash/find'
import _findIndex from 'lodash/findIndex'
import Vue from 'vue'
import types from './mutationTypes'

export default {
  [types.ADD_AUTH_TOKEN] (state, { token }) {
    state.auth.tokens.push(token)
  },
  [types.ADD_DEPLOYMENT_ALIAS] (state, { deployment, alias }) {
    const existingDeployment = _find(state.deployments, { uid: deployment.uid })
    existingDeployment.aliases = existingDeployment.aliases || []
    existingDeployment.aliases.push(alias)
  },
  [types.DELETE_AUTH_TOKEN] (state, { token }) {
    const deleteIndex = _findIndex(state.auth.tokens, { name: token.name })
    Vue.delete(state.auth.tokens, deleteIndex)
  },
  [types.DELETE_DEPLOYMENT] (state, { deployment }) {
    const projectName = deployment.name
    const isEmptyProject = _filter(state.deployments, { name: projectName }).length <= 0
    const deleteIndex = _findIndex(state.deployments, { uid: deployment.uid })

    Vue.delete(state.deployments, deleteIndex)

    if (isEmptyProject) {
      const deleteProjectIndex = _findIndex(state.deploymentProjects, { name: projectName })
      Vue.delete(state.deploymentProjects, deleteProjectIndex)
    }
  },
  [types.DELETE_DEPLOYMENT_ALIAS] (state, { deployment, alias }) {
    const existingDeployment = _find(state.deployments, { uid: deployment.uid })
    const deleteIndex = _findIndex(existingDeployment.aliases, { uid: alias.uid })
    Vue.delete(existingDeployment.aliases, deleteIndex)
  },
  [types.SET_AUTH_TOKEN] (state, { token }) {
    _each(state.auth.tokens, (n) => {
      n.active = n.name === token.name
    })
  },
  [types.SET_AUTH_TOKENS] (state, { tokens }) {
    Vue.set(state.auth, 'tokens', tokens)
  },
  [types.SET_DEPLOYMENTS] (state, { deploymentProjects, deployments }) {
    state.deployments = _isNil(deployments) ? [] : deployments
    state.deploymentProjects = _isNil(deploymentProjects) ? [] : deploymentProjects
  },
  [types.SET_DEPLOYMENT_ALIASES] (state, { deployment, aliases }) {
    Vue.set(_find(state.deployments, { uid: deployment.uid }), 'aliases', aliases)
  },
  [types.SET_ERROR] (state, error) {
    state.error = _isUndefined(error) ? null : error
  },
  [types.UPDATE_DEPLOYMENT] (state, { deployment }) {
    const existingDeployment = _find(state.deployments, { uid: deployment.uid })
    _assign(existingDeployment, deployment)
  }
}
