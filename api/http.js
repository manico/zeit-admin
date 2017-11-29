import axios from 'axios'

const http = axios.create({
  baseURL: 'https://api.zeit.co',
  timeout: 10000
})

export default http
