import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
// Add CSRF token header for Laravel
const tokenMeta = document.head.querySelector('meta[name="csrf-token"]');
if (tokenMeta && tokenMeta.content) {
	window.axios.defaults.headers.common['X-CSRF-TOKEN'] = tokenMeta.content;
}
