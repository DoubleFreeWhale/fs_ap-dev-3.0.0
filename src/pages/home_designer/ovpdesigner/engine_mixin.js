define([
    'immutable',
    'jquery',
    'directives',
    'compUtil',
    'text!res/businessType.json',
    ], function (immutable, jq, directives, compUtil, businessType) {
    return {
        created: function () {
            this.dType = 'ovpdesigner';
            this.tplData.layoutcontext = {
                container: '',
                options: '',
                layoutMeta: {},
            };
            this.currentDom = $('<div id="form_top" v-on:click="backPanelClick" style="height:100%"><Page v-drop :layoutcontext="layoutcontext"></Page></div>');
        },
        methods: {

        }
    }
})
