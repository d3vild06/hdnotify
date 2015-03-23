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
        enum: ['outage', 'informational'],
        required: true
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
        type: String,
        required: true
    },
    priority: {
        type: Number,
        enum: ['1', '2'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    services_affected: {
        type: String,
        required: true
    },
    // brief_description: {
    //     type: String,
    //     required: true
    // },
    biz_impact: {
        type: String,
        required: true
    },
     workaround: {
        type: String,
        required: true
    },
    email_dlist: {
        type: String,
        required: true
    },
    // only for notice updates
    status_update: {
        type: String
    },
    // required on resolution notice
    resolution: {
        type: String
    },
    regions_affected: {
        type: String,
        required: true
    },
    outage_start_time: {
        type: Date,
        required: true
    },
    outage_end_time: {
        type: Date
    },
    outage_total_time: {
        type: Number
    },
	created: {
		type: Date,
		default: Date.now
	},
    created_by: {
        // type: Schema.ObjectId,
        type: String,
        // ref: 'User'
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
	updated_by: {
		type: String
	}
});

mongoose.model('Notice', NoticeSchema);
