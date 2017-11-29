import types from './mutationTypes'

export default {
  [types.SET_DEPLOYMENTS] (state, { deploymentProjects, deployments }) {
    state.deploymentProjects = deploymentProjects
    state.deployments = deployments
  }
}
