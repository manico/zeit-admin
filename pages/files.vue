<template>
  <v-container fluid
               fill-height
               grid-list-lg
               pb-2
               v-if="isLoaded">
    <v-layout column>
      <v-flex d-flex
              style="flex-grow:0">
        <v-layout row
                  wrap
                  pb-3>
          <v-flex lg6>
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
        </v-layout>
      </v-flex>
      <v-layout d-flex
                row
                wrap
                px-2>
        <v-flex xs12
                md4
                lg3
                d-flex>
          <v-card class="filetree">
            <v-progress-linear :indeterminate="true"
                               height="2"
                               class="ma-0"
                               color="red"
                               v-if="loadingFiles">
            </v-progress-linear>
            <div class="filetree-content">
              <folder-list :list="files"
                           @select="onSelectFile">
                <template slot-scope="props">
                  <folder-list :list="props.folders"
                               ident="pl-3"
                               @select="onSelectFile">
                  </folder-list>
                </template>
              </folder-list>
            </div>
          </v-card>
        </v-flex>
        <v-flex xs12
                md8
                lg9
                d-flex>
          <v-card flat
                  class="fileview">
            <v-progress-linear :indeterminate="true"
                               height="2"
                               class="ma-0"
                               color="red"
                               v-if="loadingFile">
            </v-progress-linear>
            <div class="fileview-content"
                 v-if="canRenderContent">
              <pre><code v-html="file.content"></code></pre>
            </div>
            <v-container v-else
                         fill-height>
              <v-layout justify-center
                        align-center>
                <v-icon x-large>description</v-icon>
              </v-layout>
            </v-container>
          </v-card>
        </v-flex>
      </v-layout>
    </v-layout>
  </v-container>
</template>

<script>
  import api from '~/api'
  import FolderList from '~/components/FolderList'

  export default {
    asyncData ({ store }) {
      if (store.getters.authorization && !store.getters.deployments().length) {
        return store.dispatch('loadDeployments')
      }
    },
    components: {
      FolderList
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
      },
      isLoaded () {
        return this.deployments && this.deployment
      }
    },
    watch: {
      deployment (value) {
        this.file = null
        this.files = []

        if (value) {
          this.getFiles()
        }
      }
    },
    methods: {
      getFiles () {
        this.loadingFiles = true
        return api.now.deployments.getDeploymentFiles(
          this.deployment
        ).then((result) => {
          this.files = result.files
          this.loadingFiles = false
        })
      },
      getFileContent () {
        this.loadingFile = true
        return api.now.deployments.getDeploymentFileContent(
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
      onSelectFile (file) {
        this.file = file
        this.getFileContent()
      },
      registerHighlightWorker () {
        this.worker = new Worker('/workers/highlight.js')

        this.worker.onmessage = (event) => {
          this.$set(this.file, 'content', event.data)
        }
      },
      setDeployment () {
        this.deployment = this.deployments.length ? this.deployments[0] : null
      }
    },
    mounted () {
      this.registerHighlightWorker()
      this.setDeployment()
    }
  }
</script>
