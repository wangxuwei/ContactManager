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
			c.groupId = data.groupId;
			if(data.id){
				brite.dao("Contact").get(data.id).done(function(contact) {
					dfd.resolve(contact);
				});
			}else{
				dfd.resolve({});
			}
			dfd.done(function(contact){
				c.contactId = contact.id;
				renderer.render("ContactCreate",contact).done(function(html){
					var $e = $(html);
					//show a screen to prevent use click other places
					c.$screen = $("<div class='notTransparentScreen'></div>").appendTo("#bodyPage");
					createDfd.resolve($e);
				});
			});

			return createDfd.promise();
		}

		ContactCreate.prototype.postDisplay = function(data, config) {
			var c = this;
			var $e = c.$el;
			
			//close dialog when user click 
			$e.on("btap",".btnClose",function(){
				c.close();
			});
			
			//save contact when click
			$e.on("btap",".btnCreate",function(){
				saveContact.call(c);
			});
		}

		// --------- /Component Interface Implementation ---------- //

		// --------- Component Public API --------- //
		ContactCreate.prototype.close = function(update) {
			var c = this;
			var $e = c.$el;
			
			$e.bRemove();
			c.$screen.remove();
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
			var $e = c.$el;
			
			var name = $e.find("input[name='contactName']").val();
			var address = $e.find("input[name='contactAddress']").val();
			var email = $e.find("input[name='contactEmail']").val();
			var data = {
				name : name,
				address : address,
				email : email
			};
			
			// if contact id exist do update,else do create
			if(c.contactId){
				data.id = c.contactId;
				brite.dao("Contact").update(data).done(function(){
					c.close(true);
				});
			}else{
				brite.dao("Contact").create(data).done(function(obj){
					// if group id exist save group and contact relation
					if(c.groupId){
						var nGroupsIds = [];
						nGroupsIds.push(c.groupId);
						brite.dao("Contact").updateGroups(obj.id,nGroupsIds).done(function(){
							c.close(true);
						});
					}else{
						c.close(true);
					}
				});
			}
			
		}
		// --------- /Component Private Methods --------- //

		// --------- Component Registration --------- //
		brite.registerView("ContactCreate", {
			loadTmpl : true,
			transition:"dialogSlide",
			parent:"#bodyPage"
		}, function() {
			return new ContactCreate();
		});
		// --------- Component Registration --------- //

	})(jQuery);

})();
