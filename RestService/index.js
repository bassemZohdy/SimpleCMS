'use strict';
/**
 * Created by bzohdy on 8/31/14.
 */
var mongoose = require('mongoose');
var restify = require('restify');


var _ = require('lodash');
var autoIncrement = require('mongoose-auto-increment');
var utils = require('./utils');

var dbUrl = 'mongodb://localhost/simpleCMS';

mongoose.connect(dbUrl);
autoIncrement.initialize(mongoose.connection);

var ContentSchema = mongoose.Schema({
    _id: Number,
    name: String,
    title: String,
    tags: [String],
    body: String,
    outlines: String,
    status: {
        type: String,
        default: 'draft'
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    }
});
var TagSchema = new mongoose.Schema({
    name: {
        type: String,
        lowercase: true,
        index: {
            unique: true
        }
    }
});

ContentSchema.plugin(autoIncrement.plugin, 'Content');
ContentSchema.pre('save', function (next) {
    var newTags = this.tags;
    Tag.find({
        name: {
            $in: newTags
        }
    }, 'name', function (err, oldTags) {
        oldTags = oldTags.map(function (tag) {
            return tag.name
        });
        var toBeCreated = _.remove(newTags, function (tag) {
            return (!_.contains(oldTags, tag))
        });
        toBeCreated.forEach(function (tag) {
            var newTag = new Tag({
                name: tag
            });
            newTag.save();
        });
    });
    this.updated = new Date();
    next();
});

var Tag = mongoose.model('Tag', TagSchema);
var Content = mongoose.model('Content', ContentSchema);
var contentService = new utils.Service(Content);
var tagService = new utils.Service(Tag);

var server = restify.createServer({
    name: 'CMS'
});

server.use(restify.queryParser());
server.use(restify.bodyParser());

var CONTENT = 'content';
var TAG = 'tag';

utils.resourceRoute(CONTENT, contentService, server);
utils.resourceRoute(TAG, tagService, server, {
    methods: 'List'
});

server.listen(3000, function () {
    console.log('%s listening at %s', server.name, server.url);
});





function init() {
    var content = new Content({
        name: 'Article1',
        title: 'This is initial article',
        tags: ['new', 'old'],
        outlines: 'This is outlines',
        body: '<h3>Body</h3>',
        status: "approved"
    });
    console.log('create content');
    Content.remove({}, function (err) {
        content.save(function (err) {
            if (err)
                console.error(err);
        });
        for (var i = 2; i < 13; i++) {
            content = new Content({
                name: 'Article' + i,
                title: 'This is initial article' + i,
                tags: ['init', 'article'],
                outlines: 'This is outlines ' + i,
                body: '<h3>Body' + i + '</h3>',
                status: "draft"
            });
            content.save(function (err) {
                if (err)
                    console.error(err);
            });
        }
    });
}

init();