'use strict';

module.exports = {
	app: {
		title: 'HDNotify - Notification Center',
		description: 'Web Notification Tool',
		keywords: 'MongoDB, Express, AngularJS, Node.js, Web',
		
	},
	version: '0.0.1',
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'Th3Mach1n3!#',
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
				'public/lib/angular-datepicker/dist/index.js',
				'public/lib/moment/min/moment.min.js',
				'public/lib/angular-bootstrap-datetimepicker/src/js/datetimepicker.js'
			]
		},
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};