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
			var view = this;
			var dfd = $.Deferred();
			var createDfd = $.Deferred();
			data = data || {};
			view.groupId = data.groupId;
			if(data.id){
				brite.dao("Contact").get(data.id).done(function(contact) {
					dfd.resolve(contact);
				});
			}else{
				dfd.resolve({});
			}
			dfd.done(function(contact){
				view.contactId = contact.id;
				//get all groups with whether selected or not
				brite.dao("Contact").getAllGroupsWithSelect(data.id).done(function(groups){
					contact.groups = groups;
					renderer.render("ContactView",contact).done(function(html){
						var $e = $(html);
						if(data.flip){
							$e.find(".card").addClass("flipped");
						}
						//show a screen to prevent use click other places
						view.$screen = $("<div class='notTransparentScreen'></div>").appendTo("#bodyPage");
						createDfd.resolve($e);
					});
				});
			});

			return createDfd.promise();
		}

		ContactView.prototype.postDisplay = function(data, config) {
			var view = this;
			var $e = view.$el;
			
			//close dialog when user click 
			$e.on("btap",".btnClose",function(){
				view.close();
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
			var view = this;
			var $e = view.$el;
			
			$e.bRemove();
			view.$screen.remove();
		}
		
		// --------- /Component Public API --------- //

		// --------- Component Private Methods --------- //
		function saveContact(){
			var view = this;
			var $e = view.$el;
			
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
			if(view.contactId){
				data.id = view.contactId;
				brite.dao("Contact").update(data).done(function(){
					var nGroupsIds = [];
					$e.find("input[name='group']:checked").each(function(){
						nGroupsIds.push($(this).val());
					});
					
					// save contact groups
					brite.dao("Contact").updateGroups(view.contactId,nGroupsIds).done(function(){
						dfd.resolve();
					});
				});
				
				//show contact list
				dfd.done(function(){
					view.close();
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
