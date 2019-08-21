import ElTile from './src/tile';

/* istanbul ignore next */
ElTile.install = function(Vue) {
  Vue.component(ElTile.name, ElTile);
};

export default ElTile;
