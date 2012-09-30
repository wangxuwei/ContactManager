;(function() {

	/**
	 * Component: ContactInfo
	 *
	 * Responsibilities:
	 *   - Display all the ContactInfo Content of the ContactInfo screen. (today below the TobBar)
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
		function ContactInfo() {
		};

		ContactInfo.prototype.create = function(data, config) {
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
					renderer.render("ContactInfo",contact).done(function(html){
						var $e = $(html);
						createDfd.resolve($e);
					});
				});
			});

			return createDfd.promise();
		}

		ContactInfo.prototype.postDisplay = function(data, config) {
			var c = this;
			var $e = c.$el;
			
			// show contacts panel view
			$e.on("btap",".btnBack",function(){
				brite.display("ContactsPanel",{groupId:c.groupId},{transition:"slideLeft"});
			});
			
			// save contact info when user click
			$e.on("btap",".btnUpdate",function(){
				saveContact.call(c);
			});
		}

		// --------- /Component Interface Implementation ---------- //

		// --------- Component Public API --------- //
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
					brite.display("ContactsPanel",{groupId:c.groupId},{transition:"slideLeft"});
				});
			}
			
			
		}
		// --------- /Component Private Methods --------- //

		// --------- Component Registration --------- //
		brite.registerView("ContactInfo", {
			loadTmpl : true,
			emptyParent:true,
			transition:"slideRight",
			parent:".MainScreen-content"
		}, function() {
			return new ContactInfo();
		});
		// --------- Component Registration --------- //

	})(jQuery);

})();
