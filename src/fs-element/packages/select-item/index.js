import ElSelectItem from './src/select-item';

/* istanbul ignore next */
ElSelectItem.install = function(Vue) {
  Vue.component(ElSelectItem.name, ElSelectItem);
};

export default ElSelectItem;
