'use strict';

module.exports = {
	db: 'mongodb://localhost/hdnotify-dev',
	app: {
		title: process.env.APP_TITLE || 'test'
	},
	ldap: {
		server: process.env.LDAP_SERVER || '',
		adminuser: process.env.LDAP_ADMINUSER || '',
		adminpass: process.env.LDAP_ADMINPASS || '',
		securityGroup: process.env.LDAP_SECURITY_GROUP || ''
	},
	
	facebook: {
		clientID: process.env.FACEBOOK_ID || 'APP_ID',
		clientSecret: process.env.FACEBOOK_SECRET || 'APP_SECRET',
		callbackURL: '/auth/facebook/callback'
	},
	twitter: {
		clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
		clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
		callbackURL: '/auth/twitter/callback'
	},
	google: {
		clientID: process.env.GOOGLE_ID || 'APP_ID',
		clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
		callbackURL: '/auth/google/callback'
	},
	linkedin: {
		clientID: process.env.LINKEDIN_ID || 'APP_ID',
		clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
		callbackURL: '/auth/linkedin/callback'
	},
	github: {
		clientID: process.env.GITHUB_ID || 'APP_ID',
		clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
		callbackURL: '/auth/github/callback'
	},
	// using nodemailer sendmail npm plugin here
	mailer: {
		from: process.env.MAILER_FROM,
		options: {
			path: process.env.SENDMAIL_BIN || '/usr/sbin/sendmail'

		}
	}
};
