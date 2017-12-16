'use strict';
/**
 * Created by Home on 07.10.2017.
 */
angular.module('auctionApp')
	.directive('inventory',[ 'item_service', '$rootScope', 'helper_service', 'auction_service',
		function (item_service, $rootScope, helper_service, auction_service) {

		return {
			templateUrl: '/views/inventory.html',
			restrict: 'E',
			scope: {
				component: '='
			},
			link: function link(scope, element, attrs) {
				item_service.getAll().then((res) => {
					console.log(res.data);
					scope.items = res.data;
				});

				scope.startAuction = function(item) {
					console.log(item);
					helper_service.showStartAuction((data) => {
						data.user_item_id = item.id;
						
						auction_service.startAuction(data).then((res) => {
							var data = res.data;

							if(data.success) {
								helper_service.showAlert({
									title: 'Success',
									message: 'Auction started'
								});
							} else {
								helper_service.showAlert({
									title: 'Error',
									message: data.error ? data.error : 'Unknown error, try later'
								});
							}
						});
					}, {
						max_quantity: item.quantity
					});
				}
			}
		}
	}]);