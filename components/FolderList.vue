<template>
  <div v-if="list && list.length">
    <v-expansion-panel expand
                       class="transparent elevation-0"
                       :class="[ident]"
                       v-if="folders">
      <v-expansion-panel-content :key="item.name"
                                 v-for="item in folders">
        <div slot="header">
          <v-icon class="mr-2">folder</v-icon>
          <span>{{ item.name }}</span>
        </div>
        <div v-if="item.children">
          <slot :folders="getFolders(item.children)"></slot>
          <file-list :files="getFiles(item.children)"
                     :ident="ident"
                     @select="onSelectFile">
          </file-list>
        </div>
      </v-expansion-panel-content>
    </v-expansion-panel>
    <file-list :files="files"
               @select="onSelectFile">
    </file-list>
  </div>
</template>

<script>
  import _filter from 'lodash/filter'
  import FileList from '~/components/FileList'

  export default {
    components: {
      FileList
    },
    props: {
      list: {
        type: Array
      },
      ident: {
        type: String
      }
    },
    data () {
      return {
      }
    },
    computed: {
      folders () {
        return this.getFolders(this.list)
      },
      files () {
        return this.getFiles(this.list)
      }
    },
    methods: {
      getFiles (list) {
        return _filter(list, { isFolder: false })
      },
      getFolders (list) {
        return _filter(list, { isFolder: true })
      },
      onSelectFile (file) {
        this.$emit('select', file)
      }
    }
  }
</script>
