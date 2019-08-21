<template>
  <div class="card" :class="sizeClass" :style="styleObject" >
    <!-- <div class="card-opcity" v-if="styleObject.backgroundImage"></div> -->
    <!-- <div :class="{'card-title': !titleCenter, 'card-title1':titleCenter}">
      {{title}}
    </div> -->
    <div class="card-title">
      {{title}}
    </div>
    <slot name="media">
<!--      <img class="card-slot" src="../images/FESCOicon.ico" width="100%" alt="">-->
    </slot>

  </div>
</template>

<script>
    export default {
      name: 'ElTile',
      props: ['title', 'size', 'cardStyle'],
      data() {
        return {
          sizeClass: 'sm',
          styleObject: {
            color: '#000000',
            fontSize: '16px'
          }
        };
      },
      watch: {
        cardStyle(val) {
          this.styleObject = val;
        }
      },
      created() {
        if (this.size) {
          this.sizeClass = this.size;
        }
        if (this.cardStyle) {
          this.styleObject = this.cardStyle;
        }
      }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
    .card{
        background: #fff;
        height: auto;
        float: left;
        width: 25%;
        text-align: center;
        position: relative;
        z-index: 0;
        /* overflow: hidden; */ /* 解决pad磁贴滑动的时候不显示的问题，如果有问题通过其他方式实现 */
        box-shadow: 0 3px 8px -6px rgba(0,0,0,.1);
        box-sizing: border-box;
        margin: 20px;
        padding: 10px;
        border-radius: 3px;
    }
    .card:hover{
        box-shadow: 0 0 5px rgba(0,0,0,.08) inset;
        -webkit-transition: all .15s ease;
        transition: all .15s ease;
        cursor: pointer;
    }
    /* .card:first-child:before {
        border-left: none;
    } */
    /* .card:last-child:before {
        border-right: 1px solid rgba(0,0,0,.1);
    } */
    .card:before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        pointer-events: none;
    }
    .card-title{
        white-space:nowrap;
        text-overflow: ellipsis;
    }
    .card-title1{
        white-space:nowrap;
        text-align: center;
        text-overflow: ellipsis;
    }
    .card.hasBgImg .card-title{
        color: #fff;
        position: relative;
        z-index: 2;
    }
    .sm{width:100px}
    .md{width:200px}
    .lg{width:400px}
    .card-slot{
        max-width: 150px;
        text-align: center;
        margin: 0 auto;
        overflow: hidden;
        height: 80%;
    }
    .card-opcity{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 88px;
        background: gray;
        opacity: .7;
    }
</style>
