var app = app || {};

(function($){
	
	// if mode is 'SQLite' use SQLiteDao,
	// if mode is 'remote' use remote dao
	// else use memory dao
	app.dataMode = 'InMemory';
	
})();

