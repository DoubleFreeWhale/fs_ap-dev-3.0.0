import ElWidget from './src/widget';

/* istanbul ignore next */
ElWidget.install = function(Vue) {
  Vue.component(ElWidget.name, ElWidget);
};

export default ElWidget;
