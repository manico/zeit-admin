import _isNil from 'lodash/isNil'
import api from '~/api'
import types from './mutationTypes'

export default {
  deleteDeployment (store, deployment) {
    return api.now.deployments.deleteDeployment(
      store.getters.authToken.value,
      deployment
    ).then((result) => {
      store.commit(types.DELETE_DEPLOYMENT, result)
      store.dispatch('setError', result.error)
    })
  },
  loadDeployments (store) {
    return api.now.deployments.getDeployments(
      store.getters.authToken.value
    ).then((result) => {
      store.commit(types.SET_DEPLOYMENTS, result)
      store.dispatch('setError', result.error)
    })
  },
  setAuthToken ({ commit }, token) {
    commit(types.SET_AUTH_TOKEN, {
      token
    })
  },
  setError ({ commit }, error) {
    if (!_isNil(error)) {
      commit(types.SET_ERROR, error)
    }
  },
  updateDeployment (store, deployment) {
    return api.now.deployments.getDeployment(
      store.getters.authToken.value,
      deployment
    ).then((result) => {
      store.commit(types.UPDATE_DEPLOYMENT, result)
      store.dispatch('setError', result.error)
    })
  }
}
