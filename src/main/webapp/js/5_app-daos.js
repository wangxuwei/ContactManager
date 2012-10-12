var app = app || {};


// --------- Entity Dao Registration --------- //
(function($){
	
	if(app.dataMode == 'SQLite'){
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
		
		var tables = [
			{
				name:"t_group",
				fields:[
					{column:'name',dtype:'TEXT'},
					{column:'createdBy_id',dtype:'INTEGER'},
					{column:'createdDate',dtype:'TEXT'},
					{column:'updatedBy_id',dtype:'INTEGER'},
					{column:'updatedDate',dtype:'TEXT'}
				]
			},
			{
				name:"t_contact",
				fields:[
					{column:'name',dtype:'TEXT'},
					{column:'address',dtype:'TEXT'},
					{column:'email',dtype:'TEXT'},
					{column:'createdBy_id',dtype:'INTEGER'},
					{column:'createdDate',dtype:'TEXT'},
					{column:'updatedBy_id',dtype:'INTEGER'},
					{column:'updatedDate',dtype:'TEXT'}
				]
			},
			{
				name:"t_group_contact",
				fields:[
					{column:'contact_id',dtype:'INTEGER'},
					{column:'group_id',dtype:'INTEGER'}
				]
			}
		];
		
		//create tables
		app.util.serialResolve(tables,function(table){
			var dfd = $.Deferred();
			var tableName = table.name;
			var tableDefine = table.fields;
			var identity = table.identity || 'id';
			app.SQLiteDB.transaction(function(transaction){
				var createSql = "CREATE TABLE IF NOT EXISTS " + tableName + " ("+ identity + " INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT";
				var dlen = tableDefine.length;
				for(var i = 0; i < dlen; i++){
					var field = tableDefine[i];
					createSql += "," + field.column + " " + field.dtype;
				}
				createSql += ");";
				transaction.executeSql(createSql,null,function(a,b){
					dfd.resolve();
				},function(a,b){
					console.log(b);
				});
			});
			
			return dfd.promise();
		});
		
		
		//register SQLiteDao
		brite.registerDao(new brite.dao.SQLiteDao("Group","t_group"));
		brite.registerDao(new brite.dao.SQLiteDao("GroupContact","t_group_contact"));
		brite.registerDao(new app.MockContactDao());
	}else if(app.dataMode == 'Remote'){
		//register RemoteDao
		brite.registerDao(new brite.dao.RemoteDao("Group"));
		brite.registerDao(new brite.dao.RemoteDao("GroupContact"));
		brite.registerDao(new app.RemoteContactDao());
	}else{
		//register InMemoryDao
		brite.registerDao(new brite.InMemoryDaoHandler("Group"));
		brite.registerDao(new brite.InMemoryDaoHandler("GroupContact"));
		brite.registerDao(new app.InMemoryContactDao());
	}
	
	// add dao listeners
	brite.dao.onDao(function(event) {
		console.log("dao.onDao call : " + event.daoEvent.entityType + " - " + event.daoEvent.action);
	}, "namespace1"); 


})(jQuery);

