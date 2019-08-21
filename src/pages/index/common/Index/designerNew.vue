<template>
    <div>
        <grid-layout
                :layout="widgets"
                :col-num="parseInt(12)"
                :row-height="48"
                :is-draggable="false"
                :is-resizable="false"
                :vertical-compact="true"
                :use-css-transforms="true"
                :is-editable="false"
            >
                <grid-item v-for="item in widgets" 
                    :key="item.i" 
                    :x="item.x" 
                    :y="item.y" 
                    :w="item.w" 
                    :h="item.h"
                    :i="item.i"
                >
                    <designer-widget :widget="item"></designer-widget>

                </grid-item>
            </grid-layout>
    </div>
</template>

<script>
import DesignerWidget from "../designer/src/designerWidget.vue";

export default {
  components: {
    DesignerWidget
  },
  props: {
    widgets: {
      type: Array,
      default() {
        return [];
      }
    }
  }
};
</script>

<style>
</style>
