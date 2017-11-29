<template>
  <v-container fluid>
    <v-layout>
      <v-flex>
        <v-expansion-panel popout
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
                  <td>{{ props.item.url }}</td>
                  <td>{{ formatDateTime(props.item.created) }}</td>
                  <td>{{ props.item.type }}</td>
                  <td>{{ props.item.state }}</td>
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
      return store.dispatch('getDeployments')
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
    methods: {
      formatDateTime (value) {
        return moment(parseInt(value, 10)).format('LLL')
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
