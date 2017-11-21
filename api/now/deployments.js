import http from './http'

export default {
  getDeployments (authToken) {
    return http.get('/deployments', {
      headers: {
        authorization: authToken
      }
    }).then((response) => {
      return response.data
    })
  }
}
