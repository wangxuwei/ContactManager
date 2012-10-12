
// --------- Remote Dao --------- //
(function($) {

	function RemoteDao(entityType) {
        this._entityType = entityType;
	}



	// ------ DAO Interface Implementation ------ //
	RemoteDao.prototype.getIdName = function() {
		return "id";
	};

    // --------- DAO Info Methods --------- //
    RemoteDao.prototype.entityType = function () {
        return this._entityType;
    };
    // --------- DAO Info Methods --------- //


	RemoteDao.prototype.get = function(id) {
		var objectType = this._entityType;
		var data = {
			objType : objectType
		};

		var paramIdName = "obj_id";
		data[paramIdName] = id;

		return $.ajax({
			type : "GET",
			url : app.remoteServiceURL + "/daoGet.json",
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
			url : app.remoteServiceURL + "/daoList.json",
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
			url : app.remoteServiceURL + "/daoSave.do",
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
			url :app.remoteServiceURL + "/daoSave.do",
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
			url : app.remoteServiceURL + "/daoDelete.do",
			data : reqData,
			dataType : "json"
		}).pipe(function(val) {
			return id;
		});

		return dfd.promise();
	}

	RemoteDao.prototype.removeMany = function(ids) {
		var reqData = {
			objType : this._entityType
		}
		reqData.obj_ids = JSON.stringify({obj_ids: ids});

		var dfd = $.ajax({
			type : "POST",
			url : app.remoteServiceURL + "/daoDeleteMany.do",
			data : reqData,
			dataType : "json"
		}).pipe(function(val) {
			return ids;
		});

		return dfd.promise();
	};


	brite.dao.RemoteDao = RemoteDao;
	// ------ /DAO Interface Implementation ------ //

})(jQuery);
// --------- /Remote Dao --------- //