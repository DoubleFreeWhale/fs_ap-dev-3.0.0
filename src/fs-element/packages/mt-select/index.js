// export { default } from './src/datetime-picker.vue';
import MtSelect from './src/select-pop';

/* istanbul ignore next */
MtSelect.install = function(Vue) {
  Vue.component(MtSelect.name, MtSelect);
};

export default MtSelect;
