;(function() {

	/**
	 * View: GroupCreate
	 *
	 * Responsibilities:
	 *   - Display all the GroupCreate Content of the GroupCreate screen. (today below the TobBar)
	 *
	 */
		brite.registerView("GroupCreate", {
			loadTmpl : true,
			transition:"dialogSlide",
			parent:"#bodyPage"
		}, {
			create : function(data, config) {
				var view = this;
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
					view.groupId = group.id;
					renderer.render("GroupCreate",group).done(function(html){
						var $e = $(html);
						view.$screen = $("<div class='notTransparentScreen'></div>").appendTo("#bodyPage");
						createDfd.resolve($e);
					});
				});
	
				return createDfd.promise();
			},
			
			events:{
				"btap;.btnClose":function(){
					var view = this;
					console.log(1);
					view.close();
				},
				
				"btap;.btnCreate":function(){
					var view = this;
					saveGroup.call(view);
				},
			},
			
			close : function() {
				var view = this;
				var $e = view.$el;
				
				$e.bRemove();
				view.$screen.remove();
			}


		});


		// --------- View Private Methods --------- //
		function saveGroup(){
			var view = this;
			var $e = view.$el;
			
			var name = $e.find("input[name='groupName']").val();
			var data = {
				name : name
			};
			
			// if exist group id, do update, else do create
			if(view.groupId){
				data.id = view.groupId;
				brite.dao("Group").update(data).done(function(){
					view.close();
				});
			}else{
				brite.dao("Group").create(data).done(function(){
					view.close();
				});
			}
			
		}
		// --------- /View Private Methods --------- //


})();
