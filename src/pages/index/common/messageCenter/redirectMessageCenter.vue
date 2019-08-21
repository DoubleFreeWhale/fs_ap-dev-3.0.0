<template>
    <component :is="nowComp" ref="ifbpMessageCenter"></component>
</template>
<script>
import ifbpMessageCenter from "./messageCenter.vue";
import fbpMessageCenter from "../fbpMessageCenter/messageCenter_search.vue";
    export default {
        components: {
            ifbpMessageCenter, fbpMessageCenter
        },
        data() {
            var vm = this;
            var platform = vm.$context.getPlatform();
            let nowComp = 'fbp-message-center'
            if(platform === 'ifbp'){
                nowComp = 'ifbp-message-center'
            }
            return {
                platform: platform,
                nowComp: nowComp
            }
        },
        methods: {
            ifbpPageInit(){
                this.$refs.ifbpMessageCenter.ifbpPageInit();
            }
        }
    }
</script>

