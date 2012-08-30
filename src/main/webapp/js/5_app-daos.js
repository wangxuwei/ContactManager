var app = app || {};


// --------- Entity Dao Registration --------- //
(function($){
	
	if(app.mock){
		var databaseOptions = {
				fileName: "ContactDB",
				version: "1.0",
				displayName: "ContactDB",
				maxSize: 1024
		};
		
		app.SQLiteDB = openDatabase(
				databaseOptions.fileName,
				databaseOptions.version,
				databaseOptions.displayName,
				databaseOptions.maxSize
		);		
		
		var groupTable = [
			{column:'name',dtype:'TEXT'},
			{column:'createdBy_id',dtype:'INTEGER'},
			{column:'createdDate',dtype:'TEXT'},
			{column:'updatedBy_id',dtype:'INTEGER'},
			{column:'updatedDate',dtype:'TEXT'}
		];
		
		var contactTable = [
			{column:'name',dtype:'TEXT'},
			{column:'address',dtype:'TEXT'},
			{column:'email',dtype:'TEXT'},
			{column:'createdBy_id',dtype:'INTEGER'},
			{column:'createdDate',dtype:'TEXT'},
			{column:'updatedBy_id',dtype:'INTEGER'},
			{column:'updatedDate',dtype:'TEXT'}
		];
		
		var groupContactTable = [
			{column:'contact_id',dtype:'INTEGER'},
			{column:'group_id',dtype:'INTEGER'}
		];
		
		//register SQLiteDao
		brite.registerDao("Group",new brite.dao.SQLiteDao("t_group","id",groupTable));
		brite.registerDao("Contact",new brite.dao.SQLiteDao("t_contact","id",contactTable));
		brite.registerDao("GroupContact",new brite.dao.SQLiteDao("t_group_contact","id",groupContactTable));
	}else{
		//register RemoteDao
		brite.registerDao("Group",new brite.dao.RemoteDao("Group"));
		brite.registerDao("Contact",new brite.dao.RemoteDao("Contact"));
		brite.registerDao("GroupContact",new brite.dao.RemoteDao("GroupContact"));
	}

})();

