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
			var mainScreen = $e.bComponent("MainScreen");
			
			refresh.call(c);
			mainScreen.$element.on("MainScreen_GROUPSPANEL_REFRESH",function(){
				refresh.call(c);
			});
			
			$e.on("btap",".btnCreateGroup",function(){
				brite.display("GroupCreate").done(function(groupCreate){
					groupCreate.onUpdate(function(){
						$e.trigger("MainScreen_GROUPSPANEL_REFRESH");
					});
				});
			});
			
			$e.on("btap",".btnEdit",function(e){
				e.stopPropagation();
				var obj = $(this).bObjRef();
				brite.display("GroupCreate",{id:obj.id}).done(function(groupCreate){
					groupCreate.onUpdate(function(){
						refresh.call(c);
					});
				});
			});
			
			$e.on("btap",".btnDelete",function(e){
				e.stopPropagation();
				var $btn = $(this);
				var obj = $(this).bObjRef();
				var groupId = obj.id * 1;
				var dfd = $.Deferred();
				brite.dao.list("GroupContact",{match:{group_id:groupId}}).done(function(contactGroups){
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
				
				dfd.done(function(){
					var $item = $btn.closest(".groupItem");
					$item.fadeOut(function(){
						brite.dao.remove("Group",groupId).done(function(){
							refresh.call(c);
						});
					});
				});
			});
			
			$e.on("btap",".groupItem",function(){
				var obj = $(this).bObjRef();
				brite.display("ContactsPanel",{groupId:obj.id * 1});
			});
		}

		// --------- /Component Interface Implementation ---------- //

		// --------- Component Public API --------- //

		// --------- /Component Public API --------- //

		// --------- Component Private Methods --------- //
		function refresh(){
			var c = this;
			var $e = c.$element;
			var $groups = $e.find(".groupsList").empty();
			
			brite.dao.list("Group").done(function(groups){
				for(var i = 0; i < groups.length; i++){
					var group = groups[i];
					var html = $("#tmpl-GroupsPanel-groupItem").render(group);
					$groups.append($(html));
				}
			});
			
		}
		// --------- /Component Private Methods --------- //

		// --------- Component Registration --------- //
		brite.registerComponent("GroupsPanel", {
			loadTmpl : true,
			emptyParent : true,
			parent:".MainScreen-content"
		}, function() {
			return new GroupsPanel();
		});
		// --------- Component Registration --------- //

	})(jQuery);

})();
