<template>
  <div>
    <v-card v-if="deployments">
      <v-data-table dark
                    hide-headers
                    :items="deployments"
                    :pagination.sync="pagination">
        <template slot="items"
                  slot-scope="props">
          <td>{{ props.item.name }}</td>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
  import api from '~/api'

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
    data () {
      return {
        deployments: null,
        pagination: {
          rowsPerPage: 10
        }
      }
    }
  }
</script>
