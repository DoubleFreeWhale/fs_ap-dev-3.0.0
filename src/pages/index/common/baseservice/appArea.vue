<template>
    <div class="card-page">
        <div class="cardInfo">
            <div class="card-box-outer" v-for="(item, index) in list" :key="index">
                <header class="card-name">
                    {{item.label}}
                </header>
                <app-tile v-for="(child, index) in item.children" :key="child.id+index" :child="child"
                          @jumpRoute="jumpRoute(child.path, child)"></app-tile>
            </div>
        </div>
    </div>
</template>

<script>

    import appContent from './content.vue';
    import appTile from '../appletManage/appTile.vue';
    export default {
        data() {
            return {
                groupList: [],                  //  二次菜单
                selectList: [],                 //  磁贴分组
                allList: [],                    //  全部应用
                arr: [],                        //  磁贴选择框
                value: '全部领域',
                groupValue: '选择分组',
                routeName: null,
                listChildren: null,
                options: '',
                numberData: '',
                percentage: 0,
                scrollTop: 0
            };
        },
        props: ['menuList'],
        components: {
            appContent,
            appTile
        },
        methods: {
            request() {

            },
            requestMenuCallback(dataList) {
                var self = this;
                self.list = dataList;
                let localStorage = window.ifbpLocalCache || window.localStorage;
                for (var i = 0; i < self.list.length; i++) {
                    for (var j = 0; j < self.list[i].appList.length; j++) {
                        var item = self.list[i].appList[j];
                        var path = item.path;
                        var urltype = item.urltype || '';
                        if (urltype == 'view') {
                            item.path = '/lgc/$wbalone$data:layout$' + path;
                            item.path = '/ovp?path=' + path;
                        } else if (urltype == 'url' && path.indexOf('/ifr') != 0 && path.indexOf('/lgc') != 0) {
                            path = path.replace(/\//g, '$');
                            path = path.replace(/#/g, '+');
                            item.path = '/ifr/' + path;
                        }
                    }
                }

                localStorage.setItem(name, JSON.stringify(this.groupList));
            },

            //页面走缓存时 会触发此方法
            ifbpPageInit() {
                let localStorage = window.ifbpLocalCache || window.localStorage;
                var scrollTopAppArea = localStorage.getItem("scrollTopAppArea");
                if (scrollTopAppArea || scrollTopAppArea == 0) {
                    this.$nextTick(() => {

                        $("#main-right").scrollTop(scrollTopAppArea);
                    })
                } else {
                    $("#main-right").scrollTop(this.scrollTop);
                }
            },
            jumpRoute(path, item) {
                debugger
                this.$router.replace(path);
            }
        },
        computed: {
            list(){
                let arr=this.$store.state.routerList;
                let list=[];
                arr.forEach(val=>{
                    list=list.concat(val.children)
                });

                return list
            }
        },
        created() {
            $('#main-right').attr('is-reload', '');
        },
        mounted() {
            // let scrollTop = window.vueInstance && window.vueInstance.scrollTop ? window.vueInstance && window.vueInstance.scrollTop : 0;
            // document.getElementsByClassName("view")[0].scrollTop = this.scrollTop;
            // if (scrollTop) {
            //     var show = false;
            //     var interval = setInterval(function () {
            //         if (document.getElementsByClassName("view")[0].scrollTop == scrollTop) {
            //             show = true;
            //         }
            //         document.getElementsByClassName("view")[0].scrollTop = scrollTop;
            //         if (show) {
            //             clearInterval(interval);
            //         }
            //     }, 50);
            // }
        }

    };
</script>

<style>
    .time {
        font-size: 13px;
        color: #999;
    }

    .bottom {
        margin-top: 13px;
        line-height: 12px;
    }

    .image {
        width: 50%;
        display: block;
        margin: 0 auto;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }

    .clearfix:after {
        clear: both
    }

    .dragCard {
        position: relative;
        overflow: hidden;
    }

    .cardInfo {
        margin: 0 66px 80px 66px;
    }

    .card-box {
        display: inline-block;
    }

    .card-name {
        font-size: 18px;
        color: #2D2D2D;
        position: relative;
        display: block;
        line-height: 18px;
        margin: 32px 0 8px 24px;
        box-shadow: none;
    }

    .appIcon.iconfont_form {

        font-size: 32px;
        vertical-align: middle;
    }


    .content-black header.card-name {
        color: #fff;
    }

    #main-right .view.card-page, .contnet-header-black #main-right .view.card-page {
        background: none;
    }
</style>