'use strict';
/**
 * Created by Home on 07.10.2017.
 */
angular.module('auctionApp')
	.directive('auction',[ 'user_service', '$rootScope', 'socket_service', 'auction_service', 'item_service', 'helper_service',
		function (user_service, $rootScope, socket_service, auction_service, item_service, helper_service) {

		return {
			templateUrl: '/views/auction.html',
			restrict: 'E',
			scope: {
				component: '='
			},
			link: function link(scope, element, attrs) {
				scope.user = $rootScope.user;
				scope.data = [];
				scope.bid = {
					value: 0
				};

				scope.initAuction = function() {
					if(scope.data && scope.data.timer < 15) {
						user_service.getUser(scope.data.bidder_id).then((res) => {
							scope.winner_name = res.data.name;
						});
					}

					auction_service.getCurrentAuction().then((res) => {
						scope.data = res.data[0];
						
						if(scope.data && !scope.timer_binded) {
							item_service.getItem(scope.data.user_item_id).then((res) => {
								scope.item = res.data[0];
							});

							scope.timer_binded = true;
							socket_service.timerChanged(scope.initAuction);
						}
					});
				};

				scope.initAuction();
				
				scope.makeBid = function() {

					if(!scope.bid.value || scope.bid.value < scope.data.last_bid) {
						helper_service.showAlert({
							title: 'Error',
							message: 'please provide correct bid value'
						});

						return false;
					}

					auction_service.makeBid({
						id: scope.data.id,
						bid: scope.bid.value,
						timer: scope.data.timer > 10 ? scope.data.timer : scope.data.timer + 10
					}).then(() => {
						helper_service.showAlert({
							title: 'Success',
							message: 'Your bid is placed'
						});
					});
				}

			}
		}
	}]);
