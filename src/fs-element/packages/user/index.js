import ElUser from './src/user';

/* istanbul ignore next */
ElUser.install = function(Vue) {
  Vue.component(ElUser.name, ElUser);
};
export default ElUser;
