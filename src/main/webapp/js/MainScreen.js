;(function() {

	/**
	 * Component: MainScreen
	 *
	 * Responsibilities:
	 *   - The Main Screen of the application.
	 *   - Handle the overall dimension (for now fixed)
	 *
	 * Constructor Data:
	 *   - none
	 *
	 * Component API:
	 *  format: [method_name]([args]) : [concise description]
	 *  - none
	 *
	 *
	 */
	(function($) {

		// --------- Component Interface Implementation ---------- //
		function MainScreen() {
		};

		MainScreen.prototype.create = function(data, config) {
			var dfd = $.Deferred();
			renderer.render("MainScreen",data).done(function(html){
				var $e = $(html);
				dfd.resolve($e);
			});
			return dfd.promise();
		}


		MainScreen.prototype.postDisplay = function(data, config) {
			var view = this;
			var $e = view.$el;
			
			brite.display("GroupsPanel");
			
			// add select class when press $item
			$(document).on("DO_SELECT_ITEM." + view.id,function(event,extra){
				var $item = extra.$item;
				$item.addClass("selected");
			});
			
			// remove select class when press up $item
			$(document).on("DO_NOT_SELECT_ITEM." + view.id,function(event,extra){
				var $item = extra.$item;
				console.log($item.parent().children());
				$item.parent().children().removeClass("selected");
			});
			
		}

		MainScreen.prototype.destroy = function() {
			var view = this;
			$(document).off("."+view.id);
		}
		// --------- /Component Interface Implementation ---------- //

		// --------- Component Public API --------- //
		MainScreen.prototype.methodOne = function(someArgs) {
		}

		// --------- /Component Public API --------- //

		// --------- Component Private Methods --------- //
		function privateMethodOne() {
			var view = this;

		}

		// --------- /Component Private Methods --------- //

		// --------- Component Registration --------- //
		brite.registerView("MainScreen", {loadTmpl:true,parent:"#bodyPage"},
		function() {
			return new MainScreen();
		});
		// --------- Component Registration --------- //

	})(jQuery);
	
	// load screen
	$(function() {
		if(renderer.isChromeApp){
			renderer.$rendererFrame.on("load",function(){
				brite.display("MainScreen");
			});
		}else{
			brite.display("MainScreen");
		}
	});
})();
