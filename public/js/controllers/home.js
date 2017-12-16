'use strict';

angular.module('auctionApp')
	.controller('HomeCtrl',[ '$scope', '$rootScope', 'user_service', 'helper_service', 'socket_service',
	function ($scope, $rootScope, user_service, helper_service, socket_service) {
		$scope.user = $rootScope.user;

		/** this will make sure that user is logged out once he is logged in other place */
		socket_service.userLogged((data) => {

			if(data.id == $rootScope.user.id && data.token != $rootScope.user.token) {
				window.location.reload();
			}
		});

		$scope.currentNavItem = 'stats';

		if(helper_service.user_token) {
			$rootScope.user.logged = true;

			user_service.checkAuth();
		}

		$scope.goTo = function(page) {
			$scope.currentNavItem = page;
		};

		$scope.submitUser = function() {
			if(!$scope.user.name) {
				helper_service.showAlert({
					title: 'No name',
					message: 'Please fill the name'
				});

				return ;
			}

			user_service.login({
				name: $scope.user.name
			}).then((res) => {
				$rootScope.user = res.data;
				$rootScope.user.logged = true;
				$scope.user = $rootScope.user;
				window.localStorage.setItem('user_token', $scope.user.token);
				console.log(res.data);
				socket_service.sendLogin($scope.user.id,$scope.user.token);
			}, (err) => {
				console.log(err);
			});
		}
	}]);