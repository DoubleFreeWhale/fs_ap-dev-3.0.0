import Popper from 'ifbp-element/src/utils/vue-popper';
import debounce from 'throttle-debounce/debounce';
import { getFirstComponentChild } from 'ifbp-element/src/utils/vdom';
import { IsPC } from 'ifbp-element/src/utils/util';
import Vue from 'vue';

export default {
  name: 'ElTooltip',

  mixins: [Popper],

  props: {
    openDelay: {
      type: Number,
      default: 0
    },
    disabled: Boolean,
    manual: Boolean,
    effect: {
      type: String,
      default: 'dark'
    },
    popperClass: String,
    content: {},
    visibleArrow: {
      default: true
    },
    transition: {
      type: String,
      default: 'el-fade-in-linear'
    },
    popperOptions: {
      default() {
        return {
          boundariesPadding: 10,
          gpuAcceleration: false
        };
      }
    },
    enterable: {
      type: Boolean,
      default: true
    }
  },
  data(){
    return {
      IsPC: IsPC()
    }
  },
  beforeCreate() {
    if (this.$isServer) return;

    this.popperVM = new Vue({
      data: { node: '' },
      render(h) {
        return this.node;
      }
    }).$mount();

    this.debounceClose = debounce(200, () => this.handleClosePopper());
  },

  render(h) {
    if (this.popperVM && this.effect !== 'normal') {
      this.popperVM.node = (
        <transition
          name={ this.transition }
          onAfterLeave={ this.doDestroy }>
          <div
            onMouseleave={ () => { this.setExpectedState(false); this.debounceClose(); } }
            onMouseenter= { () => { this.setExpectedState(true); } }
            ref="popper"
            v-show={!this.disabled && this.showPopper}
            class={
              ['el-tooltip__popper', 'is-' + this.effect, this.popperClass,this.IsPC?'':'mobile-el-tooltip__popper']
            }>
            { this.$slots.content || this.content }
          </div>
        </transition>);
    }
    if(this.popperVM && this.effect === 'normal'){
    	  this.popperVM.node = (
        <transition
          name={ this.transition }
          onAfterLeave={ this.doDestroy }>
          <div
            onMouseleave={ () => {  } }
            onMouseenter= { () => { } }
            ref="popper"
            class="tooltip-normal"
            v-show={!this.disabled && this.showPopper}
            >
            { this.$slots.content || this.content }
          </div>
        </transition>);
    }

    if (!this.$slots.default || !this.$slots.default.length) return this.$slots.default;

    const vnode = getFirstComponentChild(this.$slots.default);
    if (!vnode) return vnode;
    const data = vnode.data = vnode.data || {};
    const on = vnode.data.on = vnode.data.on || {};
    if(this.effect !== 'normal'){
    	  on.mouseenter = this.addEventHandle(on.mouseenter, (e) => {this._render(); var tar = e.target; if(tar){this.referenceElm = tar} this.setExpectedState(true); this.handleShowPopper(); });
		    on.mouseleave = this.addEventHandle(on.mouseleave, () => { this.setExpectedState(false); this.debounceClose(); });
		    data.staticClass = this.concatClass(data.staticClass, 'el-tooltip');
		    return vnode;
    }
    else{
    	  on.mouseenter = this.addEventHandle(on.mouseenter, (e) => {  	  	
    	  	this._render();
    	  	var tar = e.target;
    	  	var obj = this.$refs.popper;
    	  	this.setExpectedState(true); 
          this.handleShowPopper();
          setTimeout(()=>{
            this.titleMouseOver(obj,e);
          })
    	  });
		    on.mouseleave = this.addEventHandle(on.mouseleave, () => { 
          this.setExpectedState(false); 
          this.handleClosePopper(); });
		    return vnode;
    }
   
  },

  mounted() {
    this.referenceElm = this.$el;
  },
  beforeDestroy() {
    const vnode = getFirstComponentChild(this.$slots.default);
    if (vnode){
      delete vnode['data'];
    }
  },
  methods: {
    addEventHandle(old, fn) {
      return old ? Array.isArray(old) ? old.concat(fn) : [old, fn] : fn;
    },

    concatClass(a, b) {
      if (a && a.indexOf(b) > -1) return a;
      return a ? b ? (a + ' ' + b) : a : (b || '');
    },

    handleShowPopper() {
      if (!this.expectedState || this.manual) return;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.showPopper = true;
      }, this.openDelay);
    },

    handleClosePopper() {
      if (this.enterable && this.expectedState || this.manual) return;
      clearTimeout(this.timeout);
      this.$refs.popper.style.display = 'none';
      this.showPopper = false;
    },
    setExpectedState(expectedState) {
      this.expectedState = expectedState;
    },
    split_str(string,words_per_line) {
		    //空串，直接返回
		    if(typeof string == 'undefined' || string === null || string.length == 0) return '';
        string = string + '';
		    //单行字数未设定，非数值，则取默认值50
		    if(typeof words_per_line == 'undefined' || isNaN(words_per_line)){
		        words_per_line = 50;
		    }
		    //格式化成整形值
		    words_per_line = parseInt(words_per_line);
		    //取出i=0时的字，避免for循环里换行时多次判断i是否为0
		    var output_string = string.substring(0,1);
		    //循环分隔字符串
		    for(var i=1;i<string.length;i++) {
		        //如果当前字符是每行显示的字符数的倍数，输出换行
		        if(i%words_per_line == 0) {
		            output_string += "<br/>";
		        }
		        //每次拼入一个字符
		        output_string += string.substring(i,i+1);
		    }
		    return output_string;
		},
		titleMouseOver(obj,event,words_per_line) {
      if(this.$parent && this.$parent.$refs && this.$parent.$refs.content && this.$parent.$refs.content.offsetWidth < this.$parent.$refs.content.scrollWidth || !this.disabled){
        let slotConent = false;
        if(this.$slots.content && this.$slots.content.length > 0){
          slotConent = true;
        }
        var attr_style = document.createAttribute('style');                    //新建Element的style属性
        if(slotConent){
          // 使用slot的方式定义不同的样式
          attr_style.nodeValue = 'position:absolute;z-index:1999;' //绝对定位
		      + 'border: 0 solid #BDBDBD; background:#EFEFEF;;' //边框、背景颜色
		      + 'box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);' //圆角、阴影
		      + 'line-height:16px;' //行间距
		      + 'color:#333333;font-size:12px;'; //字体大小、内间距
        }else{
          attr_style.nodeValue = 'position:absolute;z-index:1999;' //绝对定位
		      + 'border: 0 solid #BDBDBD; background:#EFEFEF;;' //边框、背景颜色
		      + 'box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);' //圆角、阴影
		      + 'line-height:16px;' //行间距
		      + 'color:#333333;font-size:12px; padding: 2px 8px;'; //字体大小、内间距
        }
	       
		      try {
            obj.setAttributeNode(attr_style); //为Element设置style属性
            $(obj).addClass('tooltip-normal'); // 适配小贷环境没有设置此class
		      } catch (e) { 
		        //IE6
		        obj.style.position = 'absolute';
		        obj.style.border = '0 solid #BDBDBD';
		        obj.style.background = '#EFEFEF';
		        obj.style.lineHeight = '16px';
		        obj.style.fontSize = '12px';
		        obj.style.padding = '2px 8px';
		        obj.style.color = '#333333';
		        obj.style.boxShadow = ' 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04)';
		      }
		    //单行字数未设定，非数值，则取默认值50
		    if(typeof words_per_line == 'undefined' || isNaN(words_per_line)){
		        words_per_line = 50;
		    }
		    //格式化成整形值
		    words_per_line = parseInt(words_per_line);
        //在title_show中按每行限定字数显示标题内容，模拟TITLE悬停效果
        if(slotConent){
          obj.innerHTML = '';
          obj.appendChild(this.$slots.content[0].elm)
        }else{
          obj.innerHTML = this.split_str(this.content,words_per_line);
        }
        // 为了避免出现多个，先将其他的隐藏
        $('.tooltip-normal').hide();
		    //显示悬停效果DIV
		    obj.style.display = 'block';	    
		    //根据鼠标位置设定悬停效果DIV位置
		    event = event || window.event;                            //鼠标、键盘事件
		    var top_down = 15;                                        //下移15px避免遮盖当前标签
		    //最左值为当前鼠标位置 与 body宽度减去悬停效果DIV宽度的最小值，否则将右端导致遮盖
		    var left = Math.min(event.clientX,document.body.clientWidth-obj.clientWidth);
        obj.style.left = left+"px";            //设置title_show在页面中的X轴位置。
        obj.style.top = (event.pageY + top_down)+"px"; //

        // 需要考虑最下方的情况所以放开，如果有其他问题处理其他问题
        if(event.clientY + top_down + obj.clientHeight > document.body.clientHeight){
          obj.style.top = (event.clientY - top_down - obj.clientHeight)+"px";    //设置title_show在页面中的Y轴位置。
        }else{
          obj.style.top = (event.clientY + top_down)+"px";    //设置title_show在页面中的Y轴位置。
        }
      }
		}
  }
};
