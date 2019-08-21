import ElSearchSelect from './src/search-select';

/* istanbul ignore next */
ElSearchSelect.install = function(Vue) {
  Vue.component(ElSearchSelect.name, ElSearchSelect);
};

export default ElSearchSelect;
