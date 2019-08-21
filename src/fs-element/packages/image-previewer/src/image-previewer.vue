<style scoped>
  .navBox {
    position: relative;
    width: 100%;
    list-sytle: none;
    max-width: 320px;
    margin: 0 auto;
    margin-top: 50px;
  }
  .navBox .showBox {
    width: 246px;
    margin: 0 auto;
    overflow: hidden;
  }
  .navBox ul {
    width: 10000px;
    margin: 0;
    padding: 0;
    transition: transform 1s;
  }
  .navBox li {
    width: 55px;
    height: 55px;
    opacity: 0.3;
    margin: 0 3px;
    border-radius: 8px;
    display: inline-block;
    float: left;
    overflow:hidden;
    cursor: pointer;
  }
  .navBox li img {
    width: 55px;
    height: 55px;
  }
  .navBox li.on, .navBox li.on img {
    width: 53px;
    height: 53px;
  }
  .navBox li.on {
    border: solid 2px rgb(178, 187, 198);
    opacity: 1;
  }
  .navBox .li-btn {
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    opacity: 0.6;
    color: #999999;
    position: absolute;
  }
  .navBox .li-btn:hover {
    opacity: 1;
  }
  .navBox .button-prev{
    top: 20px;
    left: 15px;
  }
  .navBox .button-next{
    top: 20px;
    right: 15px;
  }
  .s_Image{
    margin: auto auto;
    max-height: 400px;
  }

</style>
<template>
<el-dialog 
  :title="title" 
  v-model="s_visible"
  size="full">
  <div class="image-previewer" v-if="true">
    <el-carousel arrow="always"
                 ref="carousel"
                 indicator-position="none"
                 :autoplay="false"
                 height="400px"
                 :type="type"
                 @change="handleCarouselChange">
      <el-carousel-item v-for="url in imageUrls" :key="url" style="padding: 0; text-align: center;">
        <img class="s_Image" :src="url">
      </el-carousel-item>
    </el-carousel>
    <div class="navBox" v-if="imageUrls.length && showNavBox">
      <div class="showBox">
        <ul>
          <li v-for="index in imageUrls.length" :class="{on: index === 1}" :id="'nav-item-'+index" @click="handleClickLiItem(index)">
            <img v-if="imageUrls[index-1]" :src="imageUrls[index-1]">
          </li>
        </ul>
      </div>
      <i class="li-btn button-prev el-icon-arrow-left" @click="handleClickPrevBtn"></i>
      <i class="li-btn button-next el-icon-arrow-right" @click="handleClickNextBtn"></i>
    </div>
  </div>
  <div v-else> 
    <p style="text-align:center; line-height: 300px;">暂无图片可以预览</p>
  </div>
</el-dialog>
</template>
<script>
  export default {
    name: 'ElImagePreviewer',
    props: {
      imageUrls: {
        type: Array,
        default: function() {
          return [];
        }
      },
      type: {
        type: String,
        default: ''
      },
      showNavBox: {
        type: Boolean,
        default: true
      },
      title: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        s_visible: false
      };
    },
    methods: {
      handleCarouselChange(index) {
        var marginLeft = document.querySelector('.navBox ul').style.marginLeft.split('px')[0];
        if (index > 2) {
          var beyondNum = index - 3;
          document.querySelector('.navBox ul').style.marginLeft = (parseInt(marginLeft, 10) - 60 * beyondNum) + 'px';
        } else {
          document.querySelector('.navBox ul').style.marginLeft = '0px';
        }
        document.querySelectorAll('.navBox ul li').forEach(item => {
          item.className = '';
        });
        document.querySelector('#nav-item-' + (index + 1)).className = 'on';
      },
      handleClickLiItem(index) {
        this.$refs.carousel.setActiveItem(index - 1);
      },
      handleClickPrevBtn() {
        this.$refs.carousel.prev();
      },
      handleClickNextBtn() {
        this.$refs.carousel.next();
      },
      show() {
        this.s_visible = true;
      },
      hide() {
        this.s_visible = false;
      }
    }
  };
</script>
