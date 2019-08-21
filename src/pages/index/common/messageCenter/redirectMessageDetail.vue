<template>
    <component :is="nowComp"></component>
</template>
<script>
import ifbpMessageDetail from "./messageDetail.vue";
import fbpMessageDetail from "../fbpMessageCenter/messageDetail.vue";
    export default {
        components: {
            ifbpMessageDetail, fbpMessageDetail
        },
        data() {
            var vm = this;
            var platform = vm.$context.getPlatform();
            let nowComp = 'fbp-message-detail'
            if(platform === 'ifbp'){
                nowComp = 'ifbp-message-detail'
            }
            return {
                platform: platform,
                nowComp: nowComp
            }
        }
    }
</script>

