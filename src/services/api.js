import axios from 'axios';

// Instancia de Axios configurada para tu API de backend
const api = axios.create({
  baseURL: 'http://localhost:3000/api', // <--- ¡ASEGÚRATE DE QUE ESTA URL SEA CORRECTA PARA TU BACKEND!
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;