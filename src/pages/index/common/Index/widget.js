/*
 * Widget组件
 * */
function install(Vue) {

  Vue.component('Widget', {
    data: function () {
      var isUrl = false;
      var widgetMeta = this.getWidgetMeta();
      // var view = this.view ;
      // if(!view)
      var view = "default";
      var url = this.gadgeturl;
      var html = 'loading...';
      if (widgetMeta.error) {
        html = widgetMeta.error.message;
      } else {

        html = widgetMeta.contents[view];
      }
      if (!this.html) {
        //url process
        var widgetMeta = this.getWidgetMeta();
        var view = 'default';
        $.each(widgetMeta.views, function (v, n) {
          view = v; //default url has one
          return false;
        });
        if (view != 'default') {
          isUrl = true;
        }
      }
      var attrs = {
        id: 'gadget-site-' + this.id,
        dataId: this.id,
        dataUl: this.gadgeturl,
        className: this.layoutcontext.options.isSortable ? 'well sort' : 'unsortable'
      };
      var subAttrs = {
        id: 'gadget-site-content-' + this.id,
        className: this.isUrl ? 'innerHtml-ipad collapse in' : 'innerHtml collapse in'
      };
      return {
        html: html,
        attrs: attrs,
        subAttrs: subAttrs,
        isUrl: isUrl,
        ul: ''
      }
    },
    template: '<div class="top-layout">' +
      '<div :id="this.attrs.id" :data-id="this.attrs.dataId" :data-ul="this.attrs.dataUl" :class="this.attrs.className">' +
      '<h5 v-if="this.layoutcontext.options.isShowWidgetName"></h5>' +
      //   '<div v-else-if="this.id ===' + "'shortcut'" + '" id="shortcut_m">' +
      //   '<shortcut :shortcutarr="this.shortcutarr"></shortcut>' +
      //   '</div>' +
      '<div v-else :id="this.subAttrs.id" :class="this.subAttrs.className" v-html="this.html">' +
      '</div>' +
      '</div>' +
      '</div>',
    props: {
      id: {
        type: String,
        required: true
      },
      gadgetURL: {
        type: String,
        required: false
      },
      gadgeturl: {
        type: String,
        required: false
      },
      layoutcontext: {
        type: Object,
        required: false
      },
      shortcutarr: {
        type: Array
      }
    },
    mounted: function () {
      this.gadgeturl = this.gadgeturl || this.gadgetURL;
      if (!this.html) {
        //url process
        var widgetMeta = this.getWidgetMeta();
        var view = 'default';
        $.each(widgetMeta.views, function (v, n) {
          view = v; //default url has one
          return false;
        });
        if (view != 'default') {
          var gadgetURL = widgetMeta.iframeUrls[view];
          var _container = this.layoutcontext.container;
          _container.renderGadget(gadgetURL, this.id, 'url')
        } else {
          //other
          var _container = this.layoutcontext.container;
          _container.renderGadget(this.gadgeturl, this.id)
        }
      }
      if (this.html) {
        var doms = $.parseHTML(this.html, true);
        if (doms)
          this.domManip(doms);
      }
      this.setPubSub();
    },
    methods: {
      getWidgetMeta: function () {

        var url = this.gadgeturl || this.gadgetURL;
        var layoutcontext = this.layoutcontext;
        var layoutMeta = layoutcontext.layoutMeta;
        var widgetMeta = layoutMeta[url];
        return widgetMeta;
      },
      setPubSub: function () {
        if (this.html) {
          //自定义事件
          var MY_TOPIC = 'widget.' + this.id;
          // var dom = ReactDOM.findDOMNode(this);
          var dom = this.$el;
          //PubSub.publish(MY_TOPIC, dom);
          var _this = this;
          //require(['pubsub'],function(){
          //	var url = _this.props.gadgetURL;
          //	var dataUrl = _this.props.layoutcontext.layoutMeta[url].modulePrefs.thumbnail
          //	PubSub.publish(MY_TOPIC, dataUrl);
          //})
        }
      },
      setWidgetEditTool: function () {
        return this.layoutcontext.options.isWidgetEdit ? Vue.component('WidgetEditTool', null) : '';
      },
      getParamUrl: function (name, url) {
        url = url.split('?')[1];
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var str = url.match(reg);
        if (str != null) return str[2];
        return null;
      },
      domManip: function (fragment) {
        var node, hasScripts,
          scripts, i = 0;

        scripts = this.getAll(fragment, "script");
        hasScripts = scripts.length;
        if (hasScripts) {

          // Evaluate executable scripts on first document insertion
          var rscriptType = /^$|\/(?:java|ecma)script/i;
          var rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;
          for (i = 0; i < hasScripts; i++) {
            node = scripts[i];
            if (rscriptType.test(node.type || "") && !jQuery._data(node, "globalEval")) {
              if (node.src) {
                // Optional AJAX dependency, but won't run scripts if not present
                if (jQuery._evalUrl) {
                  var nodeSrc = node.src;
                  //adjust script src
                  if (window.baseUrl && nodeSrc.indexOf(window.baseUrl) == -1) {
                    var proUrl = nodeSrc.split("//");
                    var index = proUrl[1].indexOf("/");
                    nodeSrc = proUrl[0] + "//" + proUrl[1].substring(0, index) + window.baseUrl + proUrl[1].substring(index, proUrl[1].length);
                  }
                  jQuery._evalUrl(nodeSrc);
                }
              } else {
                jQuery.globalEval((node.text || node.textContent || node.innerHTML || "").replace(rcleanScript, ""));
              }
            }
          }
        }
      },
      getAll: function (context, tag) {
        var strundefined = typeof undefined;
        var elems, elem,
          i = 0,
          found = typeof context.getElementsByTagName !== strundefined ? context.getElementsByTagName(tag || "*") :
          typeof context.querySelectorAll !== strundefined ? context.querySelectorAll(tag || "*") :
          undefined;

        if (!found) {
          for (found = [], elems = context.childNodes || context;
            (elem = elems[i]) != null; i++) {
            if (!tag || jQuery.nodeName(elem, tag)) {
              found.push(elem);
            } else {
              jQuery.merge(found, this.getAll(elem, tag));
            }
          }
        }

        return tag === undefined || tag && jQuery.nodeName(context, tag) ?
          jQuery.merge([context], found) :
          found;
      }
    }
  });
}

export default {
  install: install
}
