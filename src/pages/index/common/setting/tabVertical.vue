<template>
  <!-- <div class=""> -->
  <ul
    class="tabs-vertical"
    :class="direction"
  >
    <li
      class="li-tab"
      v-for="(item,index) in tabs"
      @click="toggleTabs(index)"
      :class="{active:index===curIndex}"
      :key="index"
    >
      {{item.value}}
    </li>
  </ul>
  <!-- </div> -->
</template>

<script>
export default {
  props: {
    direction: {
      type: String,
      default: "fl"
    },
    tabs: {
      type: Array,
      default: item => {
        return [];
      }
    },
    nowIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      curIndex: 0
    };
  },
  created() {
    this.curIndex = this.nowIndex;
  },
  methods: {
    toggleTabs(index) {
      this.curIndex = index;
      this.$emit("setCurTab", index);
    }
  }
};
</script>

<style>
.fl {
  float: left;
}
.fr {
  float: right;
}
</style>

<style scoped>
.tabs-vertical .active {
  color: #2d2d2d;
  background-color: #eaf9ff;
}
.tabs-vertical .li-tab {
  color: #8e8e93;
}
.tabs-vertical .li-tab:hover {
  color: #2d2d2d;
  background-color: #eaf9ff;
}
.tabs-vertical {
  height: 528px;
  width: 100%;
  border-right: 1px solid #E6E6EB;
}
.li-tab {
  height: 40px;
  line-height: 40px;
  cursor: pointer;
}
</style>
