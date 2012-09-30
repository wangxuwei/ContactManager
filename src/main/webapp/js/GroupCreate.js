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
				brite.dao("Group").get(data.id).done(function(group) {
					dfd.resolve(group);
				});
			}else{
				dfd.resolve({});
			}
			dfd.done(function(group){
				c.groupId = group.id;
				renderer.render("GroupCreate",group).done(function(html){
					var $e = $(html);
					c.$screen = $("<div class='notTransparentScreen'></div>").appendTo("#bodyPage");
					createDfd.resolve($e);
				});
			});

			return createDfd.promise();
		}

		GroupCreate.prototype.postDisplay = function(data, config) {
			var c = this;
			var $e = c.$el;
			
			
			$e.on("btap",".btnClose",function(){
				c.close();
			});
			
			$e.on("btap",".btnCreate",function(){
				saveGroup.call(c);
			});
		}

		// --------- /Component Interface Implementation ---------- //

		// --------- Component Public API --------- //
		GroupCreate.prototype.close = function() {
			var c = this;
			var $e = c.$el;
			
			$e.bRemove();
			c.$screen.remove();
		}
		
		// --------- /Component Public API --------- //

		// --------- Component Private Methods --------- //
		function saveGroup(){
			var c = this;
			var $e = c.$el;
			
			var name = $e.find("input[name='groupName']").val();
			var data = {
				name : name
			};
			
			// if exist group id, do update, else do create
			if(c.groupId){
				data.id = c.groupId;
				brite.dao("Group").update(data).done(function(){
					c.close();
				});
			}else{
				brite.dao("Group").create(data).done(function(){
					c.close();
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
