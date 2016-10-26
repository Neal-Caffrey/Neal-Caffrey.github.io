/**
 * Created by Gorden on 2016/10/15.
 */
(function ($, win, doc) {

    if (!Array.prototype.filter)
    {
        Array.prototype.filter = function(fun /*, thisArg */)
        {
            "use strict";

            if (this === void 0 || this === null)
                throw new TypeError();

            var t = Object(this);
            var len = t.length >>> 0;
            if (typeof fun !== "function")
                throw new TypeError();

            var res = [];
            var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
            for (var i = 0; i < len; i++)
            {
                if (i in t)
                {
                    var val = t[i];

                    // NOTE: Technically this should Object.defineProperty at
                    //       the next index, as push can be affected by
                    //       properties on Object.prototype and Array.prototype.
                    //       But that method's new, and collisions should be
                    //       rare, so use the more-compatible alternative.
                    if (fun.call(thisArg, val, i, t))
                        res.push(val);
                }
            }

            return res;
        };
    }

    win.HUT = {
        ajax: function (opt) {
            return $.ajax({
                url: opt.url,
                data: opt.data || {},
                type: opt.method || "GET",
                headers: opt.header || "",
                dataType: "JSON",
                success: function (ret) {
                    if (typeof ret === 'string') {
                        opt.success && opt.success(JSON.parse(ret));
                    }
                    if (typeof ret === 'object') {
                        opt.success && opt.success(ret);
                    }

                    // resolve(ret);
                },
                error: function (err, a, b) {
                    opt.error && opt.error(err);
                    // inject(err);
                }
            });
        },
        timeAjax: function (opt) {
            var that = this;
            var _TIMOUT = null;
            var _DATE = 0;
            var ajax = that.ajax({
                url: opt.url,
                data: opt.data,
                headers: opt.headers,
                method: opt.method || "GET",
                success: opt.success || function (ret) {
                },
                error: opt.error || function (ret) {
                }
            });

            _TIMOUT && clearTimeout(_TIMOUT);
            if (+new Date - that._DATE < 300) {
                that.abordRequest();
                return;
            }
            that._DATE = +new Date;
            console.log("sendRequest");

            function abordRequest(opt) {
                ajax && ajax.abort();
                _DATE = +new Date;
                console.log("aboutRequest");
                _TIMOUT = setTimeout(function () {
                    that.ajax(opt);
                }, 350);
            }
        },
        getRangeOfMoment : function(start,end){
            return end.diff(start,'days')+1;
        },
        modal : function(wrap){
            $(wrap).modal({
                keyboard : true,
            })
        }


    }

})(jQuery, window, document);