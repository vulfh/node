var constraints = function ($q,com,$http) {
    var _com = com;
    var _q = $q;
    var _$http = $http;
    var _self = this;
    var _constraints = {};
    var _initialized = false;
   
    function loadConstraints() {

        _$http({ method: 'GET', url: BASE_URL + 'common?type=get_constraints&r=' + Math.random() })
        .success(function (data, status, headers, config) {
            _constraints = data;
            _initialized = true;
        })
        .error(function (data, status, headers, config) {
            dialogService.alert("error loading constraints:" + data);
            _
        });
    }
    loadConstraints();
    this.getConstraintsForPackage = function (packageTypeId) {
        var deferred = $q.defer();
        resolveConstraints(deferred, packageTypeId);
        return deferred.promise;
    }
    this.getConstraintForOwnerById = function (id, owner) {
        var cons = [];
        for (var pac in _constraints) {
            if (utils.isNull(_constraints[pac][owner]) !== true) {
                _constraints[pac][owner].every(function (value) {
                    if (value.id === id) {
                        cons.push(value);
                    }
                    return true;
                });
            }
        }
        return cons;
    }
    this.buildConstraintsObjectFromIds = function (ids) {
        var cons = { courier: [], sender: [], receiver: [] };
        ids.every(function (value, id) {
            var con = undefined;
            for (p in _constraints) {
                con = getConstraintByPackageAndOwner(p, 'courier', value);
                if (utils.isNull(con) === true) {
                    con = getConstraintByPackageAndOwner(p, 'sender', value);
                    if (utils.isNull(con) === true) {
                        con = getConstraintByPackageAndOwner(p, 'receiver', value);
                        cons.receiver.push(con);
                    }
                    else {
                        cons.sender.push(con);
                    }
                }
                else {
                    cons.courier.push(con);
                }
            }
            return true;
        });
        return cons;
    }
    function getConstraintByPackageAndOwner(pac, owner, id) {
        var result = null;
        if (_constraints[pac][owner] ) {
            _constraints[pac][owner].every(function (value, idx) {
                if (value.id === id) {
                    result = value;
                    return false;
                }
                return true;
            });
            return result;
        }

    }
    function resolveConstraints(deferred,packageTypeId) {
        
            if (_initialized === true) {
                if (utils.isNull(_constraints[packageTypeId]) === false) {
                    deferred.resolve(_constraints[packageTypeId]);
                }
                else {
                    deferred.reject();
                }
            }
            else {
                setTimeout(function () {
                    resolveConstraints(deferred, packageTypeId)
                }, 300);
            }
    }


}
app.service('constraintsSvc', ['$q','com','$http', function ($q,com,$http) {
    return new constraints($q, com,$http);
}]);