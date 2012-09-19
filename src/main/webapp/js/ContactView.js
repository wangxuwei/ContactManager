;(function() {

	/**
	 * Component: ContactView
	 *
	 * Responsibilities:
	 *   - Display all the ContactView Content of the ContactView screen. (today below the TobBar)
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
		function ContactView() {
		};

		ContactView.prototype.create = function(data, config) {
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
				//get all groups with whether selected or not
				brite.dao("Contact").getAllGroupsWithSelect(data.id).done(function(groups){
					contact.groups = groups;
					var html = $("#tmpl-ContactView").render(contact);
					var $e = $(html);
					if(data.flip){
						$e.find(".card").addClass("flipped");
					}
					//show a screen to prevent use click other places
					c.$screen = $("<div class='notTransparentScreen'></div>").appendTo("#bodyPage");
					createDfd.resolve($e);
				});
			});

			return createDfd.promise();
		}

		ContactView.prototype.postDisplay = function(data, config) {
			var c = this;
			var $e = c.$element;
			
			//close dialog when user click 
			$e.on("btap",".btnClose",function(){
				c.close();
			});
			
			// save contact info when user click
			$e.on("btap",".btnUpdate",function(){
				saveContact.call(c);
			});
			
			//card flip
			$e.on("btap",".btnCardFlip",function(){
				$e.find(".card").toggleClass("flipped");
			});
		}

		// --------- /Component Interface Implementation ---------- //

		// --------- Component Public API --------- //
		ContactView.prototype.close = function(update) {
			var c = this;
			var $e = c.$element;
			
			$e.bRemove();
			c.$screen.remove();
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
			var dfd = $.Deferred();
			
			// save contact info
			if(c.contactId){
				data.id = c.contactId;
				brite.dao("Contact").update(data).done(function(){
					var nGroupsIds = [];
					$e.find("input[name='group']:checked").each(function(){
						nGroupsIds.push($(this).val());
					});
					
					// save contact groups
					brite.dao("Contact").updateGroups(c.contactId,nGroupsIds).done(function(){
						dfd.resolve();
					});
				});
				
				//show contact list
				dfd.done(function(){
					c.close();
				});
			}
			
			
		}
		// --------- /Component Private Methods --------- //

		// --------- Component Registration --------- //
		brite.registerView("ContactView", {
			loadTmpl : true,
			transition:"dialogSlide",
			parent:"#bodyPage"
		}, function() {
			return new ContactView();
		});
		// --------- Component Registration --------- //

	})(jQuery);

})();
