import './bootstrap';

import {createApp} from 'vue';
import store from './store.js';
import router from './router.js';
import 'dropify';
import 'dropify/dist/css/dropify.min.css';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import index from './components/index.vue';

toastr.options.newestOnTop = true
toastr.options.closeButton = true
toastr.options.timeOut = 5000
window.toastr = toastr

const app = createApp({})
app.component('index', index)
app.use(store)
app.use(router)
app.mount('#app')
