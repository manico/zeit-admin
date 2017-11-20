import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    state: {
      auth: {
        tokens: [
          { name: 'default', value: 'Bearer ZI469WxkVKBiw1sjrtY7m6SB' }
        ]
      }
    },
    getters: {
      authTokens: state => state.auth.tokens,
      authToken: state => state.auth.tokens[0]
    }
  })
}

export default createStore
