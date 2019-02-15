import Vue from 'vue'
import Router from 'vue-router'
import PreviewArticle from '../components/PreviewArticle.vue'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/previewArticle',
      name: 'PreviewArticle',
      component: PreviewArticle
    }
  ]
})
export default router
