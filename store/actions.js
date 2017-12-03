import _isNil from 'lodash/isNil'
import api from '~/api'
import types from './mutationTypes'

export default {
  nuxtServerInit (store) {
    api.http.interceptors.request.use(api.interceptor(store))
  },
  addAuthToken (store, token) {
    const existingToken = store.getters.authTokenByName(token.name)

    if (_isNil(existingToken)) {
      if (!store.getters.authorization) {
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
  addDeploymentAlias (store, { deployment, alias }) {
    return api.now.deployments.addDeploymentAlias(
      deployment,
      alias
    ).then((result) => {
      if (_isNil(result.error)) {
        store.commit(types.ADD_DEPLOYMENT_ALIAS, {
          deployment,
          alias
        })
      } else {
        store.dispatch('setError', result.error)
      }

      return result
    })
  },
  deleteAuthToken ({ commit }, token) {
    commit(types.DELETE_AUTH_TOKEN, {
      token
    })
  },
  deleteDeployment (store, deployment) {
    return api.now.deployments.deleteDeployment(
      deployment
    ).then((result) => {
      store.commit(types.DELETE_DEPLOYMENT, result)
      if (!_isNil(result.error)) store.dispatch('setError', result.error)
    })
  },
  deleteDeploymentAlias (store, { deployment, alias }) {
    return api.now.aliases.deleteAlias(
      alias
    ).then((result) => {
      store.commit(types.DELETE_DEPLOYMENT_ALIAS, {
        deployment,
        alias: result.alias
      })
      if (!_isNil(result.error)) store.dispatch('setError', result.error)
    })
  },
  loadDeployments (store) {
    return api.now.deployments.getDeployments().then((result) => {
      store.commit(types.SET_DEPLOYMENTS, result)
      if (!_isNil(result.error)) store.dispatch('setError', result.error)
    })
  },
  loadDeploymentAliases (store, deployment) {
    return api.now.deployments.getDeploymentAliases(
      deployment
    ).then((result) => {
      store.commit(types.SET_DEPLOYMENT_ALIASES, {
        deployment,
        aliases: result.aliases
      })
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
      deployment
    ).then((result) => {
      store.commit(types.UPDATE_DEPLOYMENT, result)
      if (!_isNil(result.error)) store.dispatch('setError', result.error)
    })
  }
}
