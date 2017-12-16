'use strict';
/**
 * Created by Home on 07.10.2017.
 */
angular.module('auctionApp')
	.directive('playerStats',[ 'user_service', '$rootScope', function (user_service, $rootScope) {

		return {
			templateUrl: '/views/stats.html',
			restrict: 'E',
			scope: {
				component: '='
			},
			link: function link(scope, element, attrs) {
				scope.user = $rootScope.user;

				user_service.checkAuth();

				scope.logout = function() {
					user_service.logout();
				}

			}
		}
	}]);