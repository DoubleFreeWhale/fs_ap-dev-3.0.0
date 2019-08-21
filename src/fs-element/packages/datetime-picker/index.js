// export { default } from './src/datetime-picker.vue';
import MtDatetimePicker from './src/datetime-picker';

/* istanbul ignore next */
MtDatetimePicker.install = function(Vue) {
  Vue.component(MtDatetimePicker.name, MtDatetimePicker);
};

export default MtDatetimePicker;
