var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../../app');
var expect = chai.expect;

chai.use(chaiHttp);

describe('controllers : users', () => {
	var user = {};
	var items = [];
	var second_user = {};

	describe('userFlow', () => {
		// add code here
		it('responds with status 200 and logs user', function(done) {

			chai.request(app)
				.post('/users/login')
				.send({ name: 'Test user 2' })
				.end(function (err, res) {
					expect(err).to.be.null;
					expect(res).to.have.status(200);

					user = JSON.parse(res.text);

					done();
				});
		});

		it('responds with status 200 and get user inventory', function(done) {
			chai.request(app)
				.get('/items')
				.set({'Authorization': user.token})
				.end(function (err, res) {
					expect(err).to.be.null;
					expect(res).to.have.status(200);
					items = JSON.parse(res.text);

					done();
				});
		});

		it('responds with status 200 and starts an auction for first item', function(done) {
			chai.request(app)
				.post('/auction')
				.set({'Authorization': user.token})
				.send({ user_item_id: items[0].id, quantity: 1, min_bid: 1 })
				.end(function (err, res) {
					expect(err).to.be.null;
					expect(res).to.have.status(200);

					user = JSON.parse(res.text);

					done();
				});
		});

		it('responds with status 200 and logs another user', function(done) {

			chai.request(app)
				.post('/users/login')
				.send({ name: 'Test user 3' })
				.end(function (err, res) {
					expect(err).to.be.null;
					expect(res).to.have.status(200);

					second_user = JSON.parse(res.text);

					done();
				});
		});

		it('responds with status 200 and get current auction data after two seconds', function(done) {
			setTimeout(() => {
				chai.request(app)
					.get('/auction')
					.set({'Authorization': second_user.token})
					.end(function (err, res) {
						expect(err).to.be.null;
						expect(res).to.have.status(200);
						current_auction = JSON.parse(res.text)[0];

						done();
					});
			}, 2000);

		});

		it('responds with status 200 and place a bid on auction', function(done) {
			chai.request(app)
				.put('/auction')
				.send({
					bid: 2,
					timer: current_auction.timer
				})
				.set({'Authorization': second_user.token})
				.end(function (err, res) {
					expect(err).to.be.null;
					expect(res).to.have.status(200);

					done();
				});
		});


	});

});
