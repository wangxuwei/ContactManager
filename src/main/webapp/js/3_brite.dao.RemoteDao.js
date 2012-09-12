var app = app || {};

// --------- Remote Dao --------- //
(function($) {

	function RemoteDao() {
	}

	// ------ DAO Interface Implementation ------ //
	RemoteDao.prototype.getIdName = function() {
		return "id";
	}


	RemoteDao.prototype.get = function(id) {
		var objectType = this._entityType;
		var data = {
			objType : objectType
		};

		var paramIdName = "obj_id";
		data[paramIdName] = id;

		return $.ajax({
			type : "GET",
			url : contextPath + "/daoGet.json",
			data : data,
			dataType : "json"
		}).pipe(function(val) {
			return val.result;
		});

	}

	/**
	 * DAO Interface: Return an array of values or a deferred object (depending of DAO impl) for  options
	 * @param {Object} opts
	 *           opts.pageIndex       {Number} Index of the page, starting at 0.
	 *           opts.pageSize        {Number} Size of the page
	 *           opts.match           {Object}
	 *           opts.orderBy         {String}
	 *           opts.orderType       {String}
	 *           opts withResultCount {Boolean} if this is true, resultSet with count will be returned
	 */
	// for now, just support opts.orderBy
	RemoteDao.prototype.list = function(opts) {
		var objectType = this._entityType;
		var data = {
			objType : objectType
		};

		if(opts) {
			data.opts = JSON.stringify(opts);
		}
		return $.ajax({
			type : "GET",
			url : contextPath + "/daoList.json",
			data : data,
			dataType : "json"
		}).pipe(function(val) {
			var resultSet = val.result;

			if(opts) {
				if(opts.withResultCount) {
					return val;
				}
				//				no client side sort, only server
				//				if (opts.orderBy) {
				//					resultSet = brite.util.array.sortBy(resultSet, opts.orderBy)
				//				}
			}
			return resultSet;
		});

	}

	// to reuse update
	RemoteDao.prototype.create = function(data) {
		var objectType = this._entityType;
		var reqData = {
			objType : objectType,
			objJson : JSON.stringify(data),
			create : true
		};
		var dfd = $.ajax({
			type : "POST",
			url : "daoSave.do",
			data : reqData,
			dataType : "json"
		}).pipe(function(val) {
			// if(val.result.type == "appValidationError") {
				// return $.Deferred().reject(val.result.failedProps).promise();
			// }
 			// return val.result;
 			return val;
		});

		return dfd.promise();
	}


	RemoteDao.prototype.update = function(data) {
		var objectType = this._entityType;
		var id = data.id;
		var reqData = {
			objType : objectType,
			obj_id : id,
			objJson : JSON.stringify(data),
			create : false
		};

		return $.ajax({
			type : "POST",
			url : "daoSave.do",
			data : reqData,
			dataType : "json"
		}).pipe(function(val) {
			// if(val.result.type == "appValidationError") {
				// return $.Deferred().reject(val.result.failedProps).promise();
			// }
			// return val.result;
			return val;
		});

	}


	RemoteDao.prototype.remove = function(id) {
		var objectType = this._entityType;
		var reqData = {
			objType : objectType
		}
		reqData.obj_id = id;

		var dfd = $.ajax({
			type : "POST",
			url : "daoDelete.do",
			data : reqData,
			dataType : "json"
		}).pipe(function(val) {
			return id;
		});

		return dfd.promise();
	}


	brite.dao.RemoteDao = RemoteDao;
	// ------ /DAO Interface Implementation ------ //

})(jQuery);
// --------- /Remote Dao --------- //


// --------- CustomRemoteDao --------- //
// This is the new RemoteDao that supports FormData can custom WebActionHandler names for create and update. 
// 
// TODO: eventually, the RemoteDao should handle this, but we do the CustomRemoteDao right now
//       to move the entity daos one at a time.
(function($){
	 
	//  Constructor that allows to override the default create, update, remove
	function CustomRemoteDao(opts){
		// Note: remember, do not do initialization in the constructor, but call a init if needed.
		// See: http://www.kevlindev.com/tutorials/javascript/inheritance/inheritance10.htm
		if (arguments.length > 0){
			this.init(opts);
		}
	}
	brite.inherit(CustomRemoteDao,brite.dao.RemoteDao);
	
	CustomRemoteDao.prototype.init = function(opts){
		this.opts = $.extend({},defaultOpts,opts);
	}
	
	CustomRemoteDao.prototype.create = function (formData){
		var dfd = $.Deferred();
		
		var postDfd = app.post(this.opts.create,formData);
	   
	    postDfd.done(function(result) {
	    	result = result.result;
	    	if(result.type == "PokerValidationError") {
	    		dfd.reject(result.failedProps);
	    	} else { 
	    		dfd.resolve(result);
	    	}
	    });
		
	// I don't think you should need this as the failure should be handled by the component
		postDfd.fail(function(ex){
			console.log("ERROR create!!!! " + ex);
			dfd.reject(ex);
		});
		
		return dfd.promise();
	}; 

	CustomRemoteDao.prototype.update = function (id,formData){
		var dfd = $.Deferred();
		formData.append("id",id);
		
		var postDfd = app.post(this.opts.update,formData);
	   
	    postDfd.done(function(result){
	    	result = result.result;
	    	if(result.type == "PokerValidationError") {
	    		dfd.reject(result.failedProps);
	    	} else { 
	    		dfd.resolve(result);
	    	}
	    });
		
		postDfd.fail(function(ex){
			console.log("ERROR update!!!! " + ex);
			dfd.reject(ex);
		});		
		
		return dfd.promise();
	};
	
	var defaultOpts = {
		create: "daoSave.do",
		update: "daoSave.do",
		remove: "daoDelete.do" 
	} 	
	
	brite.dao.CustomRemoteDao = CustomRemoteDao;
})(jQuery);
// --------- /CustomRemoteDao --------- //


