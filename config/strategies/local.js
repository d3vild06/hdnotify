'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	config = require('../config'),
	User = require('mongoose').model('User'),
	ActiveDirectory = require('activedirectory'),
	ad = new ActiveDirectory({
		url: config.ldap.server,
		baseDN: 'OU=SERVICE ACCOUNTS, OU=SCC, DC=corp,DC=hds,DC=com',
		username: config.ldap.adminuser,
		password: config.ldap.adminpass,
		logging: {
	      name: 'ActiveDirectory',
	      streams: [
	        { level: 'debug',
	          stream: process.stdout }
	      ]
    }
	});

	var opts = {
			filter: '(objectCategory=Person)'
		};

module.exports = function() {
	// Use local strategy with AD module!
	passport.use(new LocalStrategy({
			usernameField: 'username',
			passwordField: 'password'
		},
		function(username, password, done) {
			username = 'HDS\\' + username;
				ad.authenticate(username, password, function(err, user) {
				if (err) {
					return done(err);
				}
				
				if (!user) {
					return done(null, false, { message: 'Invalid username or password' });
				}

				// get user AD info
				// var sAMAaccountName = username.slice(4);
				
				// 	ad.findUser(opts, sAMAaccountName, function(err, user) {
				// 	if (err) {
				// 		console.log('RQ ERROR: '+JSON.stringify(err) + 'sAMAaccountName passed: '+sAMAaccountName);
				// 		return err;
				// 	}
				// 	// if (!user){
				// 	// 	console.log('User: '+ sAMAaccountName + ' not found!');
				// 	// 	return done(null, false);
				// 	// }
				// 	else {
				// 		console.log(JSON.stringify(user));
				// 		return user;	
				// 	}
					
				// });

				// if user successfully authenticates, return the user
				else {
						// console.log(JSON.stringify(user));
						return done(null, {
							username: user.displayName
						});
					}
				// var userCookie = {
				// 	fullname: displayName
				// };

				// return done(null, {
				// 	username: username
				// });


				// if (!user) {
				// 	return done(null, false, {
				// 		message: 'Unknown user or invalid password'
				// 	});
				// }
				// if (!user.authenticate(password)) {
				// 	return done(null, false, {
				// 		message: 'Unknown user or invalid password'
				// 	});
				// }

				
			});
		}
	));
};