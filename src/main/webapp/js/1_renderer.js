var renderer = renderer || {};
$(function() {
	var $rendererFrame = $("#rendererFrame");
	var isChromeApp = false;
    if ($rendererFrame.length > 0) {
    	isChromeApp = true;
    }
	
	renderer.isChromeApp = isChromeApp;
	renderer.$rendererFrame = $rendererFrame;
});

(function($){
	//cache render deferred object which send to sandbox
	var _renderDfdCache = {};
	
	renderer.render = function(name, tmplData) {
		var dfd = $.Deferred();
		tmplData = tmplData || {};
		if(renderer.isChromeApp){
			var tmplSource = $("<div></div>").append($("#tmpl-" + name).clone()).html();
			sendToSandBoxForRender(tmplSource, tmplData).done(function(resultData) {
				dfd.resolve($(resultData.tmpl));
			});
		}else{
			var tmpl = $("#tmpl-" + name).render(tmplData);
			dfd.resolve($(tmpl));
		}
		return dfd.promise();
	}

	function sendToSandBoxForRender(tmplSource, tmplData) {
		var renderDfd = $.Deferred();
		var renderId = brite.uuid();
		var opts = {
			tmplData : tmplData,
			tmplSource : tmplSource,
			renderId: renderId
		};
		_renderDfdCache[renderId] = renderDfd;
		renderer.$rendererFrame[0].contentWindow.postMessage(opts, "*");

		return renderDfd.promise();
	};
	
	$(window).on("message.render", function(e) {
		var resultData = e.originalEvent.data;
		var renderId = resultData.renderId;
		if(_renderDfdCache[renderId]){
			var renderDfd = _renderDfdCache[renderId];
			renderDfd.resolve(resultData);
		}
	});
})(jQuery);