;(function() {

	/**
	 * Component: GroupCreate
	 *
	 * Responsibilities:
	 *   - Display all the GroupCreate Content of the GroupCreate screen. (today below the TobBar)
	 *
	 * Constructor Data:
	 *  - none
	 *
	 * Component API:
	 *  format: [method_name]([args]) : [concise description]
	 *  - none
	 *
	 * Component Events:
	 *  format: [ComponentName_[DO]_event_name]([argument | argumentsMap]): [concise description]
	 * - none
	 *
	 */
	(function($) {

		// --------- Component Interface Implementation ---------- //
		function GroupCreate() {
		};

		GroupCreate.prototype.create = function(data, config) {
			var c = this;
			var dfd = $.Deferred();
			var createDfd = $.Deferred();
			data = data || {};
			if(data.id){
				brite.dao.get("Group", data.id).done(function(group) {
					dfd.resolve(group);
				});
			}else{
				dfd.resolve({});
			}
			dfd.done(function(group){
				c.groupId = group.id;
				var html = $("#tmpl-GroupCreate").render(group);
				var $e = $(html);
				c.$screen = $("<div class='notTransparentScreen'></div>").appendTo("#bodyPage");
				createDfd.resolve($e);
			});

			return createDfd.promise();
		}

		GroupCreate.prototype.postDisplay = function(data, config) {
			var c = this;
			var $e = c.$element;
			
			
			$e.on("btap",".btnClose",function(){
				c.close();
			});
			
			$e.on("btap",".btnCreate",function(){
				saveGroup.call(c);
			});
		}

		// --------- /Component Interface Implementation ---------- //

		// --------- Component Public API --------- //
		GroupCreate.prototype.close = function(update) {
			var c = this;
			var $e = c.$element;
			
			$e.bRemove();
			c.$screen.remove();
			if(update && c._updateCallback && $.isFunction(c._updateCallback)){
				c._updateCallback();
			}
		}
		
		GroupCreate.prototype.onUpdate = function(updateCallback) {
			var c = this;
			c._updateCallback = updateCallback;
		}
		// --------- /Component Public API --------- //

		// --------- Component Private Methods --------- //
		function saveGroup(){
			var c = this;
			var $e = c.$element;
			
			var name = $e.find("input[name='groupName']").val();
			var data = {
				name : name,
			};
			
			if(c.groupId){
				brite.dao.update("Group",c.groupId,data).done(function(){
					c.close(true);
				});
			}else{
				brite.dao.create("Group",data).done(function(){
					c.close(true);
				});
			}
			
		}
		// --------- /Component Private Methods --------- //

		// --------- Component Registration --------- //
		brite.registerView("GroupCreate", {
			loadTmpl : true,
			transition:"dialogSlide",
			parent:"#bodyPage"
		}, function() {
			return new GroupCreate();
		});
		// --------- Component Registration --------- //

	})(jQuery);

})();
