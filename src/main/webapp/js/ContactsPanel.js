;(function() {

	/**
	 * Component: ContactsPanel
	 *
	 * Responsibilities:
	 *   - Display all the ContactsPanel Content of the ContactsPanel screen. (today below the TobBar)
	 *
	 * Constructor Data:
	 *  - none
	 *
	 * Component API:
	 *  format: [method_name]([args]) : [concise description]
	 *  - none
	 *
	 * Component Events:
	 *  format: [ComponentName_[DO]_event_name]([argument | argumentsMap]): [concise description]
	 * - none
	 *
	 */
	(function($) {

		// --------- Component Interface Implementation ---------- //
		function ContactsPanel() {
		};

		ContactsPanel.prototype.create = function(data, config) {
			var html = $("#tmpl-ContactsPanel").render(data);
			var $e = $(html);
			return $e;
		}


		ContactsPanel.prototype.postDisplay = function(data, config) {
			var c = this;
			var $e = c.$element;
			var mainScreen = $e.bComponent("MainScreen");
			
			refresh.call(c);
			mainScreen.$element.on("MainScreen_CONTACTSPANEL_REFRESH",function(){
				refresh.call(c);
			});
			
			$e.on("btap",".btnEdit",function(){
				var obj = $(this).bObjRef();
				brite.display("ContactCreate",{id:obj.id}).done(function(contactCreate){
					contactCreate.onUpdate(function(){
						refresh.call(c);
					});
				});
			});
			
			$e.on("btap",".btnDelete",function(){
				var obj = $(this).bObjRef();
				brite.dao.remove("Contact",obj.id).done(function(){
					refresh.call(c);
				});
			});
		}

		// --------- /Component Interface Implementation ---------- //

		// --------- Component Public API --------- //

		// --------- /Component Public API --------- //

		// --------- Component Private Methods --------- //
		function refresh(){
			var c = this;
			var $e = c.$element;
			var $contacts = $e.find(".contactsList").empty();
			
			brite.dao.list("Contact").done(function(contacts){
				for(var i = 0; i < contacts.length; i++){
					var contact = contacts[i];
					var html = $("#tmpl-ContactsPanel-contactItem").render(contact);
					$contacts.append($(html));
				}
			});
			
		}
		// --------- /Component Private Methods --------- //

		// --------- Component Registration --------- //
		brite.registerComponent("ContactsPanel", {
			loadTmpl : true,
			emptyParent : true,
			parent:".MainScreen-content-right"
		}, function() {
			return new ContactsPanel();
		});
		// --------- Component Registration --------- //

	})(jQuery);

})();