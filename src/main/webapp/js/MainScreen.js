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
			var html = $("#tmpl-MainScreen").render(data);
			var $e = $(html);
			return $e;
		}


		MainScreen.prototype.postDisplay = function(data, config) {
			var c = this;
			var $e = c.$element;
			
			brite.display("GroupsPanel");
			
			$e.on("btap",".btnCreateGroup",function(){
				brite.display("GroupCreate").done(function(groupCreate){
					groupCreate.onUpdate(function(){
						$e.trigger("MainScreen_GROUPSPANEL_REFRESH");
					});
				});
			});
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
		brite.registerComponent("MainScreen", {loadTmpl:true,parent:"#bodyPage"},
		function() {
			return new MainScreen();
		});
		// --------- Component Registration --------- //

	})(jQuery);

})();
