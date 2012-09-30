;(function() {

	/**
	 * View: ContactCreate
	 *
	 * Responsibilities:
	 *   - Display all the ContactCreate Content of the ContactCreate screen. (today below the TobBar)
	 *
	 */
	brite.registerView("ContactCreate", {
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
				renderer.render("ContactCreate", contact).done(function(html) {
					var $e = $(html);
					//show a screen to prevent use click other places
					view.$screen = $("<div class='notTransparentScreen'></div>").appendTo("#bodyPage");
					createDfd.resolve($e);
				});
			});

			return createDfd.promise();
		},
		
		events : {
	 		"btap; .btnClose": function(){
	 			var view = this;
	 			view.close();
	 		}, 
	 		"btap; .btnCreate": function(){
	 			saveContact.call(this);
	 		}
		},

		close : function(update) {
			var view = this;
			var $e = view.$el;

			$e.bRemove();
			view.$screen.remove();
			if (update && view._updateCallback && $.isFunction(view._updateCallback)) {
				view._updateCallback();
			}
		},

		onUpdate : function(updateCallback) {
			var view = this;
			view._updateCallback = updateCallback;
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

		// if contact id exist do update,else do create
		if (view.contactId) {
			data.id = view.contactId;
			brite.dao("Contact").update(data).done(function() {
				view.close(true);
			});
		} else {
			brite.dao("Contact").create(data).done(function(obj) {
				// if group id exist save group and contact relation
				if (view.groupId) {
					var nGroupsIds = [];
					nGroupsIds.push(view.groupId);
					brite.dao("Contact").updateGroups(obj.id, nGroupsIds).done(function() {
						view.close(true);
					});
				} else {
					view.close(true);
				}
			});
		}

	}

	// --------- /View Private Methods --------- //

})();
