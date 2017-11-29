import http from '~/api/http'

export default {
  getDomains (authToken) {
    return http.get('/domains', {
      headers: {
        authorization: `Bearer ${authToken}`
      }
    }).then((response) => {
      return response.data
    })
  }
}
