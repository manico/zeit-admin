import http from '~/api/http'

export default {
  getDeployments (authToken) {
    return http.get('/now/deployments', {
      headers: {
        authorization: authToken
      }
    }).then((response) => {
      return response.data
    })
  }
}
