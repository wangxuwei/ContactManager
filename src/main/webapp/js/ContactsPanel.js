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
			data = data || {};
			this.groupId = data.groupId || "";
			var createDfd = $.Deferred();
			brite.dao("Group").get(data.groupId).done(function(group){
				var groupName = "All"
				if(group){
					groupName = group.name;
				}
				data.groupName = groupName;
				var html = $("#tmpl-ContactsPanel").render(data);
				var $e = $(html);
				createDfd.resolve($e);
			});
			return createDfd.promise();
		}


		ContactsPanel.prototype.postDisplay = function(data, config) {
			var c = this;
			var $e = c.$element;
			var mainScreen = $e.bComponent("MainScreen");
			
			refresh.call(c);
			
			//bind event with refresh contacts
			$(document).on("DO_CONTACTSPANEL_REFRESH",function(){
				refresh.call(c);
			});
			
			//show group panel view
			$e.on("btap",".btnBack",function(){
				brite.display("GroupsPanel",{},{transition:"slideLeft"});
			});
			
			//create contact when user click
			$e.on("btap",".btnCreateContact",function(){
				brite.display("ContactCreate",{groupId:c.groupId}).done(function(contactCreate){
					contactCreate.onUpdate(function(){
						$(document).trigger("DO_CONTACTSPANEL_REFRESH");
					});
				});
			});
			
			//show contact dialog to create or update
			$e.on("btap",".btnEdit",function(e){
				e.stopPropagation();
				var obj = $(this).bObjRef();
				brite.display("ContactCreate",{id:obj.id}).done(function(contactCreate){
					contactCreate.onUpdate(function(){
						refresh.call(c);
					});
				});
			});
			
			//delete contact when click delete button
			$e.on("btap",".btnDelete",function(e){
				e.stopPropagation();
				var $btn = $(this);
				if(!$btn.hasClass("disable")){
					$btn.addClass("disable");
					var obj = $(this).bObjRef();
					var contactId = obj.id;
					var dfd = $.Deferred();
					brite.dao("GroupContact").list({match:{contact_id:contactId}}).done(function(contactGroups){
						
						//first delete relations
						if(contactGroups.length > 0){
							app.util.serialResolve(contactGroups,function(contactGroup){
								var innerDfd = $.Deferred();
								brite.dao("GroupContact").remove(contactGroup.id).done(function(){
									innerDfd.resolve();
								});
								
								return innerDfd.promise();
							}).done(function(){
								dfd.resolve();
							});
						}else{
							dfd.resolve();
						}
						
					});
					
					// then delete group
					dfd.done(function(){
						console.log(1);
						var $item = $btn.closest(".contactItem");
						$item.fadeOut(function(){
							brite.dao("Contact").remove(contactId).done(function(){
								refresh.call(c);
							});
						});
					});
				}
			});
			
			// show contact groups dialog
			$e.on("btap",".btnSelectGroup",function(e){
				e.stopPropagation();
				var obj = $(this).bObjRef();
				brite.display("ContactGroups",{id:obj.id});
			});
			
			// show contact info panel
			$e.on("btap",".contactItem",function(){
				var obj = $(this).bObjRef();
				brite.display("ContactInfo",{id:obj.id,groupId:c.groupId});
			});
		}

		ContactsPanel.prototype.destroy = function() {
			$(document).off("."+this.id);
		}
		// --------- /Component Interface Implementation ---------- //

		// --------- Component Public API --------- //

		// --------- /Component Public API --------- //

		// --------- Component Private Methods --------- //
		function refresh(){
			var c = this;
			var $e = c.$element;
			var $contacts = $e.find(".contactsList").empty();
			brite.dao("Contact").getContactsByGroup(c.groupId).done(function(contacts){
				for (var i = 0; i < contacts.length; i++) {
					var contact = contacts[i];
					var html = $("#tmpl-ContactsPanel-contactItem").render(contact);
					$contacts.append($(html));
				}			
			});
			
		}
		// --------- /Component Private Methods --------- //

		// --------- Component Registration --------- //
		brite.registerView("ContactsPanel", {
			loadTmpl : true,
			emptyParent : true,
			transition : "slideRight",
			parent:".MainScreen-content"
		}, function() {
			return new ContactsPanel();
		});
		// --------- Component Registration --------- //

	})(jQuery);

})();
