/* Layout */
import Layout from '@/layout'
import LayoutTop from '@/layout-top'

const role2Router = [
  {
    path: "/",
    redirect: "/case-list",
    component: LayoutTop,
    children: [
      {
        path: "/case-list",
        name: "案件列表",
        component: () => import("@/views/editorTable/index"),
        meta: { title: "案件列表", icon: "dataList" },
      },
      {
        path: "/rich-text-edit",
        name: "说明书编辑",
        component: () => import("@/views/richTextEdit/index"),
        meta: { title: "说明书编辑", icon: "edit" },
      },
    ],
  },
];
export default role2Router;
