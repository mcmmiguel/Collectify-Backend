import axios from 'axios';

const api = axios.create({
    baseURL: process.env.SALESFORCE_MY_DOMAIN,
});

export default api;