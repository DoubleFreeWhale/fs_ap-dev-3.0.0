<template>
    <div>
        <!-- 卡片 -->
        <ul class="card-area" v-if="cardData && cardData.length">
            <li v-for="(column,index) in cardData"> 
                <div class="card-div">
                    <div class="infolist-tpl-mgr-main-area">
                        <div class="fl infolist-tpl-mgr-l-area">
                            <label><span>{{column.type==0?'报表':'仪表板'}}</span></label>
                            <label class="strong"><span>{{column.name}}</span></label>
                            <label><span>{{column.creator}}</span></label>
                            <label><span>{{timestampToTime(column.creat_time)}}</span></label>
                        </div>
                        <div class="infolist-tpl-mgr-r-area">
                            <i :class="iconName"></i>
                        </div>
                    </div>
                    <div class="card-btn-area">
                        <i class="ifbp-icon-developer-board" @click='cardDeveloperClick(index)' title="关联功能"></i>
                        <i class="ifbp-icon-delete" @click='cardDeleteClick(index)' title="删除"></i>
                        <i class="ifbp-icon-right" @click='cardMoveClick(index)' title="移动"></i>
                        <el-tooltip placement="bottom" effect="light">
                            <i class="ifbp-icon-more el-tooltip"></i>
                            <ul slot="content" class="tooltip-area">
                                <li class="el-table-more-operate-item" @click='cardAscendingClick(index)'><i class="ifbp-icon-ascending"></i><span>上移</span></li>
                                <li class="el-table-more-operate-item" @click='cardDescendingClick(index)'><i class="ifbp-icon-descending"></i><span>下移</span></li>
                            </ul>
                        </el-tooltip>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
  export default {
    name: 'ifbpInfolistCard',
    props: {
        cardData:{
            type:Array,
            default:[]
        },
        iconName:{
            type:String,
            default:"ifbp-icon-description"
        }
    },
    methods: {
        cardDeveloperClick(index){
            this.$emit('cardDeveloperClick', {'$index':index,'row':this.cardData[index]});
        },
        cardDeleteClick(index){
            this.$emit('cardDeleteClick', {'$index':index,'row':this.cardData[index]});
        },
        cardMoveClick(index){
            this.$emit('cardMoveClick', {'$index':index,'row':this.cardData[index]});
        },
        cardAscendingClick(index){
            this.$emit('cardAscendingClick', {'$index':index,'row':this.cardData[index]});
        },
        cardDescendingClick(index){
            this.$emit('cardDescendingClick', {'$index':index,'row':this.cardData[index]});
        },
        timestampToTime(timestamp) {
            let date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
            let Y = date.getFullYear() + '/';
            let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '/';
            let D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate());
            return Y+M+D;
        }     
    }
  };
</script>
<style scope>
.card-area  .infolist-tpl-mgr-main-area{
  position: relative;
  height: 95px;
}
/* 卡片左侧内容 */
.card-area .infolist-tpl-mgr-l-area{
  vertical-align: top;
  width: 100%;
  box-sizing: border-box;
  padding-right: 96px;
  overflow:hidden;
}
.card-area .infolist-tpl-mgr-l-area label{
  display: block;
  width:100%; 
  box-sizing: border-box;
  padding-right: 5px;
  white-space:nowrap; 
  overflow:hidden; 
  text-overflow:ellipsis; 
  font-size:14px;
  height: 18px;
  margin-bottom: 8px;
  color: #75787B;
}
.card-area .infolist-tpl-mgr-l-area label:last-child{
  margin-bottom: 4px;
}
.card-area .infolist-tpl-mgr-l-area label.strong{ 
  font-size: 18px;
  height: 22px;
  color: #2D2D2D;
  margin-bottom: 12px;
}
/* 卡片右侧内容 */
.card-area .infolist-tpl-mgr-r-area{
  box-sizing: border-box;
  width: 96px;
  margin-top:32px;
  padding-left: 16px;
  position: absolute;
  right: 0;
}
.card-area .infolist-tpl-mgr-r-area label{
  display: block;
  text-align: right;
  margin: 6px 0 0 0;
}
.card-area .card-div:hover .infolist-tpl-mgr-r-area label{
  display: none;
}
.card-area .infolist-tpl-mgr-r-area span{
  display: inline-block;
  font-size: 12px;
  line-height: 18px;
  color: #fff;
  text-align: center;
  padding: 0 12px;
  background: #A6B7CB;
  border-radius: 2px;
  margin-right: 16px;
}
.card-area .infolist-tpl-mgr-r-area span.active{
  background: #42BBA7;
}
.card-area .infolist-tpl-mgr-r-area i{
  font-size: 64px;
  color: #DCF0FD;
}
</style>