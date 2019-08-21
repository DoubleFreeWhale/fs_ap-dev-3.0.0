export default {
    //fs-business下的懒加载组件

    GridItem: () => import(/* webpackChunkName: "GridItem" */ './gridLayout/components/GridItem.vue'),
    GridLayout: () => import(/* webpackChunkName: "GridLayout" */ './gridLayout/components/GridLayout.vue'),
    pageModelMixin: () => import(/* webpackChunkName: "pageModelMixin" */ './pageModelMixin'),
    fsCorpCascader: () => import(/* webpackChunkName: "pageModelMixin" */ './fsCorpCascader'),
    ifbpBtnLine: () => import(/* webpackChunkName: "pageModelMixin" */ './ifbpBtnLine'),

}