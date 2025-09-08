import axios from 'axios'
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://publicapi.dev/nba-rest-api',
  timeout: 10000,
})
