import { createRouter, createWebHistory } from 'vue-router'
import AboutView from '../views/AboutView.vue'
import ProductList from '../components/product/ProductList.vue'
import ProductOrder from '../components/product/ProductOrder.vue'
import OrderList from '../components/product/OrderList.vue'
import storeJoin from '@/components/storeaccount/storeJoin.vue'
import storeMyinfo from '@/components/storeaccount/storeMyinfo.vue'
import storeState from '@/components/storeaccount/storeState.vue'
import storeLogin from '@/components/storeaccount/storeLogin.vue'
import ReceiveMsg from '@/components/msg/ReceiveMsg.vue'
import SideBar from '../views/SideBar.vue'





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
    path: '/ReceiveMsg',
    name: 'ReceiveMsg',
    component: ReceiveMsg
  },
  {
    path: '/SideBar',
    name: 'SideBar',
    component: SideBar
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
