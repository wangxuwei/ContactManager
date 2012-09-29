var app = app || {};

(function($){
	//Remote URL
	app.remoteServiceURL = "http://localhost:8080/contact";
	
	// if mode is 'SQLite' use SQLiteDao,
	// if mode is 'Remote' use remote dao
	// else use memory dao
	app.dataMode = 'Remote';
	
	// if support touchstart event use touchstart, else use mousedown
	app.pressEvent = brite.ua.hasTouch() ? "touchstart" : "mousedown";
})(jQuery);

