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
			var createDfd = $.Deferred();
			data = data || {};
			if(data.id){
				c.contactId = data.id;
				brite.dao.list("GroupContact", {match:{contact_id:data.id}}).done(function(contactGroups) {
					dfd.resolve(contactGroups);
				});
			}else{
				dfd.resolve({});
			}
			dfd.done(function(contactGroups){
				brite.dao.list("Group").done(function(groupsList){
					var groups = [];
					for(var i = 0; i < groupsList.length; i++){
						var oGroup = groupsList[i];
						for(var j = 0; j < contactGroups.length; j++){
							var sGroup = contactGroups[j];
							if(sGroup.group_id == oGroup.id){
								oGroup.checked = true;
								break;
							}
						}
						groups.push(oGroup);
					}
					var html = $("#tmpl-ContactGroups").render({groups:groupsList});
					var $e = $(html);
					createDfd.resolve($e);
				});
				
			});

			return createDfd.promise();
		}

		ContactGroups.prototype.postDisplay = function(data, config) {
			var c = this;
			var $e = c.$element;
			
			
			$e.on("btap",".btnClose",function(){
				c.close();
			});
			
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
			
			
			brite.dao.list("GroupContact", {
				match : {
					contact_id : c.contactId
				}
			}).done(function(contactGroups) {
				var removeDfd = $.Deferred();
				var createDfd = $.Deferred();
				
				// do remove first
				app.util.serialResolve(contactGroups, function(obj) {
					var innerDfd = $.Deferred();
					var exist = false;
					
					for(var j = 0; j < nGroupsIds.length; j++){
						if(obj.group_id == nGroupsIds[j]){
							exist = true;
							break;
						}
					}
					
					if(!exist){
						brite.dao.remove("GroupContact",obj.id).done(function(){
							innerDfd.resolve();
						});
					}else{
						innerDfd.resolve();
					}
					
					return innerDfd.promise();
				}).done(function() {
					removeDfd.resolve();
				}); 
				
				
				//do create
				removeDfd.done(function(){
					app.util.serialResolve(nGroupsIds, function(o) {
						var innerDfd = $.Deferred();
						var exist = false;
						
						for(var j = 0; j < contactGroups.length; j++){
							var obj = contactGroups[j];
							if(obj.group_id == o){
								exist = true;
								break;
							}
						}
						
						if(!exist){
							brite.dao.create("GroupContact",{contact_id:c.contactId,group_id:o}).done(function(){
								innerDfd.resolve();
							});
						}else{
							innerDfd.resolve();
						}
						return innerDfd.promise();
					}).done(function() {
						createDfd.resolve();
					});
				});
				 
				createDfd.done(function(){
					c.close(true);
				});
				
			}); 

		}
		// --------- /Component Private Methods --------- //

		// --------- Component Registration --------- //
		brite.registerComponent("ContactGroups", {
			loadTmpl : true,
			parent:"#bodyPage"
		}, function() {
			return new ContactGroups();
		});
		// --------- Component Registration --------- //

	})(jQuery);

})();
