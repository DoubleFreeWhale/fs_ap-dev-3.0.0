  import compUtil from "./compUtil";
  /**
   * 获取组件模板中的拖放位置
   * @param {*} el 
   * @param {*} valueObj 
   */
  function _getDropEl(el, valueObj) {
    if (valueObj && valueObj.class) {
      return $(el).find('.' + valueObj.class)[0];
    }
    return el;
  }

  /**
   * 是否存在拖放位置标记
   */
  function _hasDropMark() {
    if (window.$dropPosDom || window.dropTargetDom)
      return true;
    else
      return false;
  }

  /**
   * 清除拖放位置标记
   */
  function _cleanDropMark() {
    if (window.$dropPosDom) {
      window.$dropPosDom.remove();
    }
    if (window.dropTargetDom) {
      $(window.dropTargetDom).removeClass('drag-over');
      window.dropTargetDom = null;
    }
    window.dropType = null;
    window.dropId = null;
  }

  /**
   * 生成拖放位置占位
   */
  function genPosDom() {
    var $dom = $('<div class="dorp_pos_h">&nbsp;</div>');
    $dom.on('dragover', function(){
      return false;
    })
    return $dom;
  }

  /**
   * 查询要放置的组件位置
   */
  function findDropTarget(component, targetEle, preComponent) {
    if (!component) {
      // 顶层元素，保证除了顶层元素都是可以获取component的
      if (window.$dropPosDom) {
        window.$dropPosDom.remove();
      }
      window.$dropPosDom = genPosDom();//$('<div class="dorp_pos_h">&nbsp;</div>');
      $(targetEle).append(window.$dropPosDom);
      window.dropId = 'root';
      return;
    }
    var $children = $(targetEle).children();
    if ($children.length > 1 || ($children.length == 1 && !$($children[0]).hasClass('dorp_pos_h'))) { // 容器不为空
      if ($(targetEle).attr('muilt') == 'true') { //可放置多个组件
        var dropId;
        if (_hasDropMark())
          _cleanDropMark();
        if (preComponent) { //鼠标所在元素并不是可放置组件的元素
          dropId = $(preComponent.$el).attr('_id');
          if ($(preComponent.$el).closest('.hidden-columns').length > 0) {
            var $table = $(preComponent.$el).closest('.el-table');
            var thel = $table.find('table').find('[_id=' + dropId + ']');
            $('.drag-over').removeClass('drag-over');
            $(thel).addClass('drag-over');
          } else {
            $(preComponent.$el).addClass('drag-over');
          }
         
          window.dropType = 'insertBefore';
          window.dropTargetDom = preComponent.$el;
          console.log('dropType:' + window.dropType);
        } else { //鼠标所在元素是可放置组件的元素
          dropId = $(component.$el).attr('_id');
          $(component.$el).addClass('drag-over');
          window.dropTargetDom = component.$el;
        }
        window.dropId = dropId;
        // console.log('dropId:' + dropId);
      } else { //不能再放置组件了
        var parentComponent = window.engine.getParentComp(component);
        var parentTargetEle = parentComponent.$el;
        findDropTarget(parentComponent, parentTargetEle, component);
      }
    } else { //容器为空，可放置内容
      var dropId = $(component.$el).attr('_id');
      console.log('dropId_else' + dropId);
      if (!window.$dropPosDom || window.dropId != dropId) {
        if (_hasDropMark())
          _cleanDropMark();
        window.$dropPosDom = genPosDom();
        window.dropId = dropId;
        window.$dropPosDom.css('height', $(targetEle).height());
        $(targetEle).append(window.$dropPosDom);
      }
    }
  }

  function addDropEvent(el, binding, vnode) {
    if (binding && binding.value && binding.value.class) {
      el = _getDropEl(el, binding.value);
    }
    if (binding && binding.value && binding.value.muilt == true) { //该容器支持放置多组件 比如： el-row
      $(el).attr('muilt', true);
    }
    if (el._hasBindDragOverEvent == true) {
      $(el).off('dragover');
    }
    $(el).on('dragover', function (e) {
      var targetEle = this;
      if (e.preventDefault) {
        e.preventDefault();
      }
      e.stopPropagation();
      var component = window.engine.getComp(targetEle);
      findDropTarget(component, targetEle);
      return false;
    });
    /**
     * 鼠标拖离事件
     */
    el.addEventListener('dragleave', function (e) {
      if ($(e.fromElement).hasClass('dorp_pos_h'))
        return;
      _cleanDropMark();
    }, false);
    /**
     * drop事件
     */
    el.addEventListener('drop', function (e) {
      var targetEle = this;
      e.preventDefault();
      if (e.stopPropagation) {
        e.stopPropagation();
      }
      if (parent._dragSrcEl != targetEle) {
        handleEleDrop(parent._dragSrcEl, targetEle);
      }
      parent._dragSrcEl = null;
      parent._actived_ele = null;
      targetEle.$posDom = null;
      e.target.classList.remove('drag-over');
      // return false;
    }, false);
  }

  /**
   * 元素拖拽Drop事件
   */
  function handleEleDrop(srcElement, targetElement) {
    var key, content, targetEle
    key = $(srcElement).attr('key') || '';
    if (key != '') { //布局、组件 
      compUtil.onBeforeDrop(key, function(attrArr){
        var $dom = window.engine.createComp(key);
        if (attrArr && attrArr.length > 0){
          for (var i = 0 ; i< attrArr.length; i++){
            $dom.attr(attrArr[i].name, attrArr[i].value);
          }
        }
        window.engine.refreshDom();
        window.engine.activeNode($dom);
      })
    } else if ($(srcElement).attr('id') == 'elToolsPanel') { //已存在元素
      var actived_ele = parent._actived_ele;
      window.engine.moveElement(actived_ele);
      window.engine.$refs.elToolsPanel.calcPostion();
    } else if ($(srcElement).hasClass('el-tree-node__content')) { //业务树节点
      parent.shell.treeNodeDropCallBack(srcElement, targetElement);
    }
    window.targetContiner = null;
  }

  function dragDirective(el, binding, vnode) {
    $(el).attr('can-drag', true);
  }

  function dropDirective(el, binding, vnode) {
    addDropEvent(el, binding, vnode);
  }

  function dndDirective(el, binding, vnode) {
    $(el).attr('can-drag', true);
    addDropEvent(el, binding, vnode);
  }

  function selectDirective(el, binding, vnode) {
    el.addEventListener('mouseenter', function (e) {
      $(el).addClass('targetEle');
    }, false);
    el.addEventListener('mouseout', function (e) {
      $(el).removeClass('targetEle');
    }, false);
    el.addEventListener('click', function (e) {
      e.preventDefault();
      if (e.stopPropagation) {
        e.stopPropagation();
      }
      window.engine.activeNode(el);
    }, false);
  }

  function compDirective(el, binding, vnode) {
    var component = vnode.componentInstance  || {$options:{_componentTag:el.tagName.toLowerCase()},$el:el};
    var key = component.$options._componentTag;
    var property = compUtil.getCompProperty(key);
    if (property) {
      component.$options.meta = {
        propertyUI: property,
        name: compUtil.getCompDef(key).name
      }
    }
    el['comp'] = component;
    if (el._hasBindDragOverEvent != true) {
      $(el).on('dragover', function (e) {
        var targetEle = this;
        if (e.preventDefault) {
          e.preventDefault();
        }
        e.stopPropagation();
        var component = window.engine.getComp(targetEle);
        findDropTarget(component, targetEle);
        return false;
      });
    }
  }

  export default {
    dragDirective: dragDirective,
    dropDirective: dropDirective,
    dndDirective: dndDirective,
    selectDirective: selectDirective,
    compDirective: compDirective,
    addDirectives: function (vue) {
      /**
       * 只能拖拽,不能放置目标
       */
      vue.directive('drag', {
        bind: function (el, binding, vnode) {
          dragDirective(el, binding, vnode)
        }
      })
      /**
       * 不能拖拽，只能放置目标
       */
      vue.directive('drop', {
        bind: function (el, binding, vnode) {
          dropDirective(el, binding, vnode);
        }
      })
      /**
       * drag and drop
       */
      vue.directive('dnd', {
        bind: function (el, binding, vnode) {
          dndDirective(el, binding, vnode);
        }
      })

      /**
       * 元素样式控制
       */
      vue.directive('select', {
        bind: function (el, binding, vnode) {
          selectDirective(el, binding, vnode)
        }
      })

      vue.directive('comp', {
        bind: function (el, binding, vnode) {
          compDirective(el, binding, vnode)
        }
      })
    }
  }
