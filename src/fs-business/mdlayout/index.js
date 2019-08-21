import MdLayout from './src/mdlayout';

/* istanbul ignore next */
MdLayout.install = function(Vue) {
  Vue.component(MdLayout.name, MdLayout);
};

export default MdLayout;
