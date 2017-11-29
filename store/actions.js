import api from '~/api'
import types from './mutationTypes'

export default {
  deleteDeployment ({ commit, getters }, deployment) {
    return api.now.deployments.deleteDeployment(
      getters.authToken.value,
      deployment
    ).then((result) => {
      commit(types.DELETE_DEPLOYMENT, result)
      commit(types.SET_ERROR, result.error)
    })
  },
  loadDeployments ({ commit, getters }) {
    return api.now.deployments.getDeployments(getters.authToken.value).then((result) => {
      commit(types.SET_DEPLOYMENTS, result)
      commit(types.SET_ERROR, result.error)
    })
  },
  setAuthToken ({ commit }, token) {
    commit(types.SET_AUTH_TOKEN, {
      token
    })
  },
  setError ({ commit }, error) {
    commit(types.SET_ERROR, error)
  }
}
