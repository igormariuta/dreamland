import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store'

import { eventBus } from './main'

Vue.use(VueRouter)

// = = = = = = = = =

const ifLoggedIn = (to, from, next) => {
  if (store.getters.loggedIn) {
    next()
    return
  }
  next('/discover')
}

const ifNotLoggedIn = (to, from, next) => {
  if (!store.getters.loggedIn) {
    next()
    return
  }
  next('/')
}

// = = = = = = = = =

const routes = [{
  path: '/',
  name: 'home',
  beforeEnter: ifLoggedIn,
  component: () => import('./views/home.vue'),
}, {
  path: '/discover',
  name: 'discover',
  component: () => import('./views/discover.vue'),
}, {
  path: '/profile',
  name: 'profiles',
  component: () => import('./views/profiles.vue')
}, {
  path: '/profile/:id',
  name: 'profile',
  component: () => import('./views/profile.vue'),
  beforeEnter: (to, from, next) => {

    eventBus.$emit('closeModalProject', false);
    next()

  }
}, {
  path: '/project/:id',
  name: 'project',
  component: () => import('./views/project.vue'),
  beforeEnter: (to, from, next) => {

    if(from.name !== null) {
      next(false)
      
      eventBus.$emit('showModalProject', to.params.id);
      history.pushState({}, null, `/project/${to.params.id}`)
    }
    else {
      next()
    }

  }
}, {
  path: '/login',
  name: 'login',
  meta: {
    layout: 'auth'
  },
  beforeEnter: ifNotLoggedIn,
  component: () => import('./views/login.vue')
}, {
  path: '/register',
  name: 'register',
  meta: {
    layout: 'auth'
  },
  beforeEnter: ifNotLoggedIn,
  component: () => import('./views/register.vue')
}]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior () {
    return { x: 0, y: 0 }
  }
})

export default router