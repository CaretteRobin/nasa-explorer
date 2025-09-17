import { createRouter, createWebHistory } from 'vue-router'

const Home = () => import('../pages/Home.vue')
const Apod = () => import('../pages/Apod.vue')
const Mars = () => import('../pages/Mars.vue')
const Epic = () => import('../pages/Epic.vue')
const Library = () => import('../pages/Library.vue')
const Neo = () => import('../pages/Neo.vue')
const SpaceWeather = () => import('../pages/SpaceWeather.vue')
const Earth = () => import('../pages/Earth.vue')
const Favorites = () => import('../pages/Favorites.vue')
const About = () => import('../pages/About.vue')

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/apod', name: 'apod', component: Apod },
  { path: '/mars', name: 'mars', component: Mars },
  { path: '/epic', name: 'epic', component: Epic },
  { path: '/library', name: 'library', component: Library },
  { path: '/neo', name: 'neo', component: Neo },
  { path: '/space-weather', name: 'space-weather', component: SpaceWeather },
  { path: '/earth', name: 'earth', component: Earth },
  { path: '/favorites', name: 'favorites', component: Favorites },
  { path: '/about', name: 'about', component: About },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
