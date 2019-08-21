var config = {
	// baseUrl :'.',
	paths: {
		"text": "../../vendor/requirejs/text",
		"css": "../../vendor/requirejs/css",
	},
	waitSeconds: 0
}
require.config(config);

require(['text!./templates.json'], function(categorys){
    categorys = JSON.parse(categorys);

    window.app = new Vue({
        el: '#app',
        data: function () {
          return {
            categorys:categorys,
            templates:{},
            templateIndex:'0',
            categoryIndex:'0',
            tempImg:'',
            template:{}
          }
        },
        methods: {
            selectCategory: function(index){
                var category = this.categorys[index];
                this.templates = category.templates;
                this.$refs['tempMenu'].activedIndex = '0';

            },
            selectTemplate: function(index){
                // var category = categorys[index];
                this.template = this.templates[index];
                this.tempImg = this.template.pic;
            }
        },
        created(){
            this.templates = this.categorys[0].templates;
            this.selectTemplate(0);
        }

      });

      window.getSelectTemplate = function(){
        return window.app.template;
      }
    
})