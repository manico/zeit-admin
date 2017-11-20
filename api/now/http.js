import axios from 'axios'

const http = axios.create({
  baseURL: 'https://api.zeit.co/now',
  timeout: 10000
})

export default http
