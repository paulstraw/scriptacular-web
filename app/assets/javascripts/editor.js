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

	//js library stuff
	var libDropdown = $('#javascript-libraries-dropdown');
	libDropdown.on('click', 'a', function(e) {
		e.stopPropagation();
	});

	var jsLibs = [
		{ title: 'jQuery 1.7.2', filename: 'jQuery-1.7.2.js', libraryId: 1, current: false },
		{ title: 'Zepto 1.0rc1', filename: 'Zepto-1.0rc1.js', libraryId: 2, current: false },
		{ title: 'Underscore 1.3.3', filename: 'Underscore-1.3.3.js', libraryId: 3, current: false },
		{ title: 'Three r49', filename: 'Three-r49.js', libraryId: 4, current: false },
	];

	var currentLibs = $.parseJSON($('#project_libraries').val()),
		libTemplate = _.template('<li><a href="#"><label><input<% if (current) { %> checked<% } %> type="checkbox" data-filename="<%= filename %>" data-library-id="<%= libraryId %>"> <%= title %></label></a></li>');
	_.each(jsLibs, function(lib) {
		if (_.indexOf(currentLibs, lib.libraryId) > -1) {
			lib.current = true;
		}
		libDropdown.append(libTemplate(lib));
	});

	//bind save button
	$('#save-project').on('click', function() {
		var libs = [];

		_.each(libDropdown.find('input:checked'), function(lib) {
			libs.push(parseInt($(lib).data('library-id'), 10));
		});

		$('#project_libraries').val(JSON.stringify(libs));

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

		//add libraries
		_.each(libDropdown.find('input:checked'), function(lib) {
			lib = $(lib);

			var libScriptTag = [
				'<script src="',
				location.origin,
				'/js/',
				lib.data('filename'),
				'"></script>'
			].join('');

			if (markup.indexOf('</body>') > -1) {
				markup = markup.replace('</body>', libScriptTag + '</body>');
			} else {
				markup += libScriptTag;
			}
		});

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