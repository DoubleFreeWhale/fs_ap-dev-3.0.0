/**
 * Created by Administrator on 2018/3/6.
 */
/*
 * Widget组件
 * */
function install(Vue) {

    Vue.component('Shortcut', {
        data: function() {
            // var arr = JSON.parse(this.shortcutarr);
            var arr = this.shortcutarr;

            return {
                innerArr: arr
            }
        },
        template: '<ul class="shortcut"><li v-for="item in innerArr" :key="item" @click="jump(item.links)">' +
            // '<img :src="item.imgSrc" alt="">' +
            '<i class="appIcon cyan iconfont_form" :class="item.iconClass"></i>' +
            '<div class="rightbox">' +
            '<p class="title"> {{item.name}} </p>' +
            '<span class="render">' +
            '</span>' +
            '</div>' +
            '</li></ul>',
        props: ['shortcutarr'],
        mounted: function() {
            this.getRenderUrl(this.shortcutarr);
        },
        methods: {
            jump: function(url) {
                window.location.replace('/ap/index.html#' + url)

            },
            getRenderUrl: function(arr) {
                // var arr = JSON.parse(arr);
                arr.forEach((v) => {
                    if (!v.render) return;
                    var url = v.render;
                    require([url], function(a) {
                        a.init();
                    })
                });
            },

        }
    });
}

export default {
    install: install
}