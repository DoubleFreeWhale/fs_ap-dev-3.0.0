// export { default } from './src/picker.vue';
import MtPicker from './src/picker';

/* istanbul ignore next */
MtPicker .install = function(Vue) {
  Vue.component(MtPicker .name, MtPicker);
};

export default MtPicker;
