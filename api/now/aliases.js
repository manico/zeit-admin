import _orderBy from 'lodash/orderBy'
import http from '~/api/http'

const parseAliases = (result) => {
  if (result.aliases) {
    return _orderBy(result.aliases, ['alias'], ['asc'])
  }

  return []
}

export default {
  deleteAlias (authorization, alias) {
    return http.delete(`/now/aliases/${alias.uid}`).then((response) => {
      return {
        alias
      }
    }).catch((error) => {
      return error.response.data
    })
  },
  getAliases (authorization) {
    return http.get('/now/aliases').then((response) => {
      const aliases = parseAliases(response.data)
      return {
        aliases
      }
    }).catch((error) => {
      return error.response.data
    })
  }
}
