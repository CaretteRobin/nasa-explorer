import { createRouter, createWebHistory } from 'vue-router'
const Home = () => import('../pages/Home.vue')
const Players = () => import('../pages/Players.vue')
const Teams = () => import('../pages/Teams.vue')
const Games = () => import('../pages/Games.vue')
const Standings = () => import('../pages/Standings.vue')
const Leaders = () => import('../pages/Leaders.vue')

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/players', name: 'players', component: Players },
    { path: '/teams', name: 'teams', component: Teams },
    { path: '/games', name: 'games', component: Games },
    { path: '/standings', name: 'standings', component: Standings },
    { path: '/leaders', name: 'leaders', component: Leaders },
  ],
})
