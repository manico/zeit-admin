import http from '~/api/http'

export default {
  getDomains (authorization) {
    return http.get('/domains', {
      headers: {
        authorization
      }
    }).then((response) => {
      return response.data
    })
  }
}
