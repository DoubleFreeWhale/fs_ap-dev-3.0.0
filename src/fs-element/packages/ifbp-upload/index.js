import IfbpUpload from './src/ifbp-upload';

/* istanbul ignore next */
IfbpUpload.install = function(Vue) {
  Vue.component(IfbpUpload.name, IfbpUpload);
};

export default IfbpUpload;
