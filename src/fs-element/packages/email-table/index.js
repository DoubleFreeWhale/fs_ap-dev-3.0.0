import ElEmailTable from './src/email-table';

/* istanbul ignore next */
ElEmailTable.install = function(Vue) {
  Vue.component(ElEmailTable.name, ElEmailTable);
};

export default ElEmailTable;
