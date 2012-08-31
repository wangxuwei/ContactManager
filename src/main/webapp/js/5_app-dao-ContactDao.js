(function($){
	//-------- Remote dao ---------//
	
	function RemoteContactDao(){
		this.constructor._super.constructor.call(this,"Contact");
	}
	brite.inherit(RemoteContactDao,brite.dao.RemoteDao);
	
	RemoteContactDao.prototype.getAllGroupsWithSelect = function(objectType,contactId){
	}
	
	RemoteContactDao.prototype.updateGroups = function(objectType,contactId,selectGroupIds){
	}
	
	//-------- /Remote dao ---------//
	
	//-------- Mock dao ---------//
	
	function MockContactDao(){
		this.constructor._super.constructor.call(this,"t_contact");
	}
	brite.inherit(MockContactDao,brite.dao.SQLiteDao);
	
	MockContactDao.prototype.getAllGroupsWithSelect = function(objectType,contactId){
		var dao = this;
		var dfd = $.Deferred();
		$.when(brite.dao.list("Group"), brite.dao.list("GroupContact", {match : {contact_id : contactId}})).done(function(groupsList, contactGroups) {
			var groups = [];
			for (var i = 0; i < groupsList.length; i++) {
				var oGroup = groupsList[i];
				for (var j = 0; j < contactGroups.length; j++) {
					var sGroup = contactGroups[j];
					if (sGroup.group_id == oGroup.id) {
						oGroup.checked = true;
						break;
					}
				}
				groups.push(oGroup);
			}
			dfd.resolve(groups);
		}); 

		return dfd.promise();
	}
	
	MockContactDao.prototype.updateGroups = function(objectType,contactId,selectGroupIds){
		var dao = this;
		var dfd = $.Deferred();
		
		brite.dao.list("GroupContact", {
			match : {
				contact_id : contactId
			}
		}).done(function(contactGroups) {
			var removeDfd = $.Deferred();
			var createDfd = $.Deferred();

			// do remove first
			app.util.serialResolve(contactGroups, function(obj) {
				var innerDfd = $.Deferred();
				var exist = false;

				for (var j = 0; j < selectGroupIds.length; j++) {
					if (obj.group_id == selectGroupIds[j]) {
						exist = true;
						break;
					}
				}

				if (!exist) {
					brite.dao.remove("GroupContact", obj.id).done(function() {
						innerDfd.resolve();
					});
				} else {
					innerDfd.resolve();
				}

				return innerDfd.promise();
			}).done(function() {
				removeDfd.resolve();
			});

			//do create
			removeDfd.done(function() {
				app.util.serialResolve(selectGroupIds, function(o) {
					var innerDfd = $.Deferred();
					var exist = false;

					for (var j = 0; j < contactGroups.length; j++) {
						var obj = contactGroups[j];
						if (obj.group_id == o) {
							exist = true;
							break;
						}
					}

					if (!exist) {
						brite.dao.create("GroupContact", {
							contact_id : contactId,
							group_id : o
						}).done(function() {
							innerDfd.resolve();
						});
					} else {
						innerDfd.resolve();
					}
					return innerDfd.promise();
				}).done(function() {
					createDfd.resolve();
				});
			});

			createDfd.done(function() {
				dfd.resolve();
			});

		});


		return dfd.promise();
	}
	
	MockContactDao.prototype.getContactsByGroup = function(objectType,groupId){
		var dao = this;
		var dfd = $.Deferred();
		if (groupId && groupId != "") {
			brite.dao.list("GroupContact", {
				match : {
					group_id : groupId
				}
			}).done(function(groupContacts) {
				var contacts = [];
				app.util.serialResolve(groupContacts, function(groupContact) {
					var innerDfd = $.Deferred();

					brite.dao.get("Contact", groupContact.contact_id).done(function(contact) {
						contacts.push(contact);
						innerDfd.resolve();
					});

					return innerDfd.promise();
				}).done(function(){
					dfd.resolve(contacts);
				});
			});
		} else {
			brite.dao.list("Contact").done(function(contacts) {
				dfd.resolve(contacts);
			});
		}

		return dfd.promise();
	}
	
	//-------- /Mock dao ---------//
	
	
	app.MockContactDao = MockContactDao;
	app.RemoteContactDao = RemoteContactDao;
})(jQuery);