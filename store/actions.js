import _map from 'lodash/map'
import _orderBy from 'lodash/orderBy'
import _uniqBy from 'lodash/uniqBy'
import api from '~/api'
import types from './mutationTypes'

export default {
  getDeployments ({ commit, getters }) {
    return api.now.deployments.getDeployments(getters.authToken.value).then((result) => {
      const deployments = _orderBy(result.deployments, [n => parseInt(n.created, 10)], ['desc'])

      const deploymentProjects = _orderBy(_map(_uniqBy(deployments, 'name'), n => {
        return {
          name: n.name
        }
      }), ['name'], ['asc'])

      commit(types.SET_DEPLOYMENTS, {
        deploymentProjects,
        deployments
      })
    })
  }
}
