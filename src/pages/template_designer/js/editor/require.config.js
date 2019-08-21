//不要直接修改require.config.js文件，源文件为require.config.ejs
var config = {
	// baseUrl :'/',
	paths: {
		"text": "vendor/requirejs/text",
		"css": "vendor/requirejs/css",
		"jquery": "vendor/jquery",
		"immutable": "vendor/immutable",
		"directives": "js/editor/directives",
		"elToolsPanel": "js/editor/components/elToolsPanel/elToolsPanel",
		"compUtil": "js/editor/compUtil",
		"scrollbar": "vendor/scrollbar/perfect-scrollbar",
		"mock": "vendor/mock-min",
		
			"engineMixin":"uitemplate/engine_mixin",
					
		
		"compHelper":"uitemplate/compHelper"
		
		
	},
	shim: {
		scrollbar:{
			deps: ['css!vendor/scrollbar/perfect-scrollbar.css','vendor/scrollbar/jquery.mousewheel']
		}
	},
	waitSeconds: 0
}
require.config(config);