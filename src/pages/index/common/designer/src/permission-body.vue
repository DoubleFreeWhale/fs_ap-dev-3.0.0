<template>
	<div class="persioncontain">
	<div :class="['persionbox',app.checked && showIcon ? 'persionbox_add':'persionbox_close']" v-for="(app,inx) in group" v-if="!app.hidden">
		<div class="persionbox-remove" v-if = "app.checked && showIcon">
			<i class="ifbp-icon-power-off el-icon-circle-close" @click="handlechange(app,inx)"></i>
		</div>
		<div class="persionbox-remove" v-if = "!app.checked && showIcon">
			<div style = "height: 18px;width: 18px;border-radius:50%;background: #5CB0E6;">
				<i class="ifbp-icon-add" @click = "handlechange(app,inx)"></i>
			</div>									
		</div>
		<div class="img-and-dynamic">
			<span class="img-area">
			<i v-if="!app.appIcon" class="ifbp-icon-patch" style="color:#8E8E93"></i>
    		<i v-else :class="['iconfont_form appIcon', app.appIcon ? app.appIcon :  'icon-C-app']"></i></span>
		</div>
		<div class = "colle-message">
			<div class="card-title" :title="app.label" >{{app.label}}</div>
			<div class="subtitle"> {{app.app_desc }} </div>
		</div>
	</div>
</div>
	
</template>

<script>
	export default{
	  data() {
        return {
          count: 0
        }
      },
      props: {
        group: {
          type: Array,
          default: ""
        },
        showIcon: {
          type: Boolean,
          default: true
        }
      },
      methods: {
        handlechange(app, inx) {
          this.$emit("handlechange", app, inx);
        }
      },
	}
	
	
      

	
</script>

<style scoped>
.persioncontain {
  display: -webkit-flex;
  /* Safari */
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-left: 8px;
}
.persionbox {
  height: 112px;
  width: 320px;
  background: #ffffff;
  border: 1px solid #F0F0F5;
  border-radius: 4px;
  margin: 8px;
  position: relative;
}

.persionbox_close {
  border: 1px solid #F0F0F5;
}

.persionbox_add {
  border: 1px dotted #F0F0F5;
}

.persionbox:hover {
  /* background: #eaf9ff;*/
  background: rgba(243, 246, 249, 0.50);
  border: 1px solid #F0F0F5;
  box-shadow: 0 2px 4px 0 #E2E8EF;
  cursor: pointer;
}

.persionbox:hover .persionbox-remove {
  display: block;
}

.persionbox-remove {
  position: absolute;
  top: 8px;
  right: 8px;
}

.ifbp-icon-power-off {
  color: #FF3B30;
}

.persionbox .card-title {
  font-size: 16px;
  line-height: 16px;
  color: #75787B;
  margin-top: 35px;
  font-weight: 400;
  text-align: left;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 143px;
  white-space: nowrap;
}

.persionbox .subtitle {
  font-size: 14px;
  margin-top: 12px;
  line-height: 14px;
  height: 14px;
  color: #C8C8CD;
  font-weight: 400;
  text-align: left;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 176px;
  white-space: nowrap;
}

.persionbox .img-and-dynamic {
  float: left;
  height: 112px;
  line-height: 112px;
}

.persionbox .img-and-dynamic i {
  font-size: 48px;
  margin-left: 32px;
}

.persionbox .colle-message {
  float: left;
  margin-left: 32px;
}
</style>