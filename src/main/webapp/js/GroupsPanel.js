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
			var dfd = $.Deferred();
			renderer.render("GroupsPanel",data).done(function(html){
				var $e = $(html);
				dfd.resolve($e);
			});
			return dfd.promise();
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
			
			//when mouse down/touch start add some style
			$e.on(app.pressEvent,".groupItem",function(){
				$(this).trigger("DO_SELECT_ITEM",{$item:$(this)});
			});
			
			//when drag end remove the styles
			$e.on("bdragend",".groupItem",function(){
				$(this).trigger("DO_NOT_SELECT_ITEM",{$item:$(this)});
			});
			
			//create group when user click
			$e.on("btap",".btnCreateGroup",function(){
				brite.display("GroupCreate");
			});
			
			//toggle edit mode
			$e.on("btap",".btnEditMode:not(.disable)",function(){
				var $btn = $(this);
				var dfd = $.Deferred();
				$btn.addClass("disable");
				if($btn.attr("data-mode") == "edit"){
					hideButtons.call(c).done(function(){
						dfd.resolve();
					});
				}else{
					showButtons.call(c).done(function(){
						dfd.resolve();
					});
				}
				dfd.done(function(){
					$btn.removeClass("disable");
				});
			});
			
			
			//show group dialog to create or update
			$e.on("btap",".btnEdit",function(e){
				e.stopPropagation();
				var obj = $(this).bEntity();
				brite.display("GroupCreate",{id:obj.id});
			});
			
			//delete group when click delete button
			$e.on("btap",".btnDelete",function(e){
				e.stopPropagation();
				var $btn = $(this);
				if(!$btn.hasClass("disable")){
					$btn.addClass("disable");
					var obj = $(this).bEntity();
					var groupId = obj.id;
					var dfd = $.Deferred();
					brite.dao("GroupContact").list({match:{group_id:groupId}}).done(function(contactGroups){
						
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
						var $item = $btn.closest(".groupItem");
						$item.fadeOut(function(){
							brite.dao("Group").remove(groupId);
						});
					});
				}
			});
			
			// show contact by group
			$e.on("btap",".groupItem",function(){
				var obj = $(this).bEntity();
				brite.display("ContactsPanel",{groupId:obj.id});
			});
		}
		
		GroupsPanel.prototype.destroy = function() {
			$(document).off("."+this.id);
			brite.dao.offAny(this.id);
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
				app.util.serialResolve(groups,function(group){
					var innerDfd = $.Deferred();
					renderer.render("GroupsPanel-groupItem",group).done(function(html){
						$groups.append($(html));
						innerDfd.resolve();
					});
					return innerDfd.promise();
				}).done(function(){
					if(c.edit){
						showButtons.call(c);
					}
				});
			});
			
		}
		
		function showButtons(){
			var c = this;
			var $e = c.$element;
			var dfd = $.Deferred();
			var $btn = $e.find(".btnEditMode");
			
			$btn.html("Done");
			$btn.attr("data-mode","edit");
			
			if(c.edit){
				$e.find(".groupItem .btn").show().find("i").css("width","");
				c.edit = true;
				dfd.resolve();
			}else{
				//first show and make width is 0
				$e.find(".groupItem .btn").show().find("i").width(0);
				$e.find(".groupItem .btn i").addClass("transitioning");
				setTimeout(function(){
					//remove width style, change to origin width
					$e.find(".groupItem .btn").find("i").css("width","");
					var size = $e.find(".groupItem .btn i").size();
					var i = 0;
					$e.find(".groupItem .btn i").each(function(){
						var $i = $(this);
						$i.one("btransitionend",function(){
							$i.removeClass("transitioning");
							i++;
							if(i == size){
								c.edit = true;
								dfd.resolve();
							}
						});
					});
				},1);
			}
			
			return dfd.promise();
		}
		
		function hideButtons(){
			var c = this;
			var $e = c.$element;
			var dfd = $.Deferred();
			var $btn = $e.find(".btnEditMode");
			
			$btn.attr("data-mode","");
			$btn.html("Edit");
			
			$e.find(".groupItem .btn i").addClass("transitioning");
			setTimeout(function(){
				//first make width is 0
				$e.find(".groupItem .btn").find("i").width(0);
				var size = $e.find(".groupItem .btn i").size();
				var i = 0;
				$e.find(".groupItem .btn i").each(function(){
					var $i = $(this);
					$i.one("btransitionend",function(){
						i++;
						$i.removeClass("transitioning");
						// hide buttons
						$i.closest(".btn").hide();
						if(i == size){
							dfd.resolve();
							c.edit = false;
						}
					});
				});
			},1);
			return dfd.promise();
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
