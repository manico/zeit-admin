import _map from 'lodash/map'
import _orderBy from 'lodash/orderBy'
import _uniqBy from 'lodash/uniqBy'
import api from '~/api'
import types from './mutationTypes'

export default {
  getDeployments ({ commit, getters }) {
    return api.now.deployments.getDeployments(getters.authToken.value).then((result) => {
      commit(types.SET_DEPLOYMENTS, {
        deploymentProjects: _map(_uniqBy(result.deployments, 'name'), n => {
          return {
            name: n.name
          }
        }),
        deployments: _orderBy(result.deployments, [n => parseInt(n.created, 10)], ['desc'])
      })
    })
  }
}
