;(function() {

	/**
	 * View: MainScreen
	 *
	 * Responsibilities:
	 *   - The Main Screen of the application.
	 *   - Handle the overall dimension (for now fixed)
	 */

	// --------- View Registration --------- //
	brite.registerView("MainScreen", {
		loadTmpl : true,
		parent : "#bodyPage"
	}, {
		create : function(data, config) {
			var dfd = $.Deferred();
			renderer.render("MainScreen", data).done(function(html) {
				var $e = $(html);
				dfd.resolve($e);
			});
			return dfd.promise();
		},

		docEvents : {
			// add select class when press $item
			"DO_SELECT_ITEM" : function(event, extra) {
				var $item = extra.$item;
				$item.addClass("selected");
				
				setTimeout(function(){
					$item.removeClass("selected");
				},200);
			},

		},

		postDisplay : function(data, config) {
			var view = this;
			var $e = view.$el;
			brite.display("GroupsPanel");

		}

	});
	// --------- View Registration --------- //

	// load screen
	$(function() {
		if (renderer.isChromeApp) {
			renderer.$rendererFrame.on("load", function() {
				brite.display("MainScreen");
			});
		} else {
			brite.display("MainScreen");
		}
	});
})();
