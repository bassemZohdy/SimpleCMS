'use strict';
/**
 * Created by bzohdy on 8/31/14.
 */
var _ = require('lodash');
var mongoose = require('mongoose');
module.exports.Service = function (model) {
    if (!(model.modelName && _(mongoose.modelNames()).contains(model.modelName))) {
        throw new Error(model.toString() + 'not a model');
    }
    var _name = model.modelName;
    this.list = function (req, res, next) {
        var count = req.params.count;
        var limit = req.params.limit;
        var start = req.params.start;
        var sort = req.params.sort;
        var queryString = req.params.q;
        var tags = req.params.tags;
        console.log('call list of ' + _name);
        console.log(queryString);
        var q = model.find();
        if (undefined != count) {
            console.log(count);
            model.count({}, function (err, count) {
                if (err) res.send(err);
                res.send({
                    count: count
                });
            });
            next();
            return;
        }
        if (start)
            q = q.skip(start);
        if (limit)
            q = q.limit(limit)
        if (sort)
            q = q.sort(sort);

        // tags filter spicific for tags search have to be more generic 
        if (tags) {
            if (typeof tags === 'string') {
                tags = [tags];
            }
            var whereCase = {
                $and: []
            };
            _.forEach(tags, function (t) {
                whereCase.$and.push({
                    tags: {
                        $in: [t]
                    }
                });
            });
            q.where(whereCase);
        }
        // query filter have to be more generic
        if (queryString) {
            console.log('query start');
            var reg = new RegExp(queryString, 'i');
            var whereCase = {
                $or: [
                    {
                        'name': reg
                                },
                    {
                        'title': reg
                                },
                    {
                        'body': reg
                                },
                    {
                        'outlines': reg
                                }
                            ]
            };
            console.log(whereCase);
            q.where(whereCase);
            console.log('query done');
        }


        q.lean().exec(function (err, resources) {
            if (err) res.send(err);
            res.send(resources);
        });
        next();
    }
    this.count = function (req, res, next) {
        model.count({}, function (err, count) {
            if (err) res.send(err);
            res.send({
                count: count
            });
        });
        next();
    }
    this.get = function (req, res, next) {
        console.log('call get ' + _name + ' ' + req.params.id);
        model.findById(req.params.id).lean().exec(function (err, type) {
            if (err) res.send(err);
            if (!type) res.send(404);
            res.send(type);
        });
        next();
    }
    this.add = function (req, res, next) {
        console.log('call add ' + _name + ' ' + JSON.stringify(req.body));
        var type = new model(req.body);
        type.save(function (err) {
            if (err) res.send(err);
            res.send(201);
        });
        next();
    }
    this.update = function (req, res, next) {
        console.log('call update ' + _name + ' ' + req.params.id);
        model.findById(req.params.id, function (err, e) {
            if (err) res.send(err);
            if (!e) res.send(404);
            var newE = req.body;
            _.keys(newE).forEach(function (k) {
                e[k] = newE[k]
            });
            e.save();
            res.send(204);
        });
        next();
    }
    this.delete = function (req, res, next) {
        console.log('call delete ' + _name + ' ' + req.params.name);
        model.findByIdAndRemove(req.params.id, function (err, type) {
            if (err) res.send(err);
            if (!type) res.send(404);
            res.send(204);
        });
        next();
    }
    return this;
}

module.exports.resourceRoute = function (path, service, server, options) {
    if (!options) {
        options = {};
    }
    if (!options.methods || /all/i.test(options.methods))
        options.methods = ['list', 'get', 'post', 'put', 'delete'];
    else
        options.methods = options.methods.split(",");
    options.methods = options.methods.map(function (method) {
        return method.toLowerCase()
    });

    if (!(service instanceof module.exports.Service)) {
        throw new Error(service.toString() + 'not a service');
    }
    if (_.contains(options.methods, 'list'))
        server.get('/' + path, service.list);
    if (_.contains(options.methods, 'get'))
        server.get('/' + path + '/:id', service.get);
    if (_.contains(options.methods, 'post'))
        server.post('/' + path, service.add);
    if (_.contains(options.methods, 'put'))
        server.put('/' + path + '/:id', service.update);
    if (_.contains(options.methods, 'delete'))
        server.del('/' + path + '/:id', service.delete);
}