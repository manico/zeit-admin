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
        <v-progress-linear :indeterminate="true"
                           height="2"
                           class="ma-0"
                           color="red"
                           v-if="loadingFiles">
        </v-progress-linear>
        <v-list dense
                v-if="files.length">
          <v-list-group v-for="item in files"
                        v-model="item.isActive"
                        :key="item.name">
            <v-list-tile slot="item"
                         @click="setFile(item)">
              <v-list-tile-action class="fileview-icon">
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
          <v-progress-linear :indeterminate="true"
                             height="2"
                             class="ma-0"
                             color="red"
                             v-if="loadingFile">
          </v-progress-linear>
          <v-card-text>
            <pre v-if="canRenderContent"><code v-html="file.content"></code></pre>
            <div v-else
                 class="text-xs-center ma-4">
              <v-icon x-large>description</v-icon>
            </div>
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
        loadingFiles: false,
        loadingFile: false,
        worker: null
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
        ],
        link: [
          {
            rel: 'stylesheet',
            href: '//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atom-one-dark.min.css'
          }
        ]
      }
    },
    computed: {
      canRenderContent () {
        return this.file && !this.file.isFolder
      },
      deployments () {
        return this.$store.getters.deployments()
      }
    },
    watch: {
      deployment () {
        this.getFiles()
        this.file = null
      }
    },
    methods: {
      getFiles () {
        this.loadingFiles = true
        return api.now.deployments.getDeploymentFiles(
          this.$store.getters.authorization,
          this.deployment
        ).then((result) => {
          this.files = result.files
          this.loadingFiles = false
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

          this.worker.postMessage(content)
        })
      },
      getFileIcon (file) {
        return file.isFolder ? (file.isActive ? 'folder_open' : 'folder') : 'description'
      },
      registerHighlightWorker () {
        this.worker = new Worker('/workers/highlight.js')

        this.worker.onmessage = (event) => {
          this.$set(this.file, 'content', event.data)
        }
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
        this.registerHighlightWorker()
      }
    }
  }
</script>
