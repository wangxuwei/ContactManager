var app = app || {};

(function($){
	
	// if mode is 'SQLite' use SQLiteDao,
	// if mode is 'Remote' use remote dao
	// else use memory dao
	app.dataMode = 'Remote';
	
})(jQuery);

