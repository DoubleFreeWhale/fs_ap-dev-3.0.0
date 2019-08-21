import ElMainNav from './src/main-nav';

/* istanbul ignore next */
ElMainNav.install = function(Vue) {
  Vue.component(ElMainNav.name, ElMainNav);
};

export default ElMainNav;
