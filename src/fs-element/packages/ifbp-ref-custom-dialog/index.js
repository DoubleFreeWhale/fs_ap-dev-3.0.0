import ElRefCustomDialog from './src/customRefDialog';

/* istanbul ignore next */
ElRefCustomDialog.install = function(Vue) {
  Vue.component(ElRefCustomDialog.name, ElRefCustomDialog);
};

export default ElRefCustomDialog;
