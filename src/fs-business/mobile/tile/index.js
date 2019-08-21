import MobileTile from './src/tile';

MobileTile.install = function(Vue) {
  Vue.component(MobileTile.name, MobileTile);
};

export default MobileTile;
