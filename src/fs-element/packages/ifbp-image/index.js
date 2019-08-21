import IfbpImage from './src/ifbp-image';

/* istanbul ignore next */
IfbpImage.install = function(Vue) {
  Vue.component(IfbpImage.name, IfbpImage);
};

export default IfbpImage;
