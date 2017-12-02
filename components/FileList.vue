<template>
  <v-list dense
          :class="[ident]"
          v-if="files">
    <v-list-group v-for="item in files"
                  v-model="item.isActive"
                  :key="item.name">
      <v-list-tile slot="item"
                   @click="select(item)">
        <v-list-tile-action class="fileview-icon">
          <v-icon>description</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>{{ item.name }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list-group>
  </v-list>
</template>

<script>
  export default {
    data () {
      return {
      }
    },
    props: {
      files: {
        type: Array
      },
      ident: {
        type: String
      }
    },
    methods: {
      select (file) {
        this.$emit('select', file)
      }
    }
  }
</script>
