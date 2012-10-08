;(function() {

	/**
	 * View: ContactInfo
	 *
	 * Responsibilities:
	 *   - Display all the ContactInfo Content of the ContactInfo screen. (today below the TobBar)
	 *
	 */

	brite.registerView("ContactInfo", {
		loadTmpl : true,
		emptyParent : true,
		transition : "slideRight",
		parent : ".MainScreen-content"
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
					renderer.render("ContactInfo", contact).done(function(html) {
						var $e = $(html);
						createDfd.resolve($e);
					});
				});
			});

			return createDfd.promise();
		},

		events : {
			// show contacts panel view
			"btap;.btnBack" : function() {
				var view = this;
				brite.display("ContactsPanel", null, {
					groupId : view.groupId
				}, {
					transition : "slideLeft"
				});
			},
			// save contact info when user click
			"btap;.btnUpdate" : function() {
				var view = this;
				saveContact.call(view);
			}

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
				brite.display("ContactsPanel", null, {
					groupId : view.groupId
				}, {
					transition : "slideLeft"
				});
			});
		}

	}

	// --------- /View Private Methods --------- //

})();
