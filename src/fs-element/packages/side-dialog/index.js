import ElSideDialog from './src/side-dialog';

/* istanbul ignore next */
ElSideDialog.install = function(Vue) {
  Vue.component(ElSideDialog.name, ElSideDialog);
};

export default ElSideDialog;
