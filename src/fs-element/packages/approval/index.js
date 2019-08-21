import Approval from './src/approval';

/* istanbul ignore next */
Approval.install = function(Vue) {
  Vue.component(Approval.name, Approval);
};

export default Approval;
