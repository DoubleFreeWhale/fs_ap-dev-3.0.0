/*
 * WidgetBox组件
 *
 * */
function install(Vue) {

  Vue.component('WidgetBox', {
    data: function () {
      return {
        gridData: []
      }
    },
    template: '<div :id="id" :key="id" class="widgetBox connectedSortable"><slot></slot></div>',
    // render: function (createElement) {
    //     var widgetBoxId = this.id;
    //     return createElement(
    //         'div',
    //         { attrs: {id: this.id, key: this.id},'class': 'widgetBox connectedSortable'},
    //         [
    //             '',
    //             Array.apply(null, this.children).map(function (result) {
    //                 if (result.type.displayName && result.type.displayName === "Widget") {
    //                     return createElement(Widget, {id: result.id, key: result.id,
    //                         className: result.className+' ui-sortable-handle',
    //                         layoutContext: result.layoutContext,
    //                         gadgetURL: result.gadgetURL,
    //                         widgetBoxId: widgetBoxId})
    //                 }
    //             })
    //         ]
    //     )
    // },
    props: ['layoutcontext', 'id'],
    mounted: function () {
      // var widgetBox = ReactDOM.findDOMNode(this);
      var widgetBox = this.$el;
      this.setWidgetDrag(widgetBox);
    },
    methods: {
      setWidgetDrag: function (elems) {
        if (this.layoutcontext.options.isSortable) {
          $(elems).sortable({
            "connectWith": ".widgetBox",
            "forcePlaceholderSize": true,
            "placeholder": "ui-portlet-placeholder",
            stop: function (i) {
              //console.log(i);
            },
            over: function () {

            }
          })
        }
      }
    }
  });
}

export default {
  install: install
}
