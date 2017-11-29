<template>
  <v-container fluid>
    <v-layout>
      <v-flex>
        <v-expansion-panel popout
                           expand
                           focusable>
          <v-expansion-panel-content :key="project.name"
                                     :class="[panelClass(index)]"
                                     v-model="activePanels[index]"
                                     v-for="(project, index) in deploymentProjects">
            <div slot="header">{{project.name}}</div>
            <v-card>
              <v-data-table dark
                            hide-headers
                            :items="getProjectDeployments(project)"
                            :pagination.sync="pagination">
                <template slot="items"
                          slot-scope="props">
                  <td>
                    <a :href="getDeploymentUrl(props.item)"
                       class="deployment-url"
                       target="_blank">
                      {{ props.item.url }}
                    </a>
                  </td>
                  <td>{{ formatDateTime(props.item.created) }}</td>
                  <td>{{ props.item.type }}</td>
                  <td>
                    <v-icon class="subheading mr-2"
                            :color="getDeploymentColor(props.item)">
                      {{getDeploymentIcon(props.item)}}
                    </v-icon>
                    <span>{{ props.item.state }}</span>
                  </td>
                </template>
              </v-data-table>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import moment from 'moment'

  export default {
    asyncData ({ store }) {
      const requiresData = !store.getters.deploymentProjects.length
      if (requiresData) return store.dispatch('getDeployments')
    },
    data () {
      return {
        activePanels: [true],
        deploymentProjects: [],
        pagination: {
          rowsPerPage: 10
        }
      }
    },
    head () {
      return {
        title: 'Deployments',
        meta: [
          { hid: 'description', name: 'description', content: 'List all the deployments under the account corresponding to the API token.' }
        ]
      }
    },
    methods: {
      formatDateTime (value) {
        return moment(parseInt(value, 10)).format('LLL')
      },
      getDeploymentColor (deployment) {
        switch (deployment.state) {
          case 'BUILD_ERROR':
            return 'red'
          case 'DEPLOYING':
            return 'orange'
          case 'FROZEN':
            return 'blue'
          default:
            return 'green'
        }
      },
      getDeploymentIcon (deployment) {
        switch (deployment.state) {
          case 'BUILD_ERROR':
            return 'cloud_off'
          case 'DEPLOYING':
            return 'cloud_upload'
          case 'FROZEN':
            return 'cloud_queue'
          default:
            return 'cloud'
        }
      },
      getDeploymentUrl (deployment) {
        return `https://${deployment.url}`
      },
      getProjectDeployments (project) {
        return this.$store.getters.deployments(project)
      },
      isFirstActivePanel (index) {
        return index === 0 && this.activePanels[index]
      },
      panelClass (index) {
        return this.isFirstActivePanel(index) ? 'mt-0' : null
      }
    },
    mounted () {
      this.deploymentProjects = this.$store.getters.deploymentProjects
    }
  }
</script>

<style scoped>
  .deployment-url {
    text-decoration: none;
    color: inherit;
  }
</style>