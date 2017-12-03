export default function (store) {
  return (config) => {
    config.headers.authorization = store.getters.authorization
    return config
  }
}
