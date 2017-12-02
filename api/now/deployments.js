import _assign from 'lodash/assign'
import _map from 'lodash/map'
import _orderBy from 'lodash/orderBy'
import _uniqBy from 'lodash/uniqBy'
import http from '~/api/http'

const parseAliases = (result) => {
  if (result.aliases) {
    return _orderBy(result.aliases, ['alias'], ['asc'])
  }

  return []
}

const parseDeployments = (result) => {
  if (result.deployments) {
    return _orderBy(_map(result.deployments, n => _assign(n, {
      created: parseInt(n.created, 10)
    })), ['created'], ['desc'])
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

const parseFiles = (result) => {
  if (result) {
    return _orderBy(_map(result, n => _assign(n, {
      isFolder: n.type === 'directory'
    })), ['isFolder', 'name'], ['desc', 'asc'])
  }

  return []
}

export default {
  addDeploymentAlias (authorization, deployment, alias) {
    return http.post(`/now/deployments/${deployment.uid}/aliases`, alias, {
      headers: {
        authorization
      }
    }).then((response) => {
      return {
        deployment,
        alias: _assign(alias, response.data)
      }
    }).catch((error) => {
      return error.response.data
    })
  },
  deleteDeployment (authorization, deployment) {
    return http.delete(`/now/deployments/${deployment.uid}`, {
      headers: {
        authorization
      }
    }).then((response) => {
      return {
        deployment
      }
    }).catch((error) => {
      return error.response.data
    })
  },
  getDeployment (authorization, deployment) {
    return http.get(`/now/deployments/${deployment.uid}`, {
      headers: {
        authorization
      }
    }).then((response) => {
      const result = response.data

      return {
        deployment: {
          uid: result.uid,
          state: result.state
        }
      }
    }).catch((error) => {
      return error.response.data
    })
  },
  getDeploymentAliases (authorization, deployment) {
    return http.get(`/now/deployments/${deployment.uid}/aliases`, {
      headers: {
        authorization
      }
    }).then((response) => {
      const aliases = parseAliases(response.data)
      return {
        aliases
      }
    }).catch((error) => {
      return error.response.data
    })
  },
  getDeploymentFiles (authorization, deployment) {
    return http.get(`/now/deployments/${deployment.uid}/files`, {
      headers: {
        authorization
      }
    }).then((response) => {
      const files = parseFiles(response.data)
      return {
        files
      }
    }).catch((error) => {
      return error.response.data
    })
  },
  getDeploymentFileContent (authorization, deployment, file) {
    return http.get(`/now/deployments/${deployment.uid}/files/${file.uid}`, {
      headers: {
        authorization
      }
    }).then((response) => {
      const content = response.data
      return content
    }).catch((error) => {
      return error.response.data
    })
  },
  getDeployments (authorization) {
    return http.get('/now/deployments', {
      headers: {
        authorization
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
