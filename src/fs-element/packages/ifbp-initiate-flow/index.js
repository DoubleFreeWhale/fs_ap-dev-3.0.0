import IfbpInitiateFlow from './src/initiateFlow';

/* istanbul ignore next */
IfbpInitiateFlow.install = function(Vue) {
  Vue.component(IfbpInitiateFlow.name, IfbpInitiateFlow);
};

export default IfbpInitiateFlow;