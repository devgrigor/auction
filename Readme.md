Installing the app: 

Requirements:
	NodeJS : 6.10 or higher
	MySQL : 4.7 or higher

Steps to run app
Note:I've sent project with node_modules folder, node_modules can be updated by running "npm update" command
	0. Unzip code
	1. Open config/default.json
	2. Replace db_user and db_pass with your username and password for mysql user
	3. Run command from main directory - node install.js (this will create database and all tables)
	4. Run command from main directory - npm start
	5. Open "http://localhost:8080"  in your browser

Steps to run test
Note: Test runs in same enviorment as the intire app so for running from scratch reinstall app, but tests won't fail if app was already in use
	1. If not done , then run first 3 steps of running app
	2. Run command from main directory - npm test test/unit/user.test.js (this should run 6 tests)

Project Structure
	routes - contains all routes in app
	models - contains all work with ORM in app
	migrations - contains all database migrations
	public  - contains angular app
		js - angular scripts
		views - angular views
		index.html - start point for angular

	bin/www - script that runs app
	install.js - script that installs app
	sockets.js - script for starting socket server

DB structure is described in design.png, I don't have experience of makeing desing of database for view, 
so I apologize if anything is incorrect


Assumptions
	At start sockets were not needed , but when it came to make timer that is same for all users, sockets become quite handy for this.
	Sockets are also used for logging out user if he logins from another place.  User token is just a timestmp, becuase security is not 
	prior for this testing project, also custom ORM located in base-model.js was used, bacuase of lack of Node with MySQL experience.
	I believe I need to make myself familiar with Mysql ORM for node.

	I'm well aware of test driven development, but I don't have much practice in it, so test are placed in one file and will not work as standalone. 
	6 tests describe basic user flow for this app, logging in, getting inventory and submiting auction, then logging in with another user 
	account and bidding the current auction.

	Code does not include minified data, because of lack of time to make tasks with gulp/grunt or webpack and it's not prior for this testing project.

Issues
	Making timer to work for all same and work same after entire app crash / restart.

Feedback
	App needs to be minifyed, refactored and filled with other tests.
	ORM can be changed to another popular one.
	Design can be updated
