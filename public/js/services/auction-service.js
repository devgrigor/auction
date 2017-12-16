'use strict';

angular.module('auctionApp')
	.service('auction_service',['$http', 'helper_service', '$rootScope',
		function ($http, helper_service, $rootScope) {
			var service = {};

			/** Getting current auction with data */
			service.getCurrentAuction = function() {
				return $http.get(helper_service.api_url + '/auction');
			};

			/** Placing a bid to auction */
			service.makeBid = function(data) {
				return $http.put(helper_service.api_url + '/auction', data);
			};

			/** Starting an auction */
			service.startAuction = function(data) {
				return $http.post(helper_service.api_url + '/auction', data);
			};

			return service;
		}]);