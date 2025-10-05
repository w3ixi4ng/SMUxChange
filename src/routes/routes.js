// src/routes/routes.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/Home.vue';
import ExchangeInfo from '../components/ExchangeInfo.vue'; 

const routes = [
    { path: '/', redirect: '/home' },      
    { path: '/info', component: ExchangeInfo, name: 'info' },
    { path: '/home', component: Home, name: 'home' },
];

export default createRouter({
    history: createWebHistory(),
    routes,
});
