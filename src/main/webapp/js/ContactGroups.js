;(function() {

	/**
	 * Component: ContactGroups
	 *
	 * Responsibilities:
	 *   - Display all the ContactGroups Content of the ContactGroups screen. (today below the TobBar)
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
		function ContactGroups() {
		};

		ContactGroups.prototype.create = function(data, config) {
			var c = this;
			var dfd = $.Deferred();
			data = data || {};
			if(data.id){
				c.contactId = data.id;
			}
			
			//get all groups with whether selected or not
			brite.dao.invoke("getAllGroupsWithSelect","Contact", data.id).done(function(groups){
				var html = $("#tmpl-ContactGroups").render({groups:groups});
				var $e = $(html);
				c.$screen = $("<div class='notTransparentScreen'></div>").appendTo("#bodyPage");
				dfd.resolve($e);
			});

			return dfd.promise();
		}

		ContactGroups.prototype.postDisplay = function(data, config) {
			var c = this;
			var $e = c.$element;
			
			//close dialog when user click 
			$e.on("btap",".btnClose",function(){
				c.close();
			});
			
			//save contact groups when click
			$e.on("btap",".btnUpdate",function(){
				saveGroups.call(c);
			});
		}

		// --------- /Component Interface Implementation ---------- //

		// --------- Component Public API --------- //
		ContactGroups.prototype.close = function(update) {
			var c = this;
			var $e = c.$element;
			
			$e.bRemove();
			c.$screen.remove();
			if(update && c._updateCallback && $.isFunction(c._updateCallback)){
				c._updateCallback();
			}
		}
		
		ContactGroups.prototype.onUpdate = function(updateCallback) {
			var c = this;
			c._updateCallback = updateCallback;
		}
		// --------- /Component Public API --------- //

		// --------- Component Private Methods --------- //
		function saveGroups(){
			var c = this;
			var $e = c.$element;
			
			var nGroupsIds = [];
			$e.find("input[name='group']:checked").each(function(){
				nGroupsIds.push($(this).val() * 1);
			});
			
			//update contact group relation with new group ids
			brite.dao.invoke("updateGroups","Contact",c.contactId,nGroupsIds).done(function(){
				c.close(true);
			});

		}
		// --------- /Component Private Methods --------- //

		// --------- Component Registration --------- //
		brite.registerView("ContactGroups", {
			loadTmpl : true,
			transition:"dialogSlide",
			parent:"#bodyPage"
		}, function() {
			return new ContactGroups();
		});
		// --------- Component Registration --------- //

	})(jQuery);

})();
