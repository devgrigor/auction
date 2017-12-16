'use strict';

angular.module('auctionApp')
	.service('user_service',['$http', 'helper_service', '$rootScope',
		function ($http, helper_service, $rootScope) {
			var service = {};

			service.login = function(data) {
				return $http.post(helper_service.api_url + '/users/login', data);
			};

			service.logout = function() {
				$http.get('/users/logout').then(() => {
					window.localStorage.removeItem('user_token');
					window.location.reload();
				});
			};

			service.getUser = function(id) {
				return $http.get('/users/'+id);
			};

			service.checkAuth = function() {
				$http.get(helper_service.api_url + '/check-auth').then((res) => {
					$rootScope.user = res.data;
				}, (err) => {
					console.log('auth failed');
					window.localStorage.removeItem('user_token');
					window.location.reload();
				});
			};

			return service;
		}]);