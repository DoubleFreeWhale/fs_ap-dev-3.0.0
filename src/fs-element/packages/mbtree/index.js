import mbTree from './src/mb-tree.vue';
// import MbTreeNode from '.src/mb-tree-node.vue';

/* istanbul ignore next */
mbTree.install = function(Vue) {
  Vue.component(mbTree.name, mbTree);
};
// MbTreeNode.install = function(Vue) {
//   Vue.component(MbTreeNode.name, MbTreeNode);
// };
export default mbTree;
