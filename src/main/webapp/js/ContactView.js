;(function() {

	/**
	 * View: ContactView
	 *
	 * Responsibilities:
	 *   - Display all the ContactView Content of the ContactView screen. (today below the TobBar)
	 *
	 */

	brite.registerView("ContactView", {
		loadTmpl : true,
		transition : "dialogSlide",
		parent : "#bodyPage"
	}, {
		create : function(data, config) {
			var view = this;
			var dfd = $.Deferred();
			var createDfd = $.Deferred();
			data = data || {};
			view.groupId = data.groupId;
			if (data.id) {
				brite.dao("Contact").get(data.id).done(function(contact) {
					dfd.resolve(contact);
				});
			} else {
				dfd.resolve({});
			}
			dfd.done(function(contact) {
				view.contactId = contact.id;
				//get all groups with whether selected or not
				brite.dao("Contact").getAllGroupsWithSelect(data.id).done(function(groups) {
					contact.groups = groups;
					renderer.render("ContactView", contact).done(function(html) {
						var $e = $(html);
						if (data.flip) {
							$e.find(".card").addClass("flipped");
						}
						//show a screen to prevent use click other places
						view.$screen = $("<div class='notTransparentScreen'></div>").appendTo("#bodyPage");
						createDfd.resolve($e);
					});
				});
			});

			return createDfd.promise();
		},

		events : {
			//close dialog when user click
			"btap;.btnClose" : function() {
				var view = this;
				view.close();
			},

			// save contact info when user click
			"btap;.btnUpdate" : function() {
				var view = this;
				saveContact.call(view);
			},

			//card flip
			"btap;.btnCardFlip" : function() {
				var view = this;
				var $e = view.$el;
				$e.find(".card").toggleClass("flipped");
			},

		},

		close : function() {
			var view = this;
			var $e = view.$el;
			$e.bRemove();
			view.$screen.remove();
		}

	});
	
	// --------- View Private Methods --------- //
	function saveContact() {
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
		if (view.contactId) {
			data.id = view.contactId;
			brite.dao("Contact").update(data).done(function() {
				var nGroupsIds = [];
				$e.find("input[name='group']:checked").each(function() {
					nGroupsIds.push($(this).val());
				});

				// save contact groups
				brite.dao("Contact").updateGroups(view.contactId, nGroupsIds).done(function() {
					dfd.resolve();
				});
			});

			//show contact list
			dfd.done(function() {
				view.close();
			});
		}

	}

	// --------- /View Private Methods --------- //

})();
