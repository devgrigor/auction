'use strict';

angular.module('auctionApp')
	.service('item_service',['$http', 'helper_service', '$rootScope',
		function ($http, helper_service, $rootScope) {
			var service = {};

			/** Getting all items in users inventory */
			service.getAll = function() {
				return $http.get(helper_service.api_url + '/items');
			};

			/** Getting single item */
			service.getItem = function(id) {
				return $http.get(helper_service.api_url + '/items/'+id);
			};

			return service;
		}]);