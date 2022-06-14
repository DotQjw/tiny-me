/* Layout */
import Layout from '@/layout'
import LayoutTop from '@/layout-top'

const role1Route =  [
  {
    path: '/guide',
    component: () => import('@/views/fuceng/index'),
    hidden: false
  },
  {
    path:'/account',
    redirect:'/account-manage',
    component:Layout,
    children:[
      {
        path: '/account-manage',
        name: '账号管理',
        component: () => import('@/views/accountManage/index'),
        meta: { title: '账号管理', icon: 'table' }
      },
    ]     
  },
  {
    path:'/',
    redirect:'/data-list',
    component:LayoutTop,
    children:[
      {
        path: '/data-list',
        name: '案件列表',
        component: () => import('@/views/dataList/index'),
        meta: { title: '案件列表', icon: 'dataList' }
      },
      {
        path: '/case-list',
        name: '案件列表',
        component: () => import('@/views/editorTable/index'),
        meta: { title: '案件列表', icon: 'dataList' }
      },
      {
        path: '/data-edit',
        name: '编辑页面',
        component: () => import('@/views/edit/index'),
        meta: { title: '编辑页面', icon: 'edit' }
      },
      {
        path: '/rich-text-edit',
        name: '说明书编辑',
        component: () => import('@/views/richTextEdit/index'),
        meta: { title: '说明书编辑', icon: 'edit' }
      },
      {
        path: '/data-review',
        name: '审核',
        component: () => import('@/views/review/index'),
        meta: { title: '审核', icon: 'edit' }
      },
      ]
    }
]
export default role1Route
