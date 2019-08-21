import ifbpFileUpload from './src/ifbp-file-upload.vue';

/* istanbul ignore next */
ifbpFileUpload.install = function(Vue) {
  Vue.component(ifbpFileUpload.name, ifbpFileUpload);
};

export default ifbpFileUpload;
