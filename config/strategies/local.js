'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	config = require('../config'),
	User = require('mongoose').model('User'),
	users = require('../../app/controllers/users.server.controller');
	// ActiveDirectory = require('activedirectory'),
	// ad = new ActiveDirectory({
	// 	url: config.ldap.server,
	// 	baseDN: 'OU=DEN,OU=AMER,DC=corp,DC=hds,DC=com',
	// 	username: config.ldap.adminuser,
	// 	password: config.ldap.adminpass,
	// 	logging: {
	//       name: 'ActiveDirectory',
	//       streams: [
	//         { level: 'debug',
	//           stream: process.stdout }
	//       ]
 //   }
	// });


module.exports = function() {
	// Use local strategy
	passport.use(new LocalStrategy({
			usernameField: 'username',
			passwordField: 'password'
		},
		function(username, password, done) {
			User.findOne({
				username: username
			}, function(err, user) {
				if (err) {
					return done(err);
				}
				if (!user) {
					return done(null, false, {
						message: 'Unknown user or invalid password'
					});
				}
				if (!user.authenticate(password)) {
					return done(null, false, {
						message: 'Unknown user or invalid password'
					});
				}

				return done(null, user);
			});
		}
	));
};
	
	
	// Use local strategy with AD module!
	// passport.use(new LocalStrategy({
	// 		usernameField: 'username',
	// 		passwordField: 'password',
	// 		passReqToCallback: true
	// 	},
	// 	function(req, username, password, done) {
	// 		username = 'HDS\\' + username;
	// 		var sAMAccountName = username.slice(4);
	// 		var securityGroup = config.ldap.securityGroup;
			
	// 			ad.authenticate(username, password, function(err, user) {
	// 					if (err) {
	// 						return done(err);
	// 					}
	// 					if (!user) {
	// 						return done(null, false, {message: 'Invalid username or password'});
	// 					}
	// 					else {
	// 						// check to see if user is part of defined security group
	// 						ad.isUserMemberOf(sAMAccountName, securityGroup, function(err, user){
	// 								if (!user) {
	// 									return done(null, false, { message: 'You are not authorized to access this application. Please contact the Help Desk for further assistance'});
	// 								}
	// 								// if user is part of group, search user and return LDAP info and store in DB if does not exist
	// 								else {
	// 									ad.findUser(sAMAccountName, function(err, user){
	// 										if (err) {
	// 											return done(err);
	// 										}
	// 										else {

	// 									// create LDAP user profile info
	// 									var providerUserProfile = {
	// 										firstName: user.givenName,
	// 										lastName: user.sn,
	// 										displayName: user.displayName,
	// 										email: user.mail,
	// 										username: user.sAMAccountName,
	// 										provider: 'local'
	// 									};
	// 									// console.log(providerUserProfile.username);
	// 									// save user profile to db if they do not exist
	// 									users.saveLDAPUserProfile(req, providerUserProfile, done);
	// 									}

	// 									});
	// 								}

	// 						});

	// 				}

				
	// 		});
	// 	}
	// ));
