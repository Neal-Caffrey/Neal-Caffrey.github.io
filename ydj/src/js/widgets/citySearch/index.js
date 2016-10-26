// const City = require('./hotcity.js');
// const Search = require('./search.js');
//
//
// module.exports = {
//     init : function(target,hotwrap,searchwrap,hotOff){
//         new City({
//             target : target,
//             wrap : hotwrap,
//             off : hotOff || {}
//         });
//         new Search({
//             target : target,
//             wrap : searchwrap,
//             off : hotOff || {}
//         });
//     }
// }
/*
 target: selector | JqObj
 wrap:STRING
 tplId : STRING
 off : Obj {left : Num, top : Num}
 hoturl : STRING : api3/price/v1.0/p/serviceCities?type=3&keyword=&limit=2000&offset=0
 searchurl : STRING : api3/basicdata/v1.0/p/basicplace/findByKeyword?keyword=dong&limit=8&offset=0
 */
(function ($, win, doc) {
    var SEACHTPL = [
        '{@if data.listData.length > 0}',
        '{@each data.listData as item,index}',
        '{@if index < 10}',
        '<li>$${match(item.cityName)}{@if item.continentName}-$${match(item.continentName)}{@/if}</li>',
        '{@/if}',
        '{@/each}',
        '{@else}',
        '<li class="city-dis">',
        '暂无该城市',
        '</li>',
        '{@/if}'
    ].join('');
    var HOTTPL = [
        '{@each data as item , index}',
        '{@if index < 20}',
        '<li>',
        '${item.cityName}',
        '</li>',
        '{@/if}',
        '{@/each}'
    ].join('')

    function CitySearch(opt) {
        this.opt = opt;
        this.init();
    }

    CitySearch.prototype = {
        init: function () {
            this.addJuicerHelper();
            this.bindEvent();
        },
        cacheData: function () {

        },
        cacheDom: function () {
            this.dom = {}
        },
        bindEvent: function () {
            this._inputEvent();
            this._clickEvent();
        },
        getData: function () {
            var that = this;
            HUT.ajax({
                url: that.opt.hoturl + '?type=3&keyword=&limit=2000&offset=0',
                success: function (ret) {
                    that._getDataSuc.call(that, ret)
                }
            })
        },
        addJuicerHelper: function () {
            var that = this;
            juicer.register('match', function (str) {
                var val = $.trim(that.opt.target.val());
                if (val == "") {
                    return str;
                }
                var reg = new RegExp(val, 'g');
                return str.replace(reg, '<i>' + val + '</i>');
            });
        },
        _getDataSuc: function (ret) {
            var that = this;
            that._cityData = (function (arr) {
                return arr.filter(function (v) {
                    return v.isHotCity === 1
                })
            })(ret.data.listData);
            that.renderHot();
        },
        _outsideEvent: function () {
            this._outsideClickProxy = $.proxy(function (e) {
                this._outsideClick(e);
            }, this);

            // Bind global datepicker mousedown for hiding and
            $(document)
                .on('mousedown.citysearch', this._outsideClickProxy)
                // also support mobile devices
                .on('touchend.citysearch', this._outsideClickProxy)
                // also explicitly play nice with Bootstrap dropdowns, which stopPropagation when clicking them
                .on('click.citysearch', '[data-toggle=dropdown]', this._outsideClickProxy)
                // and also close when focus changes to outside the picker (eg. tabbing between controls)
                .on('focusin.citysearch', this._outsideClickProxy);

        },
        _inputEvent: function () {
            var that = this;
            var ele = null,
                val = '';
            that.opt.target.on('click', function () {
                if (that.isShowing)return;
                if (that._innerWrap) {
                    that.show();
                    return;
                }
                that.getData();
            }).on('input', function () {
                ele = $(this);
                val = ele.val();
                $(this).data('city', '');
                if ($.trim(val) == '') {
                    // hot
                    that._innerWrap.removeClass('J-search-mode');
                    that.renderSubHot();
                } else {
                    that.searchData(val);
                }
            }).on('searchselect.citysearch', function (e, data) {
                $(this).data('city', data);
                $(this).val(data.cityName);
                that.hide();
                that.opt.target.trigger('citysel.citysearch')
            }).on('hotselect.citysearch', function (e, data) {
                $(this).data('city', data);
                $(this).val(data.cityName);
                that.hide();
                that.opt.target.trigger('citysel.citysearch')
            });
        },
        _clickEvent: function () {
            var that = this;
            $(document).on('click', '.J-city-wrap li', function () {
                if($(this).hasClass('city-dis')){return}
                var index = $(this).index();
                var isSearch = $(this).parents('.J-city-wrap').hasClass('J-search-mode');
                var obj = {};
                if (isSearch) {
                    that.opt.target.trigger('searchselect.citysearch', that._searchData.listData[index]);

                } else {
                    that.opt.target.trigger('hotselect.citysearch', that._cityData[index]);
                }
            })
        },
        searchData: function (val) {
            var that = this;
            if (that._timeajax) {
                that._timeajax.abort()
            }
            that._timeajax = HUT.ajax({
                url: that.opt.hoturl + '?keyword=' + val + '&limit=8&offset=0&type=3',
                success: function (ret) {
                    that._getSearchSuc.call(that, ret)
                }
            })
        },
        _getSearchSuc: function (ret) {
            this._searchData = ret.data;
            this.renderSearch();
        },
        _getOffset: function () {
            var that = this,
                offset = $(that.opt.target).offset(),
                outerHeight = $(that.opt.target).outerHeight(),
                outerWidth = $(that.opt.target).outerWidth(),
                offLeft = (that.opt.off && that.opt.off.left) ? that.opt.off.left - 0 : 0,
                offTop = (that.opt.off && that.opt.off.top) ? that.opt.off.top - 0 : 0;

            return {
                top: offset.top + offTop + outerHeight,
                left: offset.left + offLeft,
                width: outerWidth,
            }
        },

        renderHot: function () {
            var that = this,
                tpl = $(that.opt.tplId).html(),

                wrap = that.opt.wrap ? that.opt.wrap : 'body';


            that._wrap = $(wrap);
            that._wrap.append(juicer(tpl, {data: that._cityData}));
            that._innerWrap = $(wrap).find('.J-city-wrap');
            that._innerList = that._innerWrap.find('.city-list');
            that.resetPosition();
            this._outsideEvent();
            that.isShowing = true;
        },
        renderSubHot: function () {
            var that = this;
            that._innerList.html(juicer(HOTTPL, {data: that._cityData}));
        },
        renderSearch: function () {
            var that = this;
            that._innerWrap.addClass('J-search-mode')
            that._innerList.html(juicer(SEACHTPL, {data: that._searchData}))

        },
        resetPosition: function () {
            var that = this;
            var obj = that._getOffset();
            that._innerWrap.css(obj);
        },
        _outsideClick: function (e) {
            var target = $(e.target);
            // if the page is clicked anywhere except within the daterangerpicker/button
            // itself then call this.hide()
            if (
                // ie modal dialog fix

            target.closest(this.opt.target).length ||
            target.closest(this._innerWrap).length ||
            target.closest('.J-city-wrap').length
            ) return;
            this.hide();
            this.opt.target.trigger('hide.citysearch', this);
        },

        show: function () {
            this._innerWrap.show();
            this._outsideEvent();
            this.isShowing = true;
        },

        hide: function () {
            if (!this.isShowing) return;
            $(document).off('.citysearch');
            this._innerWrap.hide();
            // this.element.trigger('hide.daterangepicker', this);
            this.isShowing = false;
        }
    }

    win.CitySearch = CitySearch;
})(jQuery, window, document);