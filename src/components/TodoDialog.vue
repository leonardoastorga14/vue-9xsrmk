<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-toolbar dark color="primary">
        <v-toolbar-title>{{ dialogTitle }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-form ref="form" v-model="valid">
          <v-text-field
            v-model="todo.title"
            label="Task"
            required
            :rules="titleRules"
          ></v-text-field>
          <v-text-field
            v-model="todo.description"
            label="Description"
            multi-line
          ></v-text-field>
          <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="todo.deadline"
                label="Deadline"
                readonly
                required
                v-on="on"
                :rules="deadlineRules"
              ></v-text-field>
            </template>
            <v-date-picker v-model="todo.deadline" no-title scrollable>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
              <v-btn text color="primary" @click="$refs.form.validate()">OK</v-btn>
            </v-date-picker>
          </v-menu>
          <v-radio-group v-model="todo.priority" label="Priority" row>
            <v-radio label="Low" value="low"></v-radio>
            <v-radio label="Medium" value="medium"></v-radio>
            <v-radio label="High" value="high"></v-radio>
          </v-radio-group>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="dialog = false">Cancel</v-btn>
        <v-btn text color="primary" :disabled="!valid" @click="saveTodo">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialog: Boolean,
    selectedTodo: Object
  },
  data () {
    return {
      todo: {
        title: '',
        description: '',
        deadline: null,
        priority: ''
      },
      valid: false,
      menu: false
    }
  },
  computed: {
    dialogTitle () {
      return this.selectedTodo ? 'Edit Task' : 'Add Task'
    },
    titleRules () {
      return [
        v => !!v || 'Task is required',
        v => !this.isTitleDuplicate(v) || 'Task already exists'
      ]
    },
    deadlineRules () {
      return [
        v => !!v || 'Deadline is required',
        v => new Date(v).getTime() > new Date().getTime() || 'Deadline must be in the future'
      ]
    }
  },
  methods: {
    saveTodo () {
      const todo = { ...this.todo }
      if (this.selectedTodo) {
        this.$emit('update-todo', { id: this.selectedTodo.id, todo })
      } else {
        this.$emit('add-todo', todo)
      }
      this.dialog = false
          },
    resetTodo () {
      this.todo = {
        title: '',
        description: '',
        deadline: null,
        priority: ''
      }
      this.menu = false
      this.valid = false
      this.$refs.form.resetValidation()
    },
    isTitleDuplicate (title) {
      const titles = this.$store.getters.todos.map(todo => todo.title.toLowerCase())
      return !titles.includes(title.toLowerCase()) || this.selectedTodo?.title.toLowerCase() === title.toLowerCase()
    }
  },
  watch: {
    selectedTodo (val) {
      if (val) {
        this.todo = { ...val }
        this.menu = false
        this.valid = true
        this.$nextTick(() => {
          this.$refs.form.resetValidation()
        })
      } else {
        this.resetTodo()
      }
    }
  }
}
</script>

