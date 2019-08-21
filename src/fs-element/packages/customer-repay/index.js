import ElCustomerRepay from './src/customer-repay';

/* istanbul ignore next */
ElCustomerRepay.install = function(Vue) {
  Vue.component(ElCustomerRepay.name, ElCustomerRepay);
};

export default ElCustomerRepay;
