'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	config = require('../config'),
	User = require('mongoose').model('User'),
	users = require('../../app/controllers/users.server.controller'),
	ActiveDirectory = require('activedirectory'),
	ad = new ActiveDirectory({
		url: config.ldap.server,
		baseDN: 'DC=corp,DC=hds,DC=com',
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


module.exports = function() {
	// Use local strategy with AD module!
	passport.use(new LocalStrategy({
			usernameField: 'username',
			passwordField: 'password',
			passReqToCallback: true
		},
		function(req, username, password, done) {
			username = 'HDS\\' + username;
			// get user AD info
			var sAMAccountName = username.slice(4);
				ad.authenticate(username, password, function(err, user) {
						ad.findUser(sAMAccountName, function(err, user){
							if (err) {
								console.log('find user error: '+JSON.stringify(err));
								return done(err);
							}
							if (!user){
								return done(null, false, { message: 'Invalid username or password'});
							}
							else {
								console.log(user.sAMAccountName);

								// create LDAP user profile info
								var providerUserProfile = {
									firstName: user.givenName,
									lastName: user.sn,
									displayName: user.displayName,
									email: user.mail,
									username: user.sAMAccountName,
									provider: 'local'
								};
								console.log(providerUserProfile.username);
								// save user profile to db if they do not exist
								users.saveLDAPUserProfile(req, providerUserProfile, done);
								// return done(null, user);
							}
							

						});

				
			});
		}
	));
};