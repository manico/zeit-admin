<template>
  <div>
    {{deployments}}
    <api-tokens></api-tokens>
  </div>
</template>

<script>
  import api from '~/api'
  import ApiTokens from '~/components/ApiTokens.vue'

  export default {
    asyncData ({ store }) {
      return api.now.deployments.getDeployments(
        store.getters.authToken.value
      ).then((result) => {
        return {
          deployments: result.deployments
        }
      })
    },
    components: {
      ApiTokens
    },
    data () {
      return {
        deployments: []
      }
    }
  }
</script>
