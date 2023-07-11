import { createRouter, createWebHistory } from 'vue-router'
import AboutView from '../views/AboutView.vue'
import ProductList from '../components/product/ProductList.vue'
import ProductOrder from '../components/product/ProductOrder.vue'
import OrderList from '../components/product/OrderList.vue'
import storeJoin from '@/components/storeaccount/storeJoin.vue'
import storeMyinfo from '@/components/storeaccount/storeMyinfo.vue'
import storeList from '@/components/storeaccount/storeList.vue'
import storeLogin from '@/components/storeaccount/storeLogin.vue'
import storeState from '@/components/storeaccount/storeState.vue'
import storeManagement from '@/components/storeaccount/storeManagement.vue'

import StoreInventory from '@/components/product/StoreInventory.vue'

import latitude from '@/components/storeaccount/latitude.vue'

// import marker from '@/components/storeaccount/marker.vue'




import ScheDule from '@/components/schedule/ScheDule.vue'
import EmpAdd from '@/components/emp/EmpAdd.vue'
import EmpList from '@/components/emp/EmpList.vue'
import WorkLogs from '@/components/worklogs/WorkLogs.vue'
import ScheduleModal from '@/components/schedule/ScheduleModal.vue'
import ScheduleAddModal from '@/components/schedule/ScheduleModal.vue'

import BranchSales from '@/components/sales/BranchSales.vue'
import HeadSales from '@/components/sales/HeadSales.vue'
import HeadSalesDetail from '@/components/sales/HeadSalesDetail.vue'
import OrderDetail from '@/components/product/OrderDetail.vue'

import ReceiveMsg from '@/components/msg/ReceiveMsg.vue'
import AddMsg from '@/components/msg/AddMsg.vue'
import SendMsg from '@/components/msg/SendMsg.vue'
import TempMsg from '@/components/msg/TempMsg.vue'
import DelMsg from '@/components/msg/DelMsg.vue'
import DetailMsg from '@/components/msg/DetailMsg.vue'
import MarkMsg from '@/components/msg/MarkMsg.vue'
import ReplyMsg from '@/components/msg/ReplyMsg.vue'
import AddTempMsg from '@/components/msg/AddTempMsg.vue'
import SideBar from '../views/SideBar.vue'

import NoticeList from '@/components/notice/NoticeList.vue'
import NoticeWriter from '@/components/notice/NoticeWriter.vue';
import HeadNotice from '@/components/notice/HeadNotice.vue';
import StoreNotice from '@/components/notice/StoreNotice.vue';

import VocList from '@/components/voc/VocList.vue';
import VocWriter from '@/components/voc/VocWriter.vue';
import HeadVoc from '@/components/voc/HeadVoc.vue';
import StoreVoc from '@/components/voc/StoreVoc.vue';

// 인덱스
import IndexNetsales from '@/components/index/IndexNetsales.vue';
import IndexNotice from '@/components/index/IndexNotice.vue';
import IndexOrder from '@/components/index/IndexOrder.vue';
import IndexVoc from '@/components/index/IndexVoc.vue';

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
    path: '/storeList',
    name: 'storeList',
    component: storeList
  },
  {
    path: '/latitude',
    name: 'latitude',
    component: latitude
  },
   {
    path: '/storeManagement',
    name: 'storeManagement',
    component: storeManagement
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
    path: '/headsales',
    name: 'headsales',
    component: HeadSales
  },
  {
    path: '/branchsales',
    name: 'branchsales',
    component: BranchSales
  },
  {
    path: '/headsalesDetail',
    name: 'headsalesDetail',
    component: HeadSalesDetail,
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
    path: '/AddMsg',
    name: 'AddMsg', 
    component: AddMsg
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
    path: '/DetailMsg',
    name: 'DetailMsg',
    component: DetailMsg
  },
  {
    path: '/MarkMsg',
    name: 'MarkMsg',
    component: MarkMsg
  },
  {
    path: '/ReplyMsg',
    name: 'ReplyMsg',
    component: ReplyMsg
  },
  {
    path: '/AddTempMsg',
    name: 'AddTempMsg',
    component: AddTempMsg
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
    name: 'NoticeWriter',
    component: NoticeWriter
  },
  {
    path: '/HeadNotice',
    name: 'HeadNotice',
    component: HeadNotice
  },
  {
    path: '/StoreNotice',
    name: 'StoreNotice',
    component: StoreNotice
  },
  {
    path: '/VocList',
    name: 'VocList',
    component: VocList
  },
  {
    path: '/VocWriter',
    name: 'VocWriter',
    component: VocWriter
  },
  {
    path: '/HeadVoc',
    name: 'HeadVoc',
    component: HeadVoc
  },
  {
    path: '/StoreVoc',
    name: 'StoreVoc',
    component: StoreVoc
  },
  {
    path:'/inventory',
    name:'StoreInventory',
    component :StoreInventory
  },
  {
    path : '/schedulemodal',
    name : 'ScheduleModal',
    component : ScheduleModal
  },
  {
    path : '/scheduleaddmodal',
    name : 'ScheduleAddModal',
    component : ScheduleAddModal
  },
  // 인덱스
  {
    path : '/indexnetsales',
    name : 'IndexNetsales',
    component : IndexNetsales
  },
  {
    path : '/indexnotice',
    name : 'IndexNotice',
    component : IndexNotice
  },
  {
    path : '/indexorder',
    name : 'IndexOrder',
    component : IndexOrder
  },
  {
    path : '/indexvoc',
    name : 'IndexVoc',
    component : IndexVoc
  }
  

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router