import _isNil from 'lodash/isNil'
import api from '~/api'
import types from './mutationTypes'

export default {
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
      store.getters.authorization,
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
  deleteAlias (store, alias) {
    return api.now.aliases.deleteAlias(
      store.getters.authorization,
      alias
    ).then((result) => {
      store.commit(types.DELETE_ALIAS, result)
      if (!_isNil(result.error)) store.dispatch('setError', result.error)
    })
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
  deleteDeploymentAlias (store, { deployment, alias }) {
    return api.now.aliases.deleteAlias(
      store.getters.authorization,
      alias
    ).then((result) => {
      store.commit(types.DELETE_DEPLOYMENT_ALIAS, {
        deployment,
        alias: result.alias
      })
      if (!_isNil(result.error)) store.dispatch('setError', result.error)
    })
  },
  loadAliases (store) {
    return api.now.aliases.getAliases(
      store.getters.authorization
    ).then((result) => {
      store.commit(types.SET_ALIASES, result)
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
  loadDeploymentAliases (store, deployment) {
    return api.now.deployments.getDeploymentAliases(
      store.getters.authorization,
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
      store.getters.authorization,
      deployment
    ).then((result) => {
      store.commit(types.UPDATE_DEPLOYMENT, result)
      if (!_isNil(result.error)) store.dispatch('setError', result.error)
    })
  }
}
