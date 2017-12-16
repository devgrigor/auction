'use strict';

/**
 * @ngdoc service
 * @name auctionApp.sockets.service
 * @description
 * # sockets.service
 * Service in the auctionApp.
 */
angular.module('auctionApp')
	.service('socket_service', [ function () {
		var service = {
			url: 'http://localhost:5002'
		};

		if(!service.socket) {
			service.socket = io(service.url);
		}

		service.sendLogin = function(id , token) {
			service.socket.emit('user-logged', {
				id:id,
				token: token
			});
		};

		service.userLogged = function(callback) {

			service.socket = service.socket ? service.socket : io(service.url);

			service.socket.on('logged', callback);
		};

		service.timerChanged = function(callback) {
			service.socket = service.socket ? service.socket : io(service.url);
			service.socket.off('timer');
			service.socket.on('timer', callback);
		};

		return service;
	}]);
