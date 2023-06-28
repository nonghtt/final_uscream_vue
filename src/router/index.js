import { createRouter, createWebHistory } from 'vue-router'
import AboutView from '../views/AboutView.vue'
import ProductList from '../components/product/ProductList.vue'
import ProductOrder from '../components/product/ProductOrder.vue'
import OrderList from '../components/product/OrderList.vue'
import storeJoin from '@/components/storeaccount/storeJoin.vue'
import storeMyinfo from '@/components/storeaccount/storeMyinfo.vue'
import storeState from '@/components/storeaccount/storeState.vue'
import storeLogin from '@/components/storeaccount/storeLogin.vue'

import ScheDule from '@/components/schedule/ScheDule.vue'
import EmpAdd from '@/components/emp/EmpAdd.vue'
import EmpList from '@/components/emp/EmpList.vue'
import WorkLogs from '@/components/worklogs/WorkLogs.vue'

const routes = [
 
  {
    path: '/about',
    name: 'about',
    component: AboutView
  },
  {
    path:'/productlist',
    name: 'productlist',
    component:ProductList
  },
  {
    path:'/productorder',
    name: 'productorder',
    component:ProductOrder
  },
  {
    path:'/orderlist',
    name: 'orderlist',
    component:OrderList
  },
  {
    path: '/storeJoin',
    name: 'storeJoin',
    component: storeJoin
  },
  {
    path: '/storeMyinfo',
    name: 'storeMyinfo',
    component: storeMyinfo
  },
  {
    path: '/storeState',
    name: 'storeState',
    component: storeState
  },
  {
    path: '/',
    name: 'storeLogin',
    component: storeLogin
  },

  {
    path : '/schedule',
    name : 'schedule',
    component : ScheDule
  },
  {
    path : '/empadd',
    name : 'empadd',
    component : EmpAdd
  },
  {
    path : '/emplist',
    name : 'emplist',
    component : EmpList
  },
  {
    path : '/worklogs',
    name : 'worklogs',
    component : WorkLogs
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
