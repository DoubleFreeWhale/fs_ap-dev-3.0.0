import ifbpRole from './src/ifbp-role';

/* istanbul ignore next */
ifbpRole.install = function(Vue) {
  Vue.component(ifbpRole.name, ifbpRole);
};

export default ifbpRole;