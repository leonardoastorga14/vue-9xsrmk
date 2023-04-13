<template>
  <v-app>
    <v-navigation-drawer app permanent>
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="title">FRAMEWORKS</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>ToDo List</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="primary" fab dark @click="$refs.dialog.open()">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-app-bar>
    <v-content>
      <TodoList />
    </v-content>
    <TodoDialog ref="dialog" />
    <v-snackbar v-model="snackbar" :color="snackbarColor">{{ snackbarText }}</v-snackbar>
  </v-app>
</template>

<script>
import TodoDialog from './components/TodoDialog.vue'

export default {
  name: 'App',
  components: {
    TodoDialog
  },
  data() {
    return {
      snackbar: false,
      snackbarText: '',
      snackbarColor: 'success'
    }
  },
  methods: {
    showToast(message, color) {
      this.snackbarText = message
      this.snackbarColor = color
      this.snackbar = true
    }
  }
}
</script>

<style>
.title {
  font-size: 24px;
  font-weight: bold;
}
</style>