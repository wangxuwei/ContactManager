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
			var c = this;
			var $e = c.$element;
			
			brite.display("GroupsPanel");
			
		}

		// --------- /Component Interface Implementation ---------- //

		// --------- Component Public API --------- //
		MainScreen.prototype.methodOne = function(someArgs) {
		}

		// --------- /Component Public API --------- //

		// --------- Component Private Methods --------- //
		function privateMethodOne() {
			var c = this;

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
		$('#renderframe').on("load",function(){
			brite.display("MainScreen");
		});
	});
})();
