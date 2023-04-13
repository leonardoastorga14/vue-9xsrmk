<template>
  <div>
    <v-dialog v-model="dialog" persistent>
      <todo-dialog
        :todo="selectedTodo"
        :todos="todos"
        @dialog-closed="dialog = false"
        @add-todo="addTodo"
        @update-todo="updateTodo"
      ></todo-dialog>
    </v-dialog>
    <v-card>
      <v-card-title class="headline">To-Do List</v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="filteredTodos"
          :search="search"
          :sort-by="sortBy"
          :sort-desc="sortDesc"
          :loading="loading"
          :loading-text="'Loading...'"
          :no-data-text="'No data available'"
          :footer-props="{
            itemsPerPageText: 'Items per page:',
            itemsPerPageAllText: 'All',
            itemsPerPageOptions: [5, 10, 15],
            showCurrentPage: true,
            'showFirstLastPage': true
          }"
          :items-per-page="perPage"
          :page.sync="page"
          :server-items-length="totalTodos"
          @update:sortBy="sortBy = $event"
          @update:sortDesc="sortDesc = $event"
        >
          <template v-slot:item="props">
            <todo-item
              :todo="props.item"
              @update-complete="updateComplete"
              @delete-todo="deleteTodo"
              @open-dialog="openDialog"
            ></todo-item>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <v-btn
      fab
      dark
      fixed
      bottom
      right
      color="primary"
      class="mt-5 mr-5"
      @click="openDialog"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </div>
</template>

<script>
import TodoItem from './TodoItem.vue'
import TodoDialog from './TodoDialog.vue'
import { db } from '../firebase'

export default {
  name: 'TodoList',
  components: {
    TodoItem,
    TodoDialog
  },
  data() {
    return {
      todos: [],
      headers: [
        { text: 'Task', value: 'task' },
        { text: 'Description', value: 'description' },
        { text: 'Deadline', value: 'deadline' },
        { text: 'Priority', value: 'priority' },
        { text: 'Is Complete', value: 'isComplete' },
        { text: 'Action', value: 'action' }
      ],
      search: '',
      sortBy: 'task',
      sortDesc: false,
      loading: true,
      page: 1,
      perPage: 5,
      totalTodos: 0,
      dialog: false,
      selectedTodo: null
    }
  },
  async created() {
    await this.loadTodos()
  },
  computed: {
    filteredTodos() {
      const regex = new RegExp(this.search, 'i')
      return this.todos.filter(todo => {
        return regex.test(todo.task) || regex.test(todo.description)
      })
    }
  },
  methods: {
    async loadTodos() {
      try {
        this.loading = true
        const snapshot = await db.collection('todos').get()
        this.todos = snapshot.docs.map(doc => {
          const data = doc.data()
          return { id: doc.id, ...data }
        })
        this.totalTodos = this.todos.length
              } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    async addTodo(todo) {
      try {
        const docRef = await db.collection('todos').add(todo)
        this.todos.push({ id: docRef.id, ...todo })
        this.totalTodos++
        this.$toasted.show('Task added successfully', { type: 'success' })
      } catch (error) {
        console.error(error)
      }
    },
    async updateTodo({ id, todo }) {
      try {
        await db.collection('todos').doc(id).update(todo)
        const index = this.todos.findIndex(t => t.id === id)
        this.todos.splice(index, 1, { id, ...todo })
        this.$toasted.show('Task updated successfully', { type: 'success' })
      } catch (error) {
        console.error(error)
      }
    },
    async deleteTodo (id) {
      try {
        await db.collection('todos').doc(id).delete()
        const index = this.todos.findIndex(t => t.id === id)
        this.todos.splice(index, 1)
        this.totalTodos--
        this.$toasted.show('Task deleted successfully', { type: 'success' })
      } catch (error) {
        console.error(error)
      }
    },
    updateComplete ({ id, isComplete }) {
      const index = this.todos.findIndex(t => t.id === id)
      this.todos[index].isComplete = isComplete
    },
    openDialog (todo = null) {
      this.selectedTodo = todo
      this.dialog = true
    }
  }
}
</script>

     
