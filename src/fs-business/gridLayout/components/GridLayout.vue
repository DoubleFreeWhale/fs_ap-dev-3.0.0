<template>
    <div ref="item" id="vueGridLayout" class="vue-grid-layout1" :style="mergedStyle">
        <div id="vueGridBgWrap" class="vue-grid-gb-wrap" v-show="currentBgSvg"></div>
        <slot></slot>
        <grid-item class="vue-grid-placeholder"
                   v-show="isDragging"
                   :x="placeholder.x"
                   :y="placeholder.y"
                   :w="placeholder.w"
                   :h="placeholder.h"
                   :i="placeholder.i">
        </grid-item>
    </div>
</template>
<style>
    .vue-grid-layout1 {
        position: relative;
    }
    .vue-grid-gb-wrap{
        transition: height 200ms ease;
        position: absolute;
        background-color:transparent;
    }
    .grid-layout-bg{
        background-color:#f0f0f5;
    }
</style>
<script>
    import Vue from 'vue';
    // var elementResizeDetectorMaker = require("element-resize-detector");
    import {} from "../helpers/element-resize-detector";
    import {bottom, compact, getLayoutItem, moveElement, validateLayout} from '../helpers/utils';
    //var eventBus = require('./eventBus');
    import GridItem from './GridItem.vue'
    import {addWindowEventListener, removeWindowEventListener} from "../helpers/DOM";

    export default {
        name: "GridLayout",
        provide() {
            return {
                eventBus: null
            }
        },
        components: {
            GridItem,
        },
        props: {
            // If true, the container height swells and contracts to fit contents
            autoSize: {
                type: Boolean,
                default: true
            },
            colNum: {
                type: Number,
                default: 12
            },
            rowHeight: {
                type: Number,
                default:48
            },
            maxRows: {
                type: Number,
                default: Infinity
            },
            margin: {
                type: Array,
                default: function () {
                    return [12, 12];
                }
            },
            isDraggable: {
                type: Boolean,
                default: true
            },
            isResizable: {
                type: Boolean,
                default: true
            },
            isMirrored: {
                type: Boolean,
                default: false
            },
            useCssTransforms: {
                type: Boolean,
                default: true
            },
            verticalCompact: {
                type: Boolean,
                default: true
            },
            layout: {
                type: Array,
                required: true,
            },
            isBgSvg:{
                type:Boolean,
                default:true,
                required:false,
            },
            isEditable:{
                type:Boolean,
                default:true,
                required:false
            }
        },
        data: function () {
            return {
                width: null,
                mergedStyle: {},
                lastLayoutLength: 0,
                isDragging: false,
                placeholder: {
                    x: 0,
                    y: 0,
                    w: 0,
                    h: 0,
                    i: -1
                },
                currentBgSvg:true,
                bgRows:20,
            };
        },
        created () {
            const self = this;

            // Accessible refernces of functions for removing in beforeDestroy
            self.resizeEventHandler = function(eventType, i, x, y, h, w) {
                self.resizeEvent(eventType, i, x, y, h, w);
            };

            self.dragEventHandler = function(eventType, i, x, y, h, w) {
                self.dragEvent(eventType, i, x, y, h, w);
            };

            self._provided.eventBus =  new Vue();
            self.eventBus = self._provided.eventBus;
            self.eventBus.$on('resizeEvent', self.resizeEventHandler);
            self.eventBus.$on('dragEvent', self.dragEventHandler);
        },
        beforeDestroy: function(){
            //Remove listeners
            this.eventBus.$off('resizeEvent', this.resizeEventHandler);
            this.eventBus.$off('dragEvent', this.dragEventHandler);
            removeWindowEventListener("resize", this.onWindowResize);
        },
        mounted: function() {
            this.handleBackGround(this.bgRows);
            // 初始化监听滚动条事件，防抖的处理100ms执行一次;
            var mainRight=document.getElementById("main-right");
            mainRight.onscroll=()=>{
                this.debounceFun(this.onWindowScroll(),100);
            }

            this.eventBus.$emit("setEditable",this.isEditable);
            this.currentBgSvg=this.isEditable;
            this.handleBgColor(this.isEditable); 

            this.$nextTick(function () {
                validateLayout(this.layout);
                const self = this;
                this.$nextTick(function() {
                    if (self.width === null) {
                        self.onWindowResize();
                        //self.width = self.$el.offsetWidth;
                        addWindowEventListener('resize', self.onWindowResize);
                    }
                    compact(self.layout, self.verticalCompact);

                    self.updateHeight();
                    self.$nextTick(function () {
                        const erd = elementResizeDetectorMaker({
                            strategy: "scroll" //<- For ultra performance.
                        });
                        erd.listenTo(self.$refs.item, function () {
                            self.onWindowResize();
                        });
                    });
                });

                addWindowEventListener("load", self.onWindowLoad.bind(this));
            });
        },
        watch: {
            width: function () {
                this.$nextTick(function () {
                    //this.$broadcast("updateWidth", this.width);
                    this.eventBus.$emit("updateWidth", this.width);
                    this.updateHeight();
                });
            },
            layout: function () {
                this.layoutUpdate();
            },
            colNum: function (val) {
                this.eventBus.$emit("setColNum", val);
            },
            rowHeight: function() {
                this.eventBus.$emit("setRowHeight", this.rowHeight);
            },
            isDraggable: function() {
                this.eventBus.$emit("setDraggable", this.isDraggable);
            },
            isResizable: function() {
                this.eventBus.$emit("setResizable", this.isResizable);
            },
            isEditable: function(val) {
                // this.eventBus.$emit("setDraggable", this.isEditable);
                // this.eventBus.$emit("setResizable", this.isEditable);
                this.eventBus.$emit("setEditable",this.isEditable);
                this.currentBgSvg=val
                this.handleBgColor(val);
            },
            isBgSvg:function(val){
                this.currentBgSvg=val;
            }


        },
        methods: {
            onWindowLoad: function(){
                const self = this;
                if (self.width === null) {
                    //self.width = self.$el.offsetWidth;
                    addWindowEventListener('resize', self.onWindowResize);
                }
                compact(self.layout, self.verticalCompact);

                self.updateHeight();
                self.$nextTick(function () {
                    const erd = elementResizeDetectorMaker({
                        strategy: "scroll" //<- For ultra performance.
                    });
                    erd.listenTo(self.$refs.item, function () {
                        self.onWindowResize();
                    });
                });
            },
            layoutUpdate() {
                if (this.layout !== undefined) {
                    if (this.layout.length !== this.lastLayoutLength) {
                        //console.log("### LAYOUT UPDATE!");
                        this.lastLayoutLength = this.layout.length;
                    }
                    compact(this.layout, this.verticalCompact);
                    this.eventBus.$emit("updateWidth", this.width);
                    this.updateHeight();
                }
            },
            updateHeight: function () {
                this.mergedStyle = {
                    height: this.containerHeight()
                };
            },
            onWindowResize: function () {
                this.handleBackGround(this.bgRows);
                if (this.$refs !== null && this.$refs.item !== null && this.$refs.item !== undefined) {
                    this.width = this.$refs.item.offsetWidth;
                }
            },
            containerHeight: function () {
                if (!this.autoSize) return;
                return bottom(this.layout) * (this.rowHeight + this.margin[1]) + this.margin[1] + 'px';
            },
            dragEvent: function (eventName, id, x, y, h, w) {
                if (eventName === "dragmove" || eventName === "dragstart") {
                    this.placeholder.i = id;
                    this.placeholder.x = x;
                    this.placeholder.y = y;
                    this.placeholder.w = w;
                    this.placeholder.h = h;
                    this.$nextTick(function() {
                        this.isDragging = true;
                    });
                    //this.$broadcast("updateWidth", this.width);
                    this.eventBus.$emit("updateWidth", this.width);
                } else {
                    this.$nextTick(function() {
                        this.isDragging = false;
                    });
                }
                //console.log(eventName + " id=" + id + ", x=" + x + ", y=" + y);
                let l = getLayoutItem(this.layout, id);
                //GetLayoutItem sometimes returns null object
                if (l === undefined || l === null){
                    l = {x:0, y:0}
                }
                l.x = x;
                l.y = y;
                // Move the element to the dragged location.
                this.layout = moveElement(this.layout, l, x, y, true);
                compact(this.layout, this.verticalCompact);
                // needed because vue can't detect changes on array element properties
                this.eventBus.$emit("compact");
                this.updateHeight();
                if (eventName === 'dragend') this.$emit('layout-updated', this.layout);
            },
            resizeEvent: function (eventName, id, x, y, h, w) {
                if (eventName === "resizestart" || eventName === "resizemove") {
                    this.placeholder.i = id;
                    this.placeholder.x = x;
                    this.placeholder.y = y;
                    this.placeholder.w = w;
                    this.placeholder.h = h;
                    this.$nextTick(function() {
                        this.isDragging = true;
                    });
                    //this.$broadcast("updateWidth", this.width);
                    this.eventBus.$emit("updateWidth", this.width);

                } else {
                    this.$nextTick(function() {
                        this.isDragging = false;
                    });
                }
                let l = getLayoutItem(this.layout, id);
                //GetLayoutItem sometimes return null object
                if (l === undefined || l === null){
                    l = {h:0, w:0}
                }
                l.h = h;
                l.w = w;
                compact(this.layout, this.verticalCompact);
                this.eventBus.$emit("compact");
                this.updateHeight();
                if (eventName === 'resizeend') this.$emit('layout-updated', this.layout);
            },
             //使用svg设置背景表格;
            handleBackGround(bgRows){
                var winW = document.documentElement.clientWidth || document.body.clientWidth;
				var winH = bgRows*60;
                    winW = winW - 10;
                var heightRadius=1/bgRows;
				var innerRectStr = "";
				var itemW = (winW - 12 * 12) / 12;
				var itemH = 48;
				var itemL = 0;
				var itemT = 12;
				var fillColor = "rgba(42,155,227,0.1)";
				for(var i = 0; i < 12; i++) {
					itemL = 12 + (itemW + 12) * i;
					innerRectStr += '<rect x=' + itemL + ' y=' + itemT + ' width=' + itemW + ' height=' + itemH + ' fill="' + fillColor + '"></rect>';
				}

				var svgStr = "";
				svgStr += '<svg width=' + winW + ' height=' + winH + ' xmlns="http://www.w3.org/2000/svg" version="1.1">';
				svgStr += '<defs>';
				svgStr += '<pattern id="pattern" x=0 y=0 width=1 height='+heightRadius+'>';
				svgStr += innerRectStr;
				svgStr += '</pattern>';
				svgStr += '</defs>';
				svgStr += '<rect fill="url(#pattern)" x=0 y=0 width=' + winW + ' height=' + winH + '></rect>'
				svgStr += '</svg>';

                var vueGridBgWrap=document.getElementById("vueGridBgWrap");
                vueGridBgWrap.innerHTML = svgStr;
                //
                // var vueGridLayout=document.getElementById("vueGridLayout");
                // vueGridLayout.style.minHeight = this.bgRows*60+"px" || 0;
            },
            //监听滚动条事件;
            onWindowScroll:function(){
                var mainRight=document.getElementById("main-right");
                var curTop = mainRight.scrollTop;             //当前高度;
                var scrollHeight=mainRight.scrollHeight;   //滚动条长度; 
                var clientHeight = document.documentElement.clientHeight || document.body.clientHeight; //窗口高度
                var maxTop = scrollHeight - clientHeight; //最大可滚动高度;
                var touchTime=curTop/maxTop;
                if(touchTime>0.95 && this.isEditable){
                    this.bgRows+=5;
                    this.handleBackGround(this.bgRows);
                    this.handleBgColor(this.bgRows);
                }
            },
            //防抖动处理;
            debounceFun:function(fn, delay) {
                // 维护一个 timer
                let timer = null;
                return function() {
                    // 通过 ‘this’ 和 ‘arguments’ 获取函数的作用域和变量
                    let context = this;
                    let args = arguments;

                    clearTimeout(timer);
                    timer = setTimeout(function() {
                    fn.apply(context, args);
                    }, delay);
                }
            },
            handleBgColor:function(isEdit){
                var vueGridLayout=document.getElementById("vueGridLayout");
                var bgRows=this.bgRows;
                if(isEdit){
                    vueGridLayout.style.minHeight=bgRows*60+"px";
                    vueGridLayout.setAttribute("class","grid-layout-bg");
                }else{
                    vueGridLayout.style.minHeight="0px";
                    vueGridLayout.className = "vue-grid-layout1";
                }
            }
        },
       
    }
</script>
