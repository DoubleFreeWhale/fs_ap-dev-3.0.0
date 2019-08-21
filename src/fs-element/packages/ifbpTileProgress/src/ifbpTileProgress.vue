<template>
<div>
  <div class="ifbp-tile-info" v-for="(item ,index) in tileData">
    <span class="tileLabel">{{item.name}}</span>
    <div class="ifbp-tile-innerText" v-if="showTextStyle">{{item.value}}</div>
    <div class="ifbp-tile-progress-bar__outer" :style="{width:'100%',height: tileBar +'px'}">
      <div class="ifbp-tile-progress-bar__inner" :style="barStyle[index]">
        <div class="ifbp-tile-innerText1" v-if="!showTextStyle">{{item.value}}</div>
      </div>
    </div>
  </div>
</div>

</template>
<script>
  export default {
    name: 'IfbpTileProgress',
    data() {
      return {
        tileDataValue: [],
        showTextStyle: true
        // barStyle: []
      };
    },
    props: {
      tileData: {
        type: Array
      },
      tileBar: {
        type: Number,
        default: 6
      },
      tileTextPosition: {
        type: String,
        default: 'top'
      }
    },
    // props: ['tileData', 'tileBar'],
    methods: {
      getMax() {
        return Math.max.apply(null, this.tileDataValue);
      }
    },
    computed: {
      barStyle() {
        var styleValue = [];
        for (var i = 0; i < this.tileData.length; i++) {
          styleValue.push({
            width: this.tileData[i].value / this.getMax() * 100 + '%',
            backgroundColor: this.tileData[i].color
          });
        }
        return styleValue;
      }
    },
    mounted() {

    },
    created() {
      if(this.tileData && this.tileData.length > 0){
        for (var i = 0; i < this.tileData.length; i++) {
            this.tileDataValue.push(this.tileData[i].value);
        }
      }
      if (this.tileBar <= 10) {
        if (this.tileTextPosition === 'top') {
          this.showTextStyle = true;
        } else if (this.tileTextPosition === 'inLine') {
          this.showTextStyle = false;
        }
      }
    }
  };
</script>
<style>


</style>
