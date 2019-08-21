import ElTab from './src/tab';

/* istanbul ignore next */
ElTab.install = function(Vue) {
  Vue.component(ElTab.name, ElTab);
};

export default ElTab;
