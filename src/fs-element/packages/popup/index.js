// export { default } from './src/popup.vue';
import MtPopup from './src/popup';

/* istanbul ignore next */
MtPopup.install = function(Vue) {
  Vue.component(MtPopup.name, MtPopup);
};

export default MtPopup;
