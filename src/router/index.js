import { createRouter, createWebHistory } from 'vue-router'
import AboutView from '../views/AboutView.vue'
import ProductList from '../components/product/ProductList.vue'
import ProductOrder from '../components/product/ProductOrder.vue'
import OrderList from '../components/product/OrderList.vue'
import storeJoin from '@/components/storeaccount/storeJoin.vue'
import storeMyinfo from '@/components/storeaccount/storeMyinfo.vue'
import storeState from '@/components/storeaccount/storeState.vue'
import storeLogin from '@/components/storeaccount/storeLogin.vue'
import location from '@/components/storeaccount/location.vue'
import latitude from '@/components/storeaccount/latitude.vue'
import marker from '@/components/storeaccount/marker.vue'

import ScheDule from '@/components/schedule/ScheDule.vue'
import EmpAdd from '@/components/emp/EmpAdd.vue'
import EmpList from '@/components/emp/EmpList.vue'
import WorkLogs from '@/components/worklogs/WorkLogs.vue'

import BranchSales from '@/components/sales/BranchSales.vue'


import OrderDetail from '@/components/product/OrderDetail.vue'

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
    path: '/location',
    name: 'location',
    component: location
  },
  {
    path: '/latitude',
    name: 'latitude',
    component: latitude
  },
  {
    path: '/marker',
    name: 'marker',
    component: marker
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
  },
  {

    path: '/branchsales',
    name: 'branchsales',
    component: BranchSales
  },
  {
    path: '/OrderDetail',
    name: 'OrderDetail',
    component: OrderDetail,
    props: true
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
