'use strict';

var resourceServices = angular.module('resourceServices', ['ngResource']);

resourceServices.factory('Content', ['$resource',
    function($resource){
        return $resource('http://localhost:9000/api/content/:id', { id: '@_id' }, {
            update: {method:'PUT', isArray: false},
            count: {method:'GET',isArray: false,params:{count:true}}
        });
    }]);
resourceServices.factory('Tag', ['$resource',
    function($resource){
        return $resource('http://localhost:9000/api/tag/:id', { id: '@_id' }, {
        });
    }]);