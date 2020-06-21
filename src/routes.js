import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'main',
      component: () => import('./pages/MainPage.vue')
    },
    {
      path: '/api/invite/:grIdHash',
      name: 'invite',
      component: () => import('./pages/InvitePage.vue')
    }
  ]
})
