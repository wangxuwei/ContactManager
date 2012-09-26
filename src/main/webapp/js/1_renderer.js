var renderer = renderer || {};
(function($) {

	renderer.render = function(name, tmplData) {
		var dfd = $.Deferred();
		var tmplSource = $("<div></div>").append($("#tmpl-" + name)).html();
		sendToSandBoxForRender(tmplSource, tmplData).done(function(resultData) {
			dfd.resolve($(resultData.tmpl));
		});

		return dfd.promise();
	}

	function sendToSandBoxForRender(tmplSource, tmplData) {
		var renderDfd = $.Deferred();
		var opts = {
			tmplData : tmplData || {},
			tmplSource : tmplSource
		};
		
		$(window).one("message", function(e) {
			var resultData = e.originalEvent.data;
			renderDfd.resolve(resultData);
		});

		document.getElementById('renderframe').contentWindow.postMessage(opts, "*");

		return renderDfd.promise();
	};

})(jQuery);