import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://shopjordanio.netlify.app/.netlify/functions/',
});
