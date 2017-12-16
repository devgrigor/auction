'use strict';

angular.module('auctionApp')
	.service('helper_service',['$http', '$mdDialog',
		function ($http, $mdDialog) {
			var service = {};

			service.api_url = 'http://localhost:8080';

			service.showAlert = function(options){
				$mdDialog.show(
			      $mdDialog.alert()
			        .parent(angular.element(document.querySelector('#popupContainer')))
			        .clickOutsideToClose(true)
			        .title(options.title)
			        .textContent(options.message)
			        .ariaLabel('Alert Dialog')
			        .ok('Got it!')
			    );
			};

			service.showStartAuction = function(callback, options = {
					max_quantity: 10
			}) {
				service.dialogCallback = callback;

				$mdDialog.show({
					clickOutsideToClose: true,
					preserveScope: true,
					template: `<md-dialog>
					  <md-dialog-content class="padding">
					    <div class="padding">
							<md-input-container class="md-block" flex-gt-xs>
								<label>Quantity</label>
								<input ng-model="quantity" type="number" min="1" max="` + options.max_quantity +`" >
							</md-input-container>
							
							<md-input-container class="md-block" flex-gt-xs >
								<label>Min Bid</label>
								<input ng-model="min_bid" type="number"  min="1" max="1000">
							</md-input-container>
		
						</div>
						
						<div>
							<md-button class=" md-primary" ng-click="submitDialog()">Start</md-button>
							
							<md-button class=" md-secondary" ng-click="closeDialog()">Cancel</md-button>
						</div>
					  </md-dialog-content>
					</md-dialog>`,

					controller: function DialogController($scope, $mdDialog) {
						$scope.closeDialog = function() {
							$mdDialog.hide();
						};

						$scope.submitDialog = function() {
							if(!$scope.quantity || !$scope.min_bid) {
								return false;
							}

							service.dialogCallback({
								quantity: $scope.quantity,
								min_bid: $scope.min_bid
							});

							$mdDialog.hide();
						}
					}
				});
			};

			service.user_token = window.localStorage.getItem('user_token');

			return service;
		}
	]);