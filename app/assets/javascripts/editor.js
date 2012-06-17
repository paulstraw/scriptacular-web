$(document).ready(function() {
	function resizeEditor() {
		var editor = $('#editor-pane');

		editor.height($(window).height() - 60);
	}
	resizeEditor();
	$(window).on('resize', resizeEditor);

	//a bunch of initialization stuff
	var supportsCodemirror = true, //TODO detect touch devices
		markupTextarea = $('#tab-markup').find('textarea'),
		styleTextarea = $('#tab-style').find('textarea'),
		scriptTextarea = $('#tab-script').find('textarea'),
		markupCodemirror,
		styleCodemirror,
		scriptCodemirror;

	//keyboard shortcuts
	key.filter = function() { return true; };
	key('ctrl+j', function() {
		$('#tab-markup-trigger').trigger('click');
		return false;
	});
	key('ctrl+k', function() {
		$('#tab-style-trigger').trigger('click');
		return false;
	});
	key('ctrl+l', function() {
		$('#tab-script-trigger').trigger('click');
		return false;
	});
	key('ctrl+;', function() {
		$('#tab-result-trigger').trigger('click');
		return false;
	});

	//bind save button
	$('#save-project').on('click', function() {
		$('form').submit();
	});

	//set up codemirrors
	if (supportsCodemirror) {
		markupCodemirror = CodeMirror.fromTextArea(markupTextarea[0], {
			indentWithTabs: true,
			lineWrapping: true,
			gutter: false,
			indentUnit: 4,
			mode: 'htmlmixed'
		});

		styleCodemirror = CodeMirror.fromTextArea(styleTextarea[0], {
			indentWithTabs: true,
			lineWrapping: true,
			gutter: false,
			indentUnit: 4,
			mode: 'css'
		});

		scriptCodemirror = CodeMirror.fromTextArea(scriptTextarea[0], {
			indentWithTabs: true,
			lineWrapping: true,
			gutter: false,
			indentUnit: 4,
			mode: 'javascript'
		});

		$('#tab-markup-trigger').on('click', function() {
			_.defer(function() {
				markupCodemirror.refresh();
			});
		});
		$('#tab-style-trigger').on('click', function() {
			_.defer(function() {
				styleCodemirror.refresh();
			});
		});
		$('#tab-script-trigger').on('click', function() {
			_.defer(function() {
				scriptCodemirror.refresh();
			});
		});
	}

	//generate result
	//TODO clean this mess up
	$('#tab-result-trigger').on('click', function() {
		var markup = markupCodemirror ? markupCodemirror.getValue() : markupTextarea.val(),
			style = styleCodemirror ? styleCodemirror.getValue() : styleTextarea.val(),
			script = scriptCodemirror ? scriptCodemirror.getValue() : scriptTextarea.val(),
			styleTag = '<style type="text/css">' + style + '</style>',
			scriptTag = '<script>' + script + '</script>';

		if (markup.indexOf('<head>') > -1) {
			markup = markup.replace('<head>', '<head>' + styleTag);
		} else if (markup.indexOf('</body>') > -1) {
			markup = markup.replace('</body>', styleTag + '</body>');
		} else {
			markup += styleTag;
		}

		if (markup.indexOf('</body>') > -1) {
			markup = markup.replace('</body>', scriptTag + '</body>');
		} else {
			markup += scriptTag;
		}

		$('#tab-result').html([
			'<iframe src="data:text/html;charset=utf-8;base64,',
			btoa(markup),
			'"></iframe>'
		].join(''));
	});
});