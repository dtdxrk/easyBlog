'use strict';

var hbs = require('hbs');
var _ = require('lodash');

// 去除json数据中的空字符串
exports.delEmpty = function(pa) {
    pa = pa || {};
    for (var key in pa) {
        if (pa[key] && pa[key].trim) {
            pa[key] = pa[key].trim();
        }
        if (pa[key] === "") {
            delete pa[key];
        }
    }
    return pa;
};

// get parameters from request
exports.getRequestParams = function(req) {
    var old_q = req.query;
    var new_q = {};
    _.forEach(old_q, function(value, key) {
        if (_.isArray(value)) {
            var temp;
            _.forEach(value, function(item) {
                if (item !== "null" && item !== "undefined" && item !== "") {
                    temp = item;
                }
            });
            new_q[key] = temp;
        } else {
            new_q[key] = value;
        }
    });
    var condition = _.assign({}, req.params || {}, req.body || {}, new_q);
    return exports.delEmpty(condition);
};

// handlebars helpers

var blocks = {};

hbs.registerHelper('extend', function(name, options) {
    var block = blocks[name];
    if (!block) {
        block = blocks[name] = [];
    }
    block.push(options.fn(this)); // for older versions of handlebars, use block.push(options(this));
});

hbs.registerHelper('block', function(name) {
    var val = (blocks[name] || []).join('\n');
    // clear the block
    blocks[name] = [];
    return val;
});

// 两个值全等比较
hbs.registerHelper("if_equal", function(v1, v2, options) {
    if (v1 == v2) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});
// 两个值不等
hbs.registerHelper("if_no_equal", function(v1, v2, options) {
    if (v1 != v2) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

// 两个值大于比较
hbs.registerHelper("if_more_than", function(v1, v2, options) {
    v1 = parseFloat(v1);
    v2 = parseFloat(v2);
    if (v1 > v2) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

// 乘法
hbs.registerHelper("hp_float_accMul", function(v1, v2) {
    return exports.float_accMul(v1, v2);
});

// 浮点数减法
hbs.registerHelper("hp_float_accSub", function(v1, v2) {
    return exports.float_accSub(v1, v2);
});

// 翻页
hbs.registerHelper("hp_page", function(page) {
    var _html = '<div class="page">'
    if (page) {
        for (var i = 0; i < page.total / page.pageCount; i++) {
            var num = i + 1;
            if (num == page.page) {
                _html += '<a class="on">' + num + '</a>'
            } else {
                _html += '<a href="/?page=' + num + '">' + num + '</a>'
            }
        }
    }
    _html += '</div>'
    return _html;
});