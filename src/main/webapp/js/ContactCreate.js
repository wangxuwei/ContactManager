;(function() {

	/**
	 * Component: ContactCreate
	 *
	 * Responsibilities:
	 *   - Display all the ContactCreate Content of the ContactCreate screen. (today below the TobBar)
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
		function ContactCreate() {
		};

		ContactCreate.prototype.create = function(data, config) {
			var c = this;
			var dfd = $.Deferred();
			var createDfd = $.Deferred();
			data = data || {};
			if(data.id){
				brite.dao.get("Contact", data.id).done(function(contact) {
					dfd.resolve(contact);
				});
			}else{
				dfd.resolve({});
			}
			dfd.done(function(contact){
				c.contactId = contact.id;
				var html = $("#tmpl-ContactCreate").render(contact);
				var $e = $(html);
				createDfd.resolve($e);
			});

			return createDfd.promise();
		}

		ContactCreate.prototype.postDisplay = function(data, config) {
			var c = this;
			var $e = c.$element;
			
			
			$e.on("btap",".btnClose",function(){
				c.close();
			});
			
			$e.on("btap",".btnCreate",function(){
				saveContact.call(c);
			});
		}

		// --------- /Component Interface Implementation ---------- //

		// --------- Component Public API --------- //
		ContactCreate.prototype.close = function(update) {
			var c = this;
			var $e = c.$element;
			
			$e.bRemove();
			if(update && c._updateCallback && $.isFunction(c._updateCallback)){
				c._updateCallback();
			}
		}
		
		ContactCreate.prototype.onUpdate = function(updateCallback) {
			var c = this;
			c._updateCallback = updateCallback;
		}
		// --------- /Component Public API --------- //

		// --------- Component Private Methods --------- //
		function saveContact(){
			var c = this;
			var $e = c.$element;
			
			var name = $e.find("input[name='contactName']").val();
			var address = $e.find("input[name='contactAddress']").val();
			var email = $e.find("input[name='contactEmail']").val();
			var data = {
				name : name,
				address : address,
				email : email
			};
			
			if(c.contactId){
				brite.dao.update("Contact",c.contactId,data).done(function(){
					c.close(true);
				});
			}else{
				brite.dao.create("Contact",data).done(function(){
					c.close(true);
				});
			}
			
		}
		// --------- /Component Private Methods --------- //

		// --------- Component Registration --------- //
		brite.registerComponent("ContactCreate", {
			loadTmpl : true,
			parent:"#bodyPage"
		}, function() {
			return new ContactCreate();
		});
		// --------- Component Registration --------- //

	})(jQuery);

})();
