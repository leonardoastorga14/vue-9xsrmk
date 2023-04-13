import { createApp} from 'vue';
import App from 'App.vue';
import TodoList from './components/TodoList.vue';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import vuetify from './plugins/vuetify';

firebase.initializeApp({
  // Your Firebase configuration
});

const db = firebase.firestore();
const auth = firebase.auth();

// Create the Vue app instance
const app = createApp({
  components: {
    App,
    TodoList,
  },
  template: '<TodoList />',
});

// Mount the app instance to the #app element
app.use(vuetify).mount('#app');
