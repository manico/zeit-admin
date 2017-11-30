import _isNil from 'lodash/isNil'
import api from '~/api'
import types from './mutationTypes'

export default {
  addAuthToken (store, token) {
    const existingToken = store.getters.authTokenByName(token.name)

    if (_isNil(existingToken)) {
      if (!store.getters.authTokens) {
        token.active = true
      }

      store.commit(types.ADD_AUTH_TOKEN, {
        token
      })
    } else {
      store.dispatch('setError', {
        message: 'Authorization token name already exists'
      })
    }
  },
  deleteAuthToken ({ commit }, token) {
    commit(types.DELETE_AUTH_TOKEN, {
      token
    })
  },
  deleteDeployment (store, deployment) {
    return api.now.deployments.deleteDeployment(
      store.getters.authorization,
      deployment
    ).then((result) => {
      store.commit(types.DELETE_DEPLOYMENT, result)
      if (!_isNil(result.error)) store.dispatch('setError', result.error)
    })
  },
  loadDeployments (store) {
    return api.now.deployments.getDeployments(
      store.getters.authorization
    ).then((result) => {
      store.commit(types.SET_DEPLOYMENTS, result)
      if (!_isNil(result.error)) store.dispatch('setError', result.error)
    })
  },
  setAuthToken ({ commit }, token) {
    commit(types.SET_AUTH_TOKEN, {
      token
    })
  },
  setError ({ commit }, error) {
    commit(types.SET_ERROR, error)
  },
  updateDeployment (store, deployment) {
    return api.now.deployments.getDeployment(
      store.getters.authorization,
      deployment
    ).then((result) => {
      store.commit(types.UPDATE_DEPLOYMENT, result)
      if (!_isNil(result.error)) store.dispatch('setError', result.error)
    })
  }
}
