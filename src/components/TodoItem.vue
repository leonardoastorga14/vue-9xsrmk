<template>
  <tr>
    <td>{{ todo.task }}</td>
    <td>{{ todo.description }}</td>
    <td>{{ formattedDeadline }}</td>
    <td>{{ todo.priority }}</td>
    <td>
      <v-checkbox
        :input-value="todo.isComplete"
        :disabled="!todo.editable"
        @change="updateComplete"
      ></v-checkbox>
    </td>
    <td>
      <v-icon
        v-if="todo.editable"
        @click="openDialog"
        class="mr-2"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        @click="deleteTodo"
        :disabled="!todo.editable"
      >
        mdi-delete
      </v-icon>
    </td>
  </tr>
</template>

<script>
export default {
  name: 'TodoItem',
  props: {
    todo: Object
  },
  computed: {
    formattedDeadline() {
      const date = new Date(this.todo.deadline)
      return date.toLocaleDateString()
    }
  },
  methods: {
    updateComplete() {
      this.$emit('update-complete', this.todo.id)
    },
    deleteTodo() {
      this.$emit('delete-todo', this.todo.id)
    },
    openDialog() {
      this.$emit('open-dialog', this.todo)
    }
  }
}
</script>