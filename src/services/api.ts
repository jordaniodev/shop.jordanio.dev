import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://ecomercjordanio.netlify.app/.netlify/functions/',
});
