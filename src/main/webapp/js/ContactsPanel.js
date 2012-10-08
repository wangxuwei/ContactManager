;(function() {

	/**
	 * View: ContactsPanel
	 *
	 * Responsibilities:
	 *   - Display all the ContactsPanel Content of the ContactsPanel screen. (today below the TobBar)
	 */
	brite.registerView("ContactsPanel", {
		loadTmpl : true,
		emptyParent : true,
		transition : "slideRight",
		parent : ".MainScreen-content"
	}, {
		create : function(data, config) {
			data = data || {};
			this.groupId = data.groupId || "";
			var createDfd = $.Deferred();
			brite.dao("Group").get(data.groupId).done(function(group) {
				var groupName = "All"
				if (group) {
					groupName = group.name;
				}
				data.groupName = groupName;
				renderer.render("ContactsPanel", data).done(function(html) {
					var $e = $(html);
					createDfd.resolve($e);
				});
			});
			return createDfd.promise();
		},

		events : {
			//show group panel view
			"btap;.btnBack" : function() {
				brite.display("GroupsPanel", null, {}, {
					transition : "slideLeft"
				});
			},
			//when mouse down add some style
			"mousedown;.contactItem" : function(event) {
				var $item = $(event.currentTarget);
				$item.trigger("DO_SELECT_ITEM", {
					$item : $item
				});
			},
			//when drag end remove the styles
			"bdragend;.contactItem" : function(event) {
				var $item = $(event.currentTarget);
				$item.trigger("DO_NOT_SELECT_ITEM", {
					$item : $item
				});
			},
			//create contact when user click
			"btap;.btnCreateContact" : function() {
				var view = this;
				brite.display("ContactCreate", null, {
					groupId : view.groupId
				}).done(function(contactCreate) {
					contactCreate.onUpdate(function() {
						$(document).trigger("DO_CONTACTSPANEL_REFRESH");
					});
				});
			},
			//toggle edit mode
			"btap;.btnEditMode:not(.disable)" : function(event) {
				var $btn = $(event.currentTarget);
				var view = this;
				var dfd = $.Deferred();
				$btn.addClass("disable");
				if ($btn.attr("data-mode") == "edit") {
					$btn.attr("data-mode", "");
					$btn.html("Edit");
					hideButtons.call(view).done(function() {
						dfd.resolve();
					});
				} else {
					$btn.html("Done");
					$btn.attr("data-mode", "edit");
					showButtons.call(view).done(function() {
						dfd.resolve();
					});
				}
				dfd.done(function() {
					$btn.removeClass("disable");
				});
			},
			//show contact dialog to create or update
			"btap;.btnEdit" : function(e) {
				e.stopPropagation();
				var obj = $(e.currentTarget).bEntity();
				brite.display("ContactView", null, {
					id : obj.id
				});
			},
			//delete contact when click delete button
			"btap;.btnDelete" : function(e) {
				e.stopPropagation();
				var view = this;
				var $btn = $(e.currentTarget);
				if (!$btn.hasClass("disable")) {
					$btn.addClass("disable");
					var obj = $btn.bEntity();
					var contactId = obj.id;
					var dfd = $.Deferred();
					brite.dao("GroupContact").list({
						match : {
							contact_id : contactId
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
						var $item = $btn.closest(".contactItem");
						$item.fadeOut(function() {
							brite.dao("Contact").remove(contactId).done(function() {
								refresh.call(view);
							});
						});
					});
				}
			},

			// show contact groups dialog
			"btap;.btnSelectGroup" : function(e) {
				e.stopPropagation();
				var obj = $(e.currentTarget).bEntity();
				brite.display("ContactView", null, {
					id : obj.id,
					flip : true
				});
			},

			// show contact info panel
			"btap;.contactItem" : function(e) {
				var view = this;
				var obj = $(e.currentTarget).bEntity();
				brite.display("ContactInfo", null, {
					id : obj.id,
					groupId : view.groupId
				});
			},

		},

		docEvents : {
			//bind event with refresh contacts
			"DO_CONTACTSPANEL_REFRESH" : function() {
				var view = this;
				refresh.call(view);
			}

		},
		
		daoEvents : {
			// on dataChange of contact, just refresh all for now (can be easily optimized)
			"dataChange;Contact" : function() {
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
		var $contacts = $e.find(".contactsList").empty();
		brite.dao("Contact").getContactsByGroup(view.groupId).done(function(contacts) {
			app.util.serialResolve(contacts, function(contact) {
				var innerDfd = $.Deferred();
				renderer.render("ContactsPanel-contactItem", contact).done(function(html) {
					$contacts.append($(html));
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
			$e.find(".contactItem .btn").show().find("i").css("width", "");
			view.edit = true;
			dfd.resolve();
		} else {
			//first show and make width is 0
			$e.find(".contactItem .btn").show().find("i").width(0);
			$e.find(".contactItem .btn i").addClass("transitioning");
			setTimeout(function() {
				//remove width style, change to origin width
				$e.find(".contactItem .btn").find("i").css("width", "");
				var size = $e.find(".contactItem .btn i").size();
				var i = 0;
				$e.find(".contactItem .btn i").each(function() {
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

		$e.find(".contactItem .btn i").addClass("transitioning");
		setTimeout(function() {
			//first make width is 0
			$e.find(".contactItem .btn").find("i").width(0);
			var size = $e.find(".contactItem .btn i").size();
			var i = 0;
			$e.find(".contactItem .btn i").each(function() {
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
