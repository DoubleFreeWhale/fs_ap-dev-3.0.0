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
      <img class="card-slot" src="../images/FESCOicon.ico" width="100%" alt="">
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


