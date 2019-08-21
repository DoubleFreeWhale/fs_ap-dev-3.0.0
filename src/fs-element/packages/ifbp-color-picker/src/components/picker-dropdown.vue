<template>
  <transition name="el-zoom-in-top" @after-leave="doDestroy">
    <div
      class="el-color-dropdown"
      v-show="showPopper">

     <div class="el-color-header"  @click="colorEdit = !colorEdit">
        <i v-bind:class="['el-tree-node__expand-icon', colorEdit ? 'expanded' : '']" class=" common-i"></i>选色器
        <!-- <i class="ifbp-icon-caret-down"></i>选色器 -->
     </div>
      <div v-show="colorEdit">

      <div class="el-color-dropdown__main-wrapper">
        <sv-panel ref="sl" :color="color"></sv-panel>
      </div>
      <div class="color-fun clearfix">
          <!-- <div class="fl">
              <i class="common-fun ifbp-icon-brush">
                  <input type="color" id="html5colorpicker" onchange="clickColor(0, -1, -1, 5)" value="#ff0000" style="width:85%;">
              </i>
          </div> -->
          <div class="fl">
              <hue-slider ref="hue" :color="color" style=""></hue-slider>
              <alpha-slider v-if="showAlpha" ref="alpha" :color="color"></alpha-slider> 
          </div>
          <div class="fl">
              <span class="common-fun" :style="{
                        background: currentColor
                    }">
              </span>
          </div>
        
      </div>
      <div class="color-input clearfix">
          <div class="hex">
              <input class="common-input" type="text" v-model="hex" 
              @keyup.native.enter="changeColorToRGB"
              @blur="changeColorToRGB">
              <span>Hex</span>
          </div>
          <div class="h">
              <input class="common-input" type="number" min="0" max="1" step="0.1" v-model="hsbaH" 
              @keyup.native.enter="changeColorHsbToRGB"
              @blur="changeColorHsbToRGB">
              <span>H</span>
          </div>
          <div class="s">
              <input class="common-input" type="number" min="0" max="1" step="0.1" v-model="hsbaS"
              @keyup.native.enter="changeColorHsbToRGB"
              @blur="changeColorHsbToRGB">
              <span>S</span>
          </div>
          <div class="b">
              <input class="common-input" type="number" min="0" max="1" step="0.1" v-model="hsbaB"
              @keyup.native.enter="changeColorHsbToRGB"
              @blur="changeColorHsbToRGB">
              <span>B</span>
          </div>
          <div class="a">
              <input class="common-input" type="number" min="0" max="1" step="0.1" v-model="hsbaA"
              @keyup.native.enter="changeColorHsbToRGB"
              @blur="changeColorHsbToRGB">
              <span>A</span>
          </div>
      </div>
      </div>

      <div class="default-color">
        <div class="el-color-header"   @click="colorSelect = !colorSelect">
            <i v-bind:class="['el-tree-node__expand-icon', colorSelect ? 'expanded' : '']" class=" common-i"></i>默认颜色
        </div>
        <div class="color-circle" v-show="colorSelect">
            <ul class="clearfix">
                <li class="fl" v-for="item in colors" @click="selectColor(item)">
                    <span :style="{
                        background:item
                        }">
                    </span>
                </li>
                <li class="fl add-color">
                    <i class="ifbp-icon-add" @click="addColor" style="margin-top: -3px;"></i>
                </li>
            </ul>
        </div>
      </div>
      <div class="el-color-dropdown__btns">
        <!-- <span class="el-color-dropdown__value" style="">{{ currentColor }}</span> -->
        <!-- <span class="el-color-dropdown__value" style="display: none">{{ hexs }}</span> -->
        <!-- <span class="el-color-dropdown__value" style="display: none">{{ hsba }}</span> -->
        <!-- <a href="JavaScript:" class="el-color-dropdown__link-btn" @click="$emit('clear')">{{ t('el.colorpicker.clear') }}</a> -->
        <button class="el-color-dropdown__btn" @click="confirmValue">{{ t('el.colorpicker.confirm') }}</button>
      </div>
    </div>
  </transition>
</template>

<script>
import SvPanel from './sv-panel';
import HueSlider from './hue-slider';
import AlphaSlider from './alpha-slider';
import Popper from 'fs-element/src/utils/vue-popper';
import Locale from 'fs-element/src/mixins/locale';

export default {
  name: 'el-color-picker-dropdown',

  mixins: [Popper, Locale],

  data() {
    return {
      colors: [
        '#ff3b30',
        '#ff9500',
        '#ffcc00',
        '#00a653',
        '#5ac7fa',
        '#0089fa',
        '#ff2e54',
        '#5856d6'
      ],
      hsbaH: 0,
      hsbaS: 0,
      hsbaB: 0,
      hsbaA: 0,
      hex: '',
      hexColor: '',
      colorEdit: true,
      colorSelect: true
    };
  },

  components: {
    SvPanel,
    HueSlider,
    AlphaSlider
  },

  props: {
    color: {
      required: true
    },
    showAlpha: Boolean
  },

  computed: {
    currentColor() {
      const parent = this.$parent;
      return !parent.value && !parent.showPanelColor ? '' : parent.color.value;
    }
  },
  methods: {
    confirmValue() {
      this.$emit('pick');
    },
    selectColor(color) {
      // this.color.fromString((color + '').colorRgb());
      this.color.fromString(color + '');
    },
    addColor() {
      if (this.colors.indexOf(this.hex) == -1) {
        this.colors.push(this.hex);
      }
    },
    changeColorToRGB() {
      // this.color.fromString((this.hex + '').colorRgb());
      this.color.fromString(this.hex + '');
    },
    changeColorHsbToRGB() {
      const rgb_arr = this.hslToRgb(
        parseFloat(this.hsbaH),
        parseFloat(this.hsbaS),
        parseFloat(this.hsbaB)
      );
      this.color.fromString(
        'rgb(' +
          rgb_arr[0] +
          ',' +
          rgb_arr[1] +
          ',' +
          rgb_arr[2] +
          ',' +
          parseFloat(this.hsbaA) +
          ')'
      );
    },
    rgbToHsl(rgb, flag) {
      if (/^(rgb|RGB)/.test(rgb)) {
        var aColor = rgb.replace(/(?:\(|\)|rgb|a|RGB)*/g, '').split(',');
        var a = aColor[3] / 1;
      } else {
        return;
      }
      var r = aColor[0],
        g = aColor[1],
        b = aColor[2];
      (r /= 255), (g /= 255), (b /= 255);
      var max = Math.max(r, g, b),
        min = Math.min(r, g, b);
      var h,
        s,
        l = (max + min) / 2;

      if (max == min) {
        h = s = 0; // achromatic
      } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
          case g:
            h = (b - r) / d + 2;
            break;
          case b:
            h = (r - g) / d + 4;
            break;
        }
        h /= 6;
      }
      if (flag) {
        return [h, s, l, a];
      } else {
        return [h, s, l];
      }
    },
    hslToRgb(h, s, l) {
      var r, g, b;

      if (s == 0) {
        r = g = b = l; // achromatic
      } else {
        var hue2rgb = function hue2rgb(p, q, t) {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1 / 6) return p + (q - p) * 6 * t;
          if (t < 1 / 2) return q;
          if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
          return p;
        };

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
      }

      return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }
  },

  mounted() {
    this.$parent.popperElm = this.popperElm = this.$el;
    this.referenceElm = this.$parent.$el;
  },

  watch: {
    showPopper(val) {
      if (val === true) {
        this.$nextTick(() => {
          const { sl, hue, alpha } = this.$refs;
          sl && sl.update();
          hue && hue.update();
          alpha && alpha.update();
        });
      }
    },
    currentColor(val) {
      this.hex = (val + '').colorHex();
      let hsb = this.rgbToHsl(val, true);
      this.hsbaH = hsb[0];
      this.hsbaS = hsb[1];
      this.hsbaB = hsb[2];
      this.hsbaA = hsb[3];
    }
  },
  created() {
    String.prototype.colorHex = function() {
      var that = this;
      // 十六进制颜色值的正则表达式
      var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
      // 如果是rgb颜色表示
      if (/^(rgb|RGB)/.test(that)) {
        var aColor = that.replace(/(?:\(|\)|rgba|RGB)*/g, '').split(',');
        aColor.length = 3;
        var strHex = '#';
        for (var i = 0; i < aColor.length; i++) {
          var hex = Number(aColor[i]).toString(16);
          if (hex.length < 2) {
            hex = '0' + hex;
          }
          strHex += hex;
        }
        if (strHex.length !== 7) {
          strHex = that;
        }
        return strHex;
      } else if (reg.test(that)) {
        var aNum = that.replace(/#/, '').split('');
        if (aNum.length === 6) {
          return that;
        } else if (aNum.length === 3) {
          var numHex = '#';
          for (var i = 0; i < aNum.length; i += 1) {
            numHex += aNum[i] + aNum[i];
          }
          return numHex;
        }
      }
      return that;
    };
    String.prototype.colorRgb = function() {
      var sColor = this.toLowerCase();
      // 十六进制颜色值的正则表达式
      var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
      // 如果是16进制颜色
      if (sColor && reg.test(sColor)) {
        if (sColor.length === 4) {
          var sColorNew = '#';
          for (var i = 1; i < 4; i += 1) {
            sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
          }
          sColor = sColorNew;
        }
        // 处理六位的颜色值
        var sColorChange = [];
        for (var i = 1; i < 7; i += 2) {
          sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)));
        }
        return 'RGB(' + sColorChange.join(',') + ')';
      }
      return sColor;
    };
  }
};
</script>
<style scoped>
.el-color-picker .el-icon-caret-bottom {
  font-size: 16px;
}
.el-color-svpanel {
  width: 288px;
}
.el-color-dropdown {
  width: 314px;
}
.el-color-picker__panel {
  padding: 0;
}
.el-color-header,
.el-color-dropdown__main-wrapper,
.color-input,
.default-color {
  padding: 0 8px;
}
.color-fun {
  padding-left: 8px;
  padding-right: 8px;
}
.color-fun .fl {
  margin-left: 8px;
}
.color-fun .fl:first-child {
  margin-left: 0;
}
.common-fun {
  display: inline-block;
  height: 32px;
  width: 32px;
  line-height: 32px;
  text-align: center;
  border: 1px solid #c8c8cd;
  border-radius: 4px;
  box-sizing: border-box;
}
.el-color-alpha-slider,
.el-color-hue-slider {
  width: 250px;
  border: 0 solid #75787b;
  border-radius: 2px;
}
.el-color-alpha-slider {
  margin-top: 8px;
}
.el-color-hue-slider__thumb,
.el-color-alpha-slider__thumb {
  width: 6px;
}
.el-color-dropdown__btns {
  padding: 8px;
}
.color-picker {
  width: 304px;
  height: 370px;
}
.default-color .el-color-header {
  padding: 0;
}
.el-color-header {
  color: #2d2d2d;
  font-size: 14px;
  height: 40px;
  line-height: 40px;
  width: 100%;
}
.el-color-header i {
  vertical-align: middle;
}
.color-input {
  margin-top: 7px;
}
.color-input > div {
  float: left;
  margin-left: 8px;
}
.color-input > div:first-child {
  margin-left: 0;
}
.color-input > div span {
  width: 100%;
  display: inline-block;
  text-align: center;
  text-align: center;
}
.color-input .hex,
.color-input .hex input {
  width: 88px;
}
.color-input .common-input {
  height: 24px;
  padding: 0;
  box-sizing: border-box;
  border: 1px solid #c8c8cd;
  border-radius: 2px;
  padding-left: 5px;
}
.color-input .h,
.color-input .h input {
  width: 42px;
}
.color-input .s,
.color-input .s input {
  width: 42px;
}
.color-input .b,
.color-input .b input {
  width: 42px;
}
.color-input .a,
.color-input .a input {
  width: 42px;
}
.default-color {
  margin-top: 8px;
  border-top: 1px solid #F0F0F5;
}
.color-circle ul {
  padding: 0;
  margin-top: 0;
}
.color-circle ul li {
  width: 36px;
  height: 36px;
  line-height: 36px;
  list-style: none;
  text-align: center;
  cursor: pointer;
}
.color-circle ul li span {
  display: inline-block;
  width: 20px;
  height: 20px;
  line-height: 20px;
  border-radius: 50%;
  box-shadow: 0 0 6px 0 #5ac8fa;
}
.add-color {
  color: #75787b;
}
.common-i {
        margin-right: 5px;
    border: 4px solid transparent;
    border-right-width: 0;
    border-left-width: 4px;
    border-left-color: #75787B;
}
</style>

