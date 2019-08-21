

/**
 * WidgetEditTool组件
 * */



const install = function (Vue, opts = {}) {
  Vue.component('WidgetEditTool', {
    template: '<ul class="list-unstyled edit">' +
        '<li><i class="portalfont btn btn-round btn-default btn-outline btn-pill-right icon-max" data-type="window" title="最大最小化"></i></li>' +
        '<li><i class="portalfont btn btn-default btn-outline icon-unfold" data-type="collage" title="折叠"></i></li>' +
        '<li><i class="portalfont btn btn-round btn-default btn-outline btn-pill-left icon-pencil" data-type="edit" data-toggle="modal" data-target="#modalBlue" title="编辑"></i></li>' +
        '<li><i class="portalfont btn btn-default btn-outline icon-cancel02" data-type="del" title="删除"></i></li>' +
        '</ul>',
  });
  /**
   * shortcut
   * */
  Vue.component('Shortcut', {
    data: function() {
      return {
        innerArr: [],
        tmp: ''
      }
    },
    created(){
      this.innerArr = this.shortcutarr;
    },
    template: '<ul class="shortcut"><li v-for="item in innerArr" @click="jump(item.links)">' +
        // '<img :src="item.imgSrc" alt="">' +
        '<i class="appIcon cyan iconfont_form" :class="item.iconClass"></i>' +
        '<div class="rightbox">' +
        '<span> {{item.name}} </span>' +
        '<span v-if="item.renderType == \'js\'" class="render"></span>' +
        '<span v-else-if="item.renderType == \'word\'" class="render">{{ item.render }}</span>' +
        '<p v-else-if="item.renderType == \'link\'"><span v-for="val in item.renderLinks"><a class="render-links" :herf="val.link" style="margin-right: 5px;">{{ val.text }}</a></span></p>' +
        '</div>' +
        '</li></ul>',
    props: ['shortcutarr'],
    mounted: function() {
      var short_cut_arr = this.shortcutarr;
      if (short_cut_arr.renderType == "js") {
        tmp = '<span class="render"></span>'
        this.getRenderUrl(this.shortcutarr);
      }
    },
    methods: {
      jump: function(url) {
        window.location.href = '/ap/index.html#' + url;
        console.log(url);
      },
      getRenderUrl: function(arr) {
        // var arr = JSON.parse(arr);
        arr.forEach(function(v) {
          if (!v.render) return;
          var url = v.render;
          require([url], function(a) {
            a.init();
          })
        });
      }
    }
  });
  /**
   * Widget组件
   * */
  Vue.component('Widget', {
    data: function() {
      var isUrl = false;
      var widgetMeta = this.getWidgetMeta();
      console.log(widgetMeta);
      // var view = this.view ;
      // if(!view)
      var view = "default";
      var url = this.gadgeturl || this.gadgetURL;
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
        $.each(widgetMeta.views, function(v, n) {
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
        dataUl: this.gadgetURL,
        className: this.layoutcontext.options.isSortable ? 'well sort' : 'unsortable'
      };
      var subAttrs = {
        id: 'gadget-site-content-' + this.id,
        className: this.isUrl ? 'innerHtml-ipad collapse in' : 'innerHtml collapse in'
      };
      return {
        html: widgetMeta.contents[view],
        attrs: attrs,
        subAttrs: subAttrs,
        isUrl: isUrl,
        ul: ''
      }
    },
    template: '<div class="top-layout" style="position: relative;">' +
        '<div style="height: 100%;width: 100%;background-color: transparent;position:absolute;z-index: 2;"></div>' +
        '<div :id="this.attrs.id" :data-id="this.attrs.dataId" :data-ul="this.attrs.dataUl" :class="this.attrs.className">' +
        '<h5 v-if="this.layoutcontext.options.isShowWidgetName"></h5>' +
        // '<div v-else-if="this.id ===' + "'shortcut'" + '" id="shortcut_m">' +
        // '<shortcut :shortcutarr="this.shortcutarr"></shortcut>' +
        // '</div>' +
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
        required: true
      },
      layoutcontext: {
        type: Object,
        required: true
      },
      layoutContext: {
        type: Object,
        required: false
      },
      shortcutarr: {
        type: Array,
        required: false
      }
    },
    mounted: function() {
      if (!this.html) {
        //url process
        var widgetMeta = this.getWidgetMeta();
        var view = 'default';
        $.each(widgetMeta.views, function(v, n) {
          view = v; //default url has one
          return false;
        });
        if (view != 'default') {
          var gadgetURL = widgetMeta.iframeUrls[view];
          var _container = this.layoutcontext.container || this.layoutContext.container;
          _container.renderGadget(gadgetURL, this.id, 'url')
        } else {
          //other
          var _container = this.layoutcontext.container || this.layoutContext.container;
          _container.renderGadget(this.gadgetURL, this.id)
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
      getWidgetMeta: function() {
        var url = this.gadgeturl || this.gadgetURL;
        var layoutContext = this.layoutcontext || this.layoutContext;
        if (typeof layoutContext === 'string') {
          layoutContext = JSON.parse(layoutContext);
        }
        var layoutMeta = layoutContext.layoutMeta;
        var widgetMeta = layoutMeta[url];
        return widgetMeta;
      },
      setPubSub: function() {
        if (this.html) {
          //自定义事件
          var MY_TOPIC = 'widget.' + this.id;
          // var dom = ReactDOM.findDOMNode(this);
          var dom = this.$el;
          //PubSub.publish(MY_TOPIC, dom);
          var _this = this;
          //require(['pubsub'],function(){
          //	var url = _this.props.gadgetURL;
          //	var dataUrl = _this.props.layoutContext.layoutMeta[url].modulePrefs.thumbnail
          //	PubSub.publish(MY_TOPIC, dataUrl);
          //})
        }
      },
      setWidgetEditTool: function() {
        return this.layoutcontext.options.isWidgetEdit || this.layoutContext.options.isWidgetEdit ? Vue.component('WidgetEditTool', null) : '';
      },
      getParamUrl: function(name, url) {
        url = url.split('?')[1];
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var str = url.match(reg);
        if (str != null) return str[2];
        return null;
      },
      domManip: function(fragment) {
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
      getAll: function(context, tag) {
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

  /**
   * WidgetBox组件
   *
   * */

  Vue.component('WidgetBox', {
    data: function() {
      return {
        gridData: []
      }
    },
    template: '<div :id="id" :key="id" class="widgetBox connectedSortable"><slot></slot></div>',
    props: ['layoutcontext', 'id'],
    mounted: function() {
      var widgetBox = this.$el;
      this.setWidgetDrag(widgetBox);
    },
    methods: {
      setWidgetDrag: function(elems) {
        if (this.layoutcontext.options.isSortable || this.layoutContext.options.isSortable) {
          $(elems).sortable({
            "connectWith": ".widgetBox",
            "forcePlaceholderSize": true,
            "placeholder": "ui-portlet-placeholder",
            stop: function(i) {},
            over: function() {

            }
          })
        }
      }
    }
  });

  /**
   * Page 组件
   *
   * */

  Vue.component('Page', {
    props: {
      layoutcontext: {
        type: Object
      },
      shortcutarr: {
        type: Array,
        required: false
      }
    },
    template: '<div class="page" style="width:100%"><slot></slot></div>',
  });
};

export default {
  install
}