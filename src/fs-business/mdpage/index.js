import MdPage from '../mdlayout/src/mdpage';

/* istanbul ignore next */
MdPage.install = function(Vue) {
  Vue.component(MdPage.name, MdPage);
};

export default MdPage;
