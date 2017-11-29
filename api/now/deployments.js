import _map from 'lodash/map'
import _orderBy from 'lodash/orderBy'
import _uniqBy from 'lodash/uniqBy'
import http from '~/api/http'

const parseDeployments = (result) => {
  if (result.deployments) {
    return _orderBy(result.deployments, [n => parseInt(n.created, 10)], ['desc'])
  }

  return []
}

const parseDeploymentProjects = (deployments) => {
  return _orderBy(_map(_uniqBy(deployments, 'name'), n => {
    return {
      name: n.name
    }
  }), ['name'], ['asc'])
}

export default {
  getDeployments (authToken) {
    return http.get('/now/deployments', {
      headers: {
        authorization: `Bearer ${authToken}`
      }
    }).then((response) => {
      const deployments = parseDeployments(response.data)
      return {
        deployments,
        deploymentProjects: parseDeploymentProjects(deployments)
      }
    }).catch((error) => {
      return error.response.data
    })
  }
}
