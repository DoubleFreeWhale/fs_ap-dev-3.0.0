




	$(function () {
		window.codeEditor = ace.edit("code_editor");
		window.codeEditor.setTheme("ace/theme/chrome");
		window.codeEditor.getSession().setMode("ace/mode/html");
		// window.styleEditor = ace.edit("style_editor");
		// window.styleEditor.setTheme("ace/theme/chrome");
		// window.styleEditor.getSession().setMode("ace/mode/css");
	})


	window.onload= function(){
		$('#ifr_content')[0].src = './designer.html'
	}

	window._doReady = false;
	window.ready = function () {
		if (window._doReady == false && window.shell && window.engine) {
			window._doReady = true;
			window.shell.ready();
		}
	}
	// window.ready();

