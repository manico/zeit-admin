<template>
  <v-container fluid
               class="deployments"
               v-if="isLoaded">
    <v-layout>
      <v-flex>
        <aliases-dialog :deployment="aliasingDeployment"
                        @cancel="aliasingDeploymentCancel()">
        </aliases-dialog>
        <delete-dialog entity="deployment"
                       :deletable="deletingDeployment"
                       @cancel="deleteDeploymentCancel()"
                       @confirm="deleteDeployment(deletingDeployment)">
        </delete-dialog>
        <v-expansion-panel popout
                           expand
                           focusable>
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
                      <v-tooltip top
                                 lazy
                                 :disabled="!props.item.scale">
                        <v-progress-circular :size="24"
                                             :value="getDeploymentScaleProgress(props.item)"
                                             :color="getDeploymentScaleColor(props.item)"
                                             slot="activator">
                        </v-progress-circular>
                        <span>Instances {{props.item.scale.current}}/{{props.item.scale.max}}</span>
                      </v-tooltip>
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
                    <td class="column-actions text-xs-center">
                      <div v-show="activeRow === props.item || props.item.loading">
                        <v-btn icon
                               class="mx-1"
                               :loading="props.item.loading"
                               :disabled="props.item.loading"
                               @click="updateDeployment(props.item)">
                          <v-icon>refresh</v-icon>
                        </v-btn>
                        <v-btn icon
                               class="mx-1"
                               @click="deleteDeploymentIntent(props.item)">
                          <v-icon color="red">close</v-icon>
                        </v-btn>
                        <v-btn icon
                               class="mx-1"
                               @click="aliasingDeploymentIntent(props.item)">
                          <v-icon color="green">language</v-icon>
                        </v-btn>
                      </div>
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
  import formattable from '~/mixins/formattable'
  import AliasesDialog from '~/components/AliasesDialog'
  import DeleteDialog from '~/components/DeleteDialog'

  export default {
    asyncData ({ store }) {
      if (store.getters.authorization && !store.getters.deploymentProjects.length) {
        return store.dispatch('loadDeployments')
      }
    },
    components: {
      AliasesDialog,
      DeleteDialog
    },
    mixins: [
      formattable
    ],
    data () {
      return {
        activePanels: [true],
        activeRow: null,
        aliasingDeployment: null,
        deletingDeployment: null,
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
      authorization () {
        return this.$store.getters.authorization
      },
      deploymentProjects () {
        return this.$store.getters.deploymentProjects
      },
      isLoaded () {
        return this.authorization && this.deploymentProjects.length
      }
    },
    watch: {
      authorization () {
        this.loadDeployments()
      }
    },
    methods: {
      aliasingDeploymentIntent (deployment) {
        this.aliasingDeployment = deployment
      },
      aliasingDeploymentCancel () {
        this.aliasingDeployment = null
      },
      deleteDeployment (deployment) {
        this.$store.dispatch('deleteDeployment', deployment).then(() => {
          this.deleteDeploymentCancel()
        })
      },
      deleteDeploymentCancel () {
        this.deletingDeployment = null
      },
      deleteDeploymentIntent (deployment) {
        this.deletingDeployment = deployment
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
          if (progress >= 75) {
            return 'red'
          } else if (progress >= 50) {
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
      },
      toggleLoadingItem (deployment) {
        this.$set(deployment, 'loading', !deployment.loading)
      },
      updateDeployment (deployment) {
        this.toggleLoadingItem(deployment)
        this.$store.dispatch('updateDeployment', deployment).then(() => {
          this.toggleLoadingItem(deployment)
        })
      }
    }
  }
</script>
