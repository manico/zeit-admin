<template>
  <v-container fluid
               class="deployments">
    <v-layout>
      <v-flex>
        <v-expansion-panel popout
                           expand
                           focusable
                           v-if="deploymentProjects">
          <v-expansion-panel-content :key="project.name"
                                     :class="[panelClass(index)]"
                                     v-model="activePanels[index]"
                                     v-for="(project, index) in deploymentProjects">
            <div slot="header">
              <v-icon class="mr-2">toc</v-icon>
              <span>{{project.name}}</span>
            </div>
            <v-card>
              <v-data-table dark
                            hide-headers
                            :items="getProjectDeployments(project)"
                            :pagination.sync="pagination">
                <template slot="items"
                          slot-scope="props">
                  <tr @mouseover="activeRow = props.item"
                      @mouseleave="activeRow = null">
                    <td class="column-scale text-xs-center pr-0">
                      <v-progress-circular :size="24"
                                           :value="getDeploymentScaleProgress(props.item)"
                                           :color="getDeploymentScaleColor(props.item)">
                      </v-progress-circular>
                    </td>
                    <td>
                      <a :href="getDeploymentUrl(props.item)"
                         class="deployment-url"
                         target="_blank">
                        {{ props.item.url }}
                      </a>
                    </td>
                    <td class="column-date text-xs-center">{{ formatDateTime(props.item.created) }}</td>
                    <td class="column-type text-xs-center">{{ props.item.type }}</td>
                    <td class="column-state text-xs-center">
                      <v-icon class="subheading mr-2"
                              :color="getDeploymentColor(props.item)">
                        {{getDeploymentIcon(props.item)}}
                      </v-icon>
                      <span>{{ props.item.state }}</span>
                    </td>
                    <td class="column-delete text-xs-center">
                      <delete-dialog entity="deployment"
                                     v-show="activeRow === props.item"
                                     @confirm="deleteDeployment(props.item)">
                        <v-btn icon
                               slot="activator">
                          <v-icon color="red">close</v-icon>
                        </v-btn>
                      </delete-dialog>
                    </td>
                  </tr>
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
  import DeleteDialog from '~/components/DeleteDialog'

  export default {
    asyncData ({ store }) {
      if (!store.getters.deploymentProjects.length) {
        return store.dispatch('loadDeployments')
      }
    },
    components: {
      DeleteDialog
    },
    data () {
      return {
        activePanels: [true],
        activeRow: null,
        pagination: {
          rowsPerPage: 10
        }
      }
    },
    head () {
      return {
        title: 'Deployments',
        meta: [
          {
            hid: 'description',
            name: 'description',
            content: 'List all the deployments under the account'
          }
        ]
      }
    },
    computed: {
      authToken () {
        return this.$store.getters.authToken
      },
      deploymentProjects () {
        return this.$store.getters.deploymentProjects
      }
    },
    watch: {
      authToken () {
        this.loadDeployments()
      }
    },
    methods: {
      deleteDeployment (deployment) {
        this.$store.dispatch('deleteDeployment', deployment)
      },
      formatDateTime (value) {
        return moment(parseInt(value, 10)).format('LLL')
      },
      getDeploymentColor (deployment) {
        switch (deployment.state) {
          case 'BUILD_ERROR':
          case 'DEPLOYMENT_ERROR':
            return 'red'
          case 'DEPLOYING':
          case 'BOOTED':
          case 'BUILDING':
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
          case 'DEPLOYMENT_ERROR':
            return 'cloud_off'
          case 'DEPLOYING':
          case 'BOOTED':
          case 'BUILDING':
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
      getDeploymentScaleColor (deployment) {
        const scale = deployment.scale
        if (scale && scale.current > 0) {
          const diff = scale.max - scale.min
          const progress = Math.ceil((scale.current / diff) * 100)
          if (progress >= 50) {
            return 'orange'
          } else if (progress >= 75) {
            return 'red'
          }
        }

        return 'green'
      },
      getDeploymentScaleProgress (deployment) {
        const scale = deployment.scale
        if (scale && scale.current > 0) {
          return Math.ceil((scale.current / scale.max) * 100)
        }

        return 0
      },
      getProjectDeployments (project) {
        return this.$store.getters.deployments(project)
      },
      isFirstActivePanel (index) {
        return index === 0 && this.activePanels[index]
      },
      loadDeployments () {
        this.$store.dispatch('loadDeployments')
      },
      panelClass (index) {
        return this.isFirstActivePanel(index) ? 'mt-0' : null
      }
    }
  }
</script>
