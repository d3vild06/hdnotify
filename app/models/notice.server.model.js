'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Notice Schema
 */
var NoticeSchema = new Schema({
	template_id: {
		type: String,
		ref: 'Template'
	},
    notice_type: {
        type: String,
        enum: ['outage', 'informational']
    },
    status: {
        type: String,
        enum: ['active', 'closed']
    },
    auto_update: {
        type: Number,
        default: 60
    },
    ticket_number: {
        type: String
    },
    priority: {
        type: Number,
        enum: ['1', '2']
    },
    title: {
        type: String
    },
    services_impacted: {
        type: String
    },
    brief_description: {
        type: String
    },
    biz_impact: {
        type: String
    },
    regions_affected: {
        type: String
    },
    outage_start_time: {
        type: Date
    },
    outage_end_time: {
        typ: Date
    },
    outage_total_time: {
        type: Number
    },
	created: {
		type: Date,
		default: Date.now
	},
    updated_at: {
        type: Date
    },
	updated_by: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Notice', NoticeSchema);
