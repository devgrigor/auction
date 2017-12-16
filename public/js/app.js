'use strict';

/**
 * @ngdoc overview
 * @name auctionApp
 * @description
 * # auctionApp
 *
 * Main module of the application.
 */
var app = angular.module('auctionApp', [
		'ngAnimate',
		'ngCookies',
		'ngResource',
		'ngRoute',
		'ngSanitize',
		'ngMaterial'
	]);


app.factory('httpRequestInterceptor', function () {
  return {
    request: function (config) {

      config.headers['Authorization'] = window.localStorage.getItem('user_token');

      return config;
    }
  };
});

app.config([
	'$routeProvider', '$locationProvider', '$httpProvider',
	function ($routeProvider, $locationProvider, $httpProvider) {
		$httpProvider.interceptors.push('httpRequestInterceptor');

		$routeProvider
			.when('/', {
				templateUrl: 'views/home.html',
				controller: 'HomeCtrl',
				controllerAs: 'home'
			})
			.otherwise({
				redirectTo: '/'
			});

		$locationProvider.html5Mode(true);
	}
]);


app.run(['$rootScope',
	function($rootScope) {
		$rootScope.user = {};
	}

]);
