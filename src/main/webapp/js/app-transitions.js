var app = app || {};
(function($){
	app.transitions = {};
	
	//--------- transitions --------//
	app.transitions.slide = function($new,$current,$parent,direction,startFrom){
		var newExist = false;
		if($new && $new.size() > 0){
			newExist = true;
			$parent.append($new);
		}
		var curExist = false;
		if($current && $current.size() > 0){
			curExist = true;
		}
		
		if(typeof direction == "undefined"){
			direction = "left";
		}
		
		var vertical = false;
		if(direction == "up" || direction == "down"){
			vertical = true;
		}
		
		var opposite = false;
		if(direction == "right" || direction == "down"){
			opposite = true;
		}
		
		var $base;
		if(curExist){
			$base = $current;
		}else{
			$base = $new;
		}
		var width = $base.width();
		if(vertical){
			width = $base.height();
		}
		var start = 0;
		if(typeof startFrom != 'undefined'){
			start = opposite ? -1 * startFrom : startFrom;
		}else{
			start = opposite ? -1 * width : width;
		}
		
		if(newExist){
			if(vertical){
				$new.bTransition({transform:"translate(0px, " + (-1 * start) + "px)"});
			}else{
				$new.bTransition({transform:"translate(" + (-1 * start) + "px,0px)"});
			}
		}
		if(curExist){
			$current.bTransition({transform:"translate(0px, 0px)"});
		}
		
		setTimeout(function(){
			if(curExist){
				$current.addClass("transitioning");
				if(vertical){
					$current.bTransition({transform:"translate(0px, " + start + "px)"});
				}else{
					$current.bTransition({transform:"translate(" + start + "px,0px)"});
				}
				$current.one("btransitionend", function() {
					$current.bRemove();
				}); 
			}
			
			if(newExist){
				$new.addClass("transitioning");
				$new.bTransition({transform:"translate(0px,0px)"});
				$new.one("btransitionend", function() {
					$new.data("direction",direction);
					$new.removeClass("transitioning");
					$new.bTransition({transform:""});
				}); 
			}
		},5);

		
	}
	//--------- /transitions --------//
	
	app.transitions.getReverseDirection = function(direction){
		if(direction == "left"){
			direction = "right";
		}else if(direction == "right"){
			direction = "left";
		}else if(direction == "up"){
			direction = "down";
		}else if(direction == "down"){
			direction = "up";
		}
		return direction;
	}
	
	brite.registerTransition("slideLeft",function(component,data,config){
		var $parent = $(config.parent);
		var $current = null;
		var $new = component.$el;
		if(config.emptyParent){
			$current = $parent.children()
		}
		app.transitions.slide($new,$current,$parent,"left");
	});
	
	brite.registerTransition("slideRight",function(component,data,config){
		var $parent = $(config.parent);
		var $current = null;
		var $new = component.$el;
		if(config.emptyParent){
			$current = $parent.children()
		}
		app.transitions.slide($new,$current,$parent,"right");
	});
	
	
	brite.registerTransition("dialogSlide",function(component,data,config){
		var $parent = $(config.parent);
		var $current = null;
		var $new = component.$el;
		if(config.emptyParent){
			$current = $parent.children()
		}
		app.transitions.slide($new,$current,$parent,"down",$parent.height());
	});
	
})(jQuery);

