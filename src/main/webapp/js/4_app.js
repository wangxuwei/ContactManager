var app = app || {};

(function($){
	
	// if mock true use SQLiteDao,else use remote dao
	app.mock = false;

	//just keep it for now
	//check the browsers type
	var ua = navigator.userAgent.toLowerCase();
	
	var isChrome = ua.match(/chrome\/([\d.]+)/);
	var isSafari = ua.match(/version\/([\d.]+)/);
	var isFirefox = ua.match(/firefox\/([\d.]+)/);
	var isIE = ua.match(/msie ([\d.]+)/);
	
	app.cssPrefix = function(){
		if(isChrome){
			return "-webkit-";
		}else if(isSafari){
			return "-webkit-";
		}else if(isFirefox){
			return "-moz-";
		}else if(isIE){
			return "-ms-";
		}
	}
	
	app.getTransitionEnd = function(){
		if(isChrome){
			return "webkitTransitionEnd";
		}else if(isSafari){
			return "webkitTransitionEnd";
		}else if(isFirefox){
			return "transitionend";
		}
	}
})();

