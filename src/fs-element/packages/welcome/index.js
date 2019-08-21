import ElWelcome from './src/welcome';

/* istanbul ignore next */
ElWelcome.install = function(Vue) {
  Vue.component(ElWelcome.name, ElWelcome);
};

export default ElWelcome;
