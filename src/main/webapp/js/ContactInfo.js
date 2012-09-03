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
				brite.dao.get("Contact", data.id).done(function(contact) {
					dfd.resolve(contact);
				});
			}else{
				dfd.resolve({});
			}
			dfd.done(function(contact){
				c.contactId = contact.id;
				brite.dao.invoke("getAllGroupsWithSelect","Contact", data.id).done(function(groups){
					contact.groups = groups;
					var html = $("#tmpl-ContactInfo").render(contact);
					var $e = $(html);
					createDfd.resolve($e);
				});
			});

			return createDfd.promise();
		}

		ContactInfo.prototype.postDisplay = function(data, config) {
			var c = this;
			var $e = c.$element;
			
			$e.on("btap",".btnBack",function(){
				brite.display("GroupsPanel",{groupId:c.groupId},{transition:"slideLeft"});
			});
			
			
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
			if(c.contactId){
				brite.dao.update("Contact",c.contactId,data).done(function(){
					var nGroupsIds = [];
					$e.find("input[name='group']:checked").each(function(){
						nGroupsIds.push($(this).val() * 1);
					});
					
					brite.dao.invoke("updateGroups","Contact",c.contactId,nGroupsIds).done(function(){
						dfd.resolve();
					});
				});
				
				dfd.done(function(){
					brite.display("ContactsPanel",{groupId:c.groupId},{transition:"slideLeft"});
				});
			}
			
			
		}
		// --------- /Component Private Methods --------- //

		// --------- Component Registration --------- //
		brite.registerComponent("ContactInfo", {
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
