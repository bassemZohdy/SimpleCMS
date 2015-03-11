'use strict';

/**
 * @ngdoc overview
 * @name webAppApp
 * @description
 * # webAppApp
 *
 * Main module of the application.
 */
angular
  .module('webAppApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'resourceServices',
    'contenteditable',
    'textAngular',
    'ui.bootstrap',
    'ui.select2'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
        .when('/contnet/view/:id', {
            templateUrl: 'views/content/viewContent.html',
            controller: 'ContnetViewCtrl'
        })
        .when('/contnet/edit/:id?', {
            templateUrl: 'views/content/editContent.html',
            controller: 'ContnetEditCtrl'
        })
      .otherwise({
        redirectTo: '/'
      });
  });
