;(function() {

	/**
	 * View: GroupsPanel
	 *
	 * Responsibilities:
	 *   - Display all the GroupsPanel Content of the GroupsPanel screen. (today below the TobBar)
	 *
	 */
	brite.registerView("GroupsPanel", {
		loadTmpl : true,
		emptyParent : true,
		parent : ".MainScreen-content"
	}, {
		create : function(data, config) {
			var dfd = $.Deferred();
			renderer.render("GroupsPanel", data).done(function(html) {
				var $e = $(html);
				dfd.resolve($e);
			});
			return dfd.promise();
		},

		events : {

			//when mouse down/touch start add some style
			"mousedown;.groupItem" : function(e) {
				var $item = $(e.currentTarget);
				$item.trigger("DO_SELECT_ITEM", {
					$item : $item
				});
				console.log(2);
			},

			//when drag end remove the styles
			"bdragend;.groupItem" : function(e) {
				var $item = $(e.currentTarget);
				$item.trigger("DO_NOT_SELECT_ITEM", {
					$item : $item
				});
				console.log(3);
			},

			//create group when user click
			"btap;.btnCreateGroup" : function() {
				brite.display("GroupCreate");
			},

			//toggle edit mode
			"btap;.btnEditMode:not(.disable)" : function(e) {
				var view = this;
				var $btn = $(e.currentTarget);
				var dfd = $.Deferred();
				$btn.addClass("disable");
				if ($btn.attr("data-mode") == "edit") {
					hideButtons.call(view).done(function() {
						dfd.resolve();
					});
				} else {
					showButtons.call(view).done(function() {
						dfd.resolve();
					});
				}
				dfd.done(function() {
					$btn.removeClass("disable");
				});
			},

			//show group dialog to create or update
			"btap;.btnEdit" : function(e) {
				e.stopPropagation();
				var obj = $(e.currentTarget).bEntity();
				brite.display("GroupCreate", null, {
					id : obj.id
				});
			},

			//delete group when click delete button
			"btap;.btnDelete" : function(e) {
				e.stopPropagation();
				var $btn = $(e.currentTarget);
				if (!$btn.hasClass("disable")) {
					$btn.addClass("disable");
					var obj = $btn.bEntity();
					var groupId = obj.id;
					var dfd = $.Deferred();
					brite.dao("GroupContact").list({
						match : {
							group_id : groupId
						}
					}).done(function(contactGroups) {

						//first delete relations
						if (contactGroups.length > 0) {
							app.util.serialResolve(contactGroups, function(contactGroup) {
								var innerDfd = $.Deferred();
								brite.dao("GroupContact").remove(contactGroup.id).done(function() {
									innerDfd.resolve();
								});

								return innerDfd.promise();
							}).done(function() {
								dfd.resolve();
							});
						} else {
							dfd.resolve();
						}
					});

					// then delete group
					dfd.done(function() {
						var $item = $btn.closest(".groupItem");
						$item.fadeOut(function() {
							brite.dao("Group").remove(groupId);
						});
					});
				}
			},

			// show contact by group
			"btap;.groupItem" : function(e) {
				var obj = $(e.currentTarget).bEntity();
				brite.display("ContactsPanel", null, {
					groupId : obj.id
				});
			},

		},

		daoEvents : {
			// on dataChange of a group, just refresh all for now (can be easily optimized)
			"dataChange;Group" : function() {
				$(document).trigger("DO_GROUPSPANEL_REFRESH");
			}

		},

		docEvents : {
			//bind event with refresh groups
			"DO_GROUPSPANEL_REFRESH" : function() {
				var view = this;
				refresh.call(view);
			}

		},

		postDisplay : function(data, config) {
			var view = this;
			var $e = view.$el;
			refresh.call(view);
		}

	});
	// --------- View Private Methods --------- //
	function refresh() {
		var view = this;
		var $e = view.$el;
		var $groups = $e.find(".groupsList").empty();

		brite.dao("Group").list().done(function(groups) {
			app.util.serialResolve(groups, function(group) {
				var innerDfd = $.Deferred();
				renderer.render("GroupsPanel-groupItem", group).done(function(html) {
					$groups.append($(html));
					innerDfd.resolve();
				});
				return innerDfd.promise();
			}).done(function() {
				if (view.edit) {
					showButtons.call(view);
				}
			});
		});

	}

	function showButtons() {
		var view = this;
		var $e = view.$el;
		var dfd = $.Deferred();
		var $btn = $e.find(".btnEditMode");

		$btn.html("Done");
		$btn.attr("data-mode", "edit");

		if (view.edit) {
			$e.find(".groupItem .btn").show().find("i").css("width", "");
			view.edit = true;
			dfd.resolve();
		} else {
			//first show and make width is 0
			$e.find(".groupItem .btn").show().find("i").width(0);
			$e.find(".groupItem .btn i").addClass("transitioning");
			setTimeout(function() {
				//remove width style, change to origin width
				$e.find(".groupItem .btn").find("i").css("width", "");
				var size = $e.find(".groupItem .btn i").size();
				var i = 0;
				$e.find(".groupItem .btn i").each(function() {
					var $i = $(this);
					$i.one("btransitionend", function() {
						$i.removeClass("transitioning");
						i++;
						if (i == size) {
							view.edit = true;
							dfd.resolve();
						}
					});
				});
			}, 1);
		}

		return dfd.promise();
	}

	function hideButtons() {
		var view = this;
		var $e = view.$el;
		var dfd = $.Deferred();
		var $btn = $e.find(".btnEditMode");

		$btn.attr("data-mode", "");
		$btn.html("Edit");

		$e.find(".groupItem .btn i").addClass("transitioning");
		setTimeout(function() {
			//first make width is 0
			$e.find(".groupItem .btn").find("i").width(0);
			var size = $e.find(".groupItem .btn i").size();
			var i = 0;
			$e.find(".groupItem .btn i").each(function() {
				var $i = $(this);
				$i.one("btransitionend", function() {
					i++;
					$i.removeClass("transitioning");
					// hide buttons
					$i.closest(".btn").hide();
					if (i == size) {
						dfd.resolve();
						view.edit = false;
					}
				});
			});
		}, 1);
		return dfd.promise();
	}

	// --------- /View Private Methods --------- //

})();
