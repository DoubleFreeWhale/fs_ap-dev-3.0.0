import ElMoney from './src/money';

/* istanbul ignore next */
ElMoney.install = function(Vue) {
  Vue.component(ElMoney.name, ElMoney);
};

export default ElMoney;
