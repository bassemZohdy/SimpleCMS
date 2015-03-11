'use strict';
/**
 * Created by bzohdy on 9/3/14.
 */

angular.module('webAppApp')
    .directive('contentOutlines', function() {
    return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'views/content/outlines.html'
    };
    })
    .directive('contentNew', function() {
        return {
            restrict: 'AE',
            replace: true,
            templateUrl: 'views/content/new.html'
        };
    })
    .directive('contentView', function() {
        return {
            restrict: 'AE',
            replace: true,
            templateUrl: 'views/content/view.html'
        };
    })
    .directive('contentEdit', function() {
        return {
            restrict: 'AE',
            replace: true,
            templateUrl: 'views/content/edit.html'
        };
    });
