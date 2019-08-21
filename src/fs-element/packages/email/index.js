import ElEmail from './src/email';

/* istanbul ignore next */
ElEmail.install = function(Vue) {
  Vue.component(ElEmail.name, ElEmail);
};

export default ElEmail;
