import axios from 'axios'

export default {
  addAuthToken (token) {
    return axios.post('/auth/token', {
      token
    }).then((response) => {
      return response.data
    })
  },
  deleteAuthToken (token) {
    return axios.delete(`/auth/token/${token.name}`).then((response) => {
      return response.data
    })
  }
}
