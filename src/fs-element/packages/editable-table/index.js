import ElEditableTable from './src/editable-table';

/* istanbul ignore next */
ElEditableTable.install = function(Vue) {
  Vue.component(ElEditableTable.name, ElEditableTable);
};

export default ElEditableTable;
