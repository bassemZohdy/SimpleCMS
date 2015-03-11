'use strict';

var resourceServices = angular.module('resourceServices', ['ngResource']);

resourceServices.factory('Content', ['$resource',
    function($resource){
        return $resource('/api/content/:id', { id: '@_id' }, {
            update: {method:'PUT', isArray: false},
            count: {method:'GET',isArray: false,params:{count:true}}
        });
    }]);
resourceServices.factory('Tag', ['$resource',
    function($resource){
        return $resource('/api/tag/:id', { id: '@_id' }, {
        });
    }]);
