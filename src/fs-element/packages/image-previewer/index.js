import ElImagePreviewer from './src/image-previewer';

/* istanbul ignore next */
ElImagePreviewer.install = function(Vue) {
  Vue.component(ElImagePreviewer.name, ElImagePreviewer);
};

export default ElImagePreviewer;
