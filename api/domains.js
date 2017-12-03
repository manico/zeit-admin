import http from '~/api/http'

export default {
  getDomains () {
    return http.get('/domains').then((response) => {
      return response.data
    })
  }
}
