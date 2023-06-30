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

import BranchSales from '@/components/sales/BranchSales.vue'


import OrderDetail from '@/components/product/OrderDetail.vue'

import ReceiveMsg from '@/components/msg/ReceiveMsg.vue'
import SendMsg from '@/components/msg/SendMsg.vue'
import TempMsg from '@/components/msg/TempMsg.vue'
import DelMsg from '@/components/msg/DelMsg.vue'
import SideBar from '../views/SideBar.vue'

import NoticeList from '@/components/notice/NoticeList.vue'
import NoticeWriter from '@/components/notice/NoticeWriter.vue'






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
    path: '/SendMsg',
    name: 'SendMsg',
    component: SendMsg
  },
  {
    path: '/TempMsg',
    name: 'TempMsg',
    component: TempMsg
  },
  {
    path: '/DelMsg',
    name: 'DelMsg',
    component: DelMsg
  },
  {
    path: '/SideBar',
    name: 'SideBar',
    component: SideBar
  },
  {
    path: '/NoticeList',
    name: 'NoticeList',
    component: NoticeList
  },
  {
    path: '/NoticeWriter',
    name: '/NoticeWriter',
    component: NoticeWriter
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
