import ElPhone from './src/phone';

/* istanbul ignore next */
ElPhone.install = function(Vue) {
  Vue.component(ElPhone.name, ElPhone);
};

export default ElPhone;
