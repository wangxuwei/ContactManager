(function($){
	//-------- Remote dao ---------//
	
	function RemoteContactDao(){
		this.constructor._super.constructor.call(this,"Contact");
	}
	brite.inherit(RemoteContactDao,brite.dao.RemoteDao);
	
	RemoteContactDao.prototype.getAllGroupsWithSelect = function(contactId){
		var data = {};
		data.contactId = contactId;

		return $.ajax({
			type : "GET",
			url : app.remoteServiceURL + "/getAllGroupsWithSelect.json",
			data : data,
			dataType : "json"
		}).pipe(function(val) {
			return val.result;
		});
	}
	
	RemoteContactDao.prototype.updateGroups = function(contactId,selectGroupIds){
		var data = {
			contactId : contactId
		};
		
		var groupIds = "";
		for(var i = 0; i < selectGroupIds.length; i++){
			groupIds += selectGroupIds[i];
			if(i<selectGroupIds.length-1){
				groupIds += ",";
			}
		}
		data.selectGroupIds = groupIds;
		var dfd = $.ajax({
			type : "POST",
			url : app.remoteServiceURL + "/updateGroups.do",
			data : data,
			dataType : "json"
		}).pipe(function(val) {
			return val;
		});

	}
	
	RemoteContactDao.prototype.getContactsByGroup = function(groupId){
		var data = {};
		data.groupId = groupId;

		return $.ajax({
			type : "GET",
			url : app.remoteServiceURL + "/getContactsByGroup.json",
			data : data,
			dataType : "json"
		}).pipe(function(val) {
			return val.result;
		});
		
	}
	
	//-------- /Remote dao ---------//
	
	//-------- Mock dao ---------//
	
	function MockContactDao(){
		this.constructor._super.constructor.call(this,"Contact","t_contact");
	}
	brite.inherit(MockContactDao,brite.dao.SQLiteDao);
	
	MockContactDao.prototype.getAllGroupsWithSelect = function(contactId){
		var dao = this;
		var dfd = $.Deferred();
		$.when(brite.dao("Group").list(), brite.dao("GroupContact").list({match : {contact_id : contactId}})).done(function(groupsList, contactGroups) {
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
	
	MockContactDao.prototype.updateGroups = function(contactId,selectGroupIds){
		var dao = this;
		var dfd = $.Deferred();
		
		brite.dao("GroupContact").list({
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
					brite.dao("GroupContact").remove(obj.id).done(function() {
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
						brite.dao("GroupContact").create({
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
	
	MockContactDao.prototype.getContactsByGroup = function(groupId){
		var dao = this;
		var dfd = $.Deferred();
		if (groupId && groupId != "") {
			brite.dao("GroupContact").list({
				match : {
					group_id : groupId
				}
			}).done(function(groupContacts) {
				var contacts = [];
				app.util.serialResolve(groupContacts, function(groupContact) {
					var innerDfd = $.Deferred();

					brite.dao("Contact").get(groupContact.contact_id).done(function(contact) {
						contacts.push(contact);
						innerDfd.resolve();
					});

					return innerDfd.promise();
				}).done(function(){
					dfd.resolve(contacts);
				});
			});
		} else {
			brite.dao("Contact").list().done(function(contacts) {
				dfd.resolve(contacts);
			});
		}

		return dfd.promise();
	}
	
	//-------- /Mock dao ---------//
	
	
	//-------- InMemory dao ---------//
	
	function InMemoryContactDao(){
		this.constructor._super.constructor.call(this,"Contact");
	}
	brite.inherit(InMemoryContactDao,brite.InMemoryDaoHandler);
	
	InMemoryContactDao.prototype.getAllGroupsWithSelect = function(contactId){
		var dao = this;
		var dfd = $.Deferred();
		$.when(brite.dao("Group").list(), brite.dao("GroupContact").list({match : {contact_id : contactId}})).done(function(groupsList, contactGroups) {
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
	
	InMemoryContactDao.prototype.updateGroups = function(contactId,selectGroupIds){
		var dao = this;
		var dfd = $.Deferred();
		
		brite.dao("GroupContact").list({
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
					brite.dao("GroupContact").remove(obj.id).done(function() {
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
						brite.dao("GroupContact").create({
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
	
	InMemoryContactDao.prototype.getContactsByGroup = function(groupId){
		var dao = this;
		var dfd = $.Deferred();
		if (groupId && groupId != "") {
			brite.dao("GroupContact").list({
				match : {
					group_id : groupId
				}
			}).done(function(groupContacts) {
				var contacts = [];
				app.util.serialResolve(groupContacts, function(groupContact) {
					var innerDfd = $.Deferred();

					brite.dao("Contact").get(groupContact.contact_id).done(function(contact) {
						contacts.push(contact);
						innerDfd.resolve();
					});

					return innerDfd.promise();
				}).done(function(){
					dfd.resolve(contacts);
				});
			});
		} else {
			brite.dao("Contact").list().done(function(contacts) {
				dfd.resolve(contacts);
			});
		}

		return dfd.promise();
	}
	
	//-------- /InMemory dao ---------//
	
	
	app.InMemoryContactDao = InMemoryContactDao;
	app.MockContactDao = MockContactDao;
	app.RemoteContactDao = RemoteContactDao;
})(jQuery);