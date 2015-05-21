'use strict';

module.exports = {
	db: 'mongodb://localhost/hdnotify',
	app: {
		title: 'HDNotify PROD - Notification Center',
		description: 'Web Notification Tool',
		keywords: 'MongoDB, Express, AngularJS, Node.js, Web',
		
	},
	version: '0.0.1',
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: process.env.SESSION_SECRET || '',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.css',
                'public/lib/metisMenu/dist/metisMenu.min.css',
                'public/lib/fontawesome/css/font-awesome.min.css',
                'public/lib/angular-bootstrap-datetimepicker/src/css/datetimepicker.css'
			],
			js: [
				'public/lib/jquery/dist/jquery.min.js',
                'public/lib/bootstrap/dist/js/bootstrap.min.js',
                'public/lib/metisMenu/dist/metisMenu.min.js',
                'public/lib/PACE/pace.min.js',
                'public/scripts.js',
				'public/lib/angular/angular.js',
				'public/lib/angular-resource/angular-resource.js',
				'public/lib/angular-cookies/angular-cookies.js', 
				'public/lib/angular-animate/angular-animate.js', 
				'public/lib/angular-touch/angular-touch.js', 
				'public/lib/angular-sanitize/angular-sanitize.js', 
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
				'public/lib/angular-confirm-modal/angular-confirm.js',
				'public/lib/ng-simplePagination/simplePagination.js',
				'public/lib/moment/min/moment.min.js',
				'public/lib/angular-bootstrap-datetimepicker/src/js/datetimepicker.js'
			]
		},
		css: 'public/dist/application.min.css',
		js: 'public/dist/application.min.js'
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
		from: process.env.MAILER_FROM || '',
		options: {
			path: process.env.SENDMAIL_BIN || '/usr/sbin/sendmail'

		}
	}
};
