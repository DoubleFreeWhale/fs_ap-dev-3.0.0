<template>
    <div>
        <div ref="designerWidget"></div>
    </div>
</template>

<script>
export default {
    props: {
        widget: {
            type: Object,
            default(){
                return {}
            }
        }
    },
    watch: {
        widget(){
            this.widget = this.widget;
            this.showWidget();
        }
    },
    mounted(){
        this.showWidget();
    },
    methods: {
        showWidget(){
            let widget_html = '<div id="' + this.widget.id + '"><script type="text/javascript">require(["'+ this.widget.js +'"],function(plugin){plugin.init("' + this.widget.id + '","' + this.widget.id + '",'+ JSON.stringify(this.widget.params) +');})<\/script></div>';
            $(this.$refs.designerWidget).html(widget_html);
        }
    }
}
</script>

<style>

</style>
