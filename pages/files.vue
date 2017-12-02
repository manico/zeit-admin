<template>
  <v-container fluid
               grid-list-lg>
    <v-layout row
              wrap>
      <v-flex xs12
              mb-4
              v-if="deployment">
        <v-select autocomplete
                  spellcheck="false"
                  return-object
                  :items="deployments"
                  v-model="deployment"
                  label="Deployment"
                  item-text="url"
                  item-value="uid"
                  :hint="deployment.name"
                  persistent-hint>
        </v-select>
      </v-flex>
      <v-flex xs12
              md4
              lg3>
        <v-list>
          <v-list-group v-for="item in files"
                        v-model="item.isActive"
                        :key="item.name">
            <v-list-tile slot="item"
                         @click="setFile(item)">
              <v-list-tile-action>
                <v-icon>{{ getFileIcon(item) }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{ item.name }}</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action v-if="item.isFolder">
                <v-icon>keyboard_arrow_down</v-icon>
              </v-list-tile-action>
            </v-list-tile>
          </v-list-group>
        </v-list>
      </v-flex>
      <v-flex xs12
              md8
              lg9>
        <v-card flat
                class="fileview">
          <v-progress-linear v-bind:indeterminate="true"
                             height="2"
                             class="ma-0"
                             color="red"
                             v-if="loadingFile">
          </v-progress-linear>
          <v-card-text>
            <pre v-if="file"><code>{{file.content}}</code></pre>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import api from '~/api'

  export default {
    asyncData ({ store }) {
      if (store.getters.authorization && !store.getters.deployments().length) {
        return store.dispatch('loadDeployments')
      }
    },
    data () {
      return {
        deployment: null,
        files: [],
        file: null,
        loadingFile: false
      }
    },
    head () {
      return {
        title: 'Files',
        meta: [
          {
            hid: 'description',
            name: 'description',
            content: 'List all deployment source files'
          }
        ]
      }
    },
    computed: {
      deployments () {
        return this.$store.getters.deployments()
      }
    },
    watch: {
      deployment () {
        this.getFiles()
      }
    },
    methods: {
      getFiles () {
        return api.now.deployments.getDeploymentFiles(
          this.$store.getters.authorization,
          this.deployment
        ).then((result) => {
          this.files = result.files
        })
      },
      getFileContent () {
        this.loadingFile = true
        return api.now.deployments.getDeploymentFileContent(
          this.$store.getters.authorization,
          this.deployment,
          this.file
        ).then((content) => {
          this.$set(this.file, 'content', content)
          this.loadingFile = false
        })
      },
      getFileIcon (file) {
        return file.isFolder ? (file.isActive ? 'folder_open' : 'folder') : 'description'
      },
      setFile (file) {
        this.file = file

        if (!this.file.isFolder) {
          this.getFileContent()
        }
      }
    },
    mounted () {
      if (this.deployments.length) {
        this.deployment = this.deployments[0]
      }
    }
  }
</script>
