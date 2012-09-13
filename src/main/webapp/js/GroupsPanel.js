;(function() {

	/**
	 * Component: GroupsPanel
	 *
	 * Responsibilities:
	 *   - Display all the GroupsPanel Content of the GroupsPanel screen. (today below the TobBar)
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
		function GroupsPanel() {
		};

		GroupsPanel.prototype.create = function(data, config) {
			var html = $("#tmpl-GroupsPanel").render(data);
			var $e = $(html);
			return $e;
		}


		GroupsPanel.prototype.postDisplay = function(data, config) {
			var c = this;
			var $e = c.$element;
			
			refresh.call(c);
			
			// on dataChange of a group, just refresh all for now (can be easily optimized)
			brite.dao.onDataChange("Group",function(){
				$(document).trigger("DO_GROUPSPANEL_REFRESH");
			},c.id);
			
			//bind event with refresh groups
			$(document).on("DO_GROUPSPANEL_REFRESH."+c.id,function(){
				refresh.call(c);
			});
			
			//create group when user click
			$e.on("btap",".btnCreateGroup",function(){
				brite.display("GroupCreate");
			});
			
			
			//show group dialog to create or update
			$e.on("btap",".btnEdit",function(e){
				e.stopPropagation();
				var obj = $(this).bObjRef();
				brite.display("GroupCreate",{id:obj.id});
			});
			
			//delete group when click delete button
			$e.on("btap",".btnDelete",function(e){
				e.stopPropagation();
				var $btn = $(this);
				if(!$btn.hasClass("disable")){
					$btn.addClass("disable");
					var obj = $(this).bObjRef();
					var groupId = obj.id;
					var dfd = $.Deferred();
					brite.dao("GroupContact").list({match:{group_id:groupId}}).done(function(contactGroups){
						
						//first delete relations
						if(contactGroups.length > 0){
							app.util.serialResolve(contactGroups,function(contactGroup){
								var innerDfd = $.Deferred();
								brite.dao.remove("GroupContact",contactGroup.id).done(function(){
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
						var $item = $btn.closest(".groupItem");
						$item.fadeOut(function(){
							brite.dao("Group").remove(groupId);
						});
					});
				}
			});
			
			// show contact by group
			$e.on("btap",".groupItem",function(){
				var obj = $(this).bObjRef();
				brite.display("ContactsPanel",{groupId:obj.id});
			});
		}
		
		GroupsPanel.prototype.destroy = function() {
			$(document).off("."+this.id);
		}
		// --------- /Component Interface Implementation ---------- //

		// --------- Component Public API --------- //

		// --------- /Component Public API --------- //

		// --------- Component Private Methods --------- //
		function refresh(){
			var c = this;
			var $e = c.$element;
			var $groups = $e.find(".groupsList").empty();
			
			brite.dao("Group").list().done(function(groups){
				for(var i = 0; i < groups.length; i++){
					var group = groups[i];
					var html = $("#tmpl-GroupsPanel-groupItem").render(group);
					$groups.append($(html));
				}
			});
			
		}
		// --------- /Component Private Methods --------- //

		// --------- Component Registration --------- //
		brite.registerView("GroupsPanel", {
			loadTmpl : true,
			emptyParent : true,
			parent:".MainScreen-content"
		}, function() {
			return new GroupsPanel();
		});
		// --------- Component Registration --------- //

	})(jQuery);

})();
