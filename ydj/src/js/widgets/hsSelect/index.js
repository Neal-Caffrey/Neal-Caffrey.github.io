/**
 * Created by Gorden on 2016/10/18.
 */
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// var $ = require('widgets/jquery/jquery');
// require('./index.scss');
var tpl = "<div class=\"J-HsSelect\">  <div class=\"ui-selector unselectable ui-timer in points-ltlb\">      <table cellpadding=\"0\" cellspacing=\"0\" style=\"width:100%\">          <tbody>              <tr>                  <th class=\"hour-head\" align=\"center\">时</th>                  <th class=\"minute-head\" align=\"center\">分</th>              </tr>              <tr>                  <td class=\"hour-body\" valign=\"top\">                      <div><a href=\"javascript:void(0);\" class=\"hour\" data-hour=\"00\">00</a><a href=\"javascript:void(0);\" class=\"hour\" data-hour=\"01\">01</a><a href=\"javascript:void(0);\" class=\"hour\" data-hour=\"02\">02</a><a href=\"javascript:void(0);\" class=\"hour\"                              data-hour=\"03\">03</a><a href=\"javascript:void(0);\" class=\"hour\" data-hour=\"04\">04</a><a href=\"javascript:void(0);\" class=\"hour\" data-hour=\"05\">05</a><a href=\"javascript:void(0);\" class=\"hour\" data-hour=\"06\">06</a><a href=\"javascript:void(0);\"                              class=\"hour\" data-hour=\"07\">07</a><a href=\"javascript:void(0);\" class=\"hour\" data-hour=\"08\">08</a><a href=\"javascript:void(0);\" class=\"hour\" data-hour=\"09\">09</a><a href=\"javascript:void(0);\" class=\"hour\" data-hour=\"10\">10</a>                          <a                              href=\"javascript:void(0);\" class=\"hour\" data-hour=\"11\">11</a><a href=\"javascript:void(0);\" class=\"hour\" data-hour=\"12\">12</a><a href=\"javascript:void(0);\" class=\"hour\" data-hour=\"13\">13</a><a href=\"javascript:void(0);\" class=\"hour\" data-hour=\"14\">14</a><a href=\"javascript:void(0);\"                                  class=\"hour\" data-hour=\"15\">15</a><a href=\"javascript:void(0);\" class=\"hour\" data-hour=\"16\">16</a><a href=\"javascript:void(0);\" class=\"hour\" data-hour=\"17\">17</a><a href=\"javascript:void(0);\" class=\"hour\" data-hour=\"18\">18</a>                              <a                                  href=\"javascript:void(0);\" class=\"hour\" data-hour=\"19\">19</a><a href=\"javascript:void(0);\" class=\"hour\" data-hour=\"20\">20</a><a href=\"javascript:void(0);\" class=\"hour\" data-hour=\"21\">21</a><a href=\"javascript:void(0);\" class=\"hour\" data-hour=\"22\">22</a><a href=\"javascript:void(0);\"                                      class=\"hour\" data-hour=\"23\">23</a></div>                  </td>                  <td class=\"minute-body\" valign=\"top\">                      <div><a href=\"javascript:void(0);\" data-minute=\"00\" class=\"minute\">00</a><a href=\"javascript:void(0);\" data-minute=\"10\" class=\"minute\">10</a><a href=\"javascript:void(0);\" data-minute=\"20\" class=\"minute\">20</a><a href=\"javascript:void(0);\"                              data-minute=\"30\" class=\"minute\">30</a><a href=\"javascript:void(0);\" data-minute=\"40\" class=\"minute\">40</a><a href=\"javascript:void(0);\" data-minute=\"50\" class=\"minute\">50</a></div>                  </td>              </tr>              <tr>                  <td colspan=\"2\" align=\"center\" class=\"tool-part\">                      <button data-tag=\"close\" class=\"ui-button btn-rounded btn-primary btn-tiny\">关闭</button>                  </td>              </tr>          </tbody>      </table>  </div></div>";
/*
 opt.wrap || $("body")
 opt.target || $("body")
 opt.width || $(opt.targe).width()
 opt.val {h : 04,m:50}

 */

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

// var $ = require('widgets/jquery/jquery');
// require('./index.scss');
// var tpl = require('./index.tpl');
/*
 opt.wrap || $("body")
 opt.target || $("body")
 opt.width || $(opt.targe).width()
 opt.val {h : 04,m:50}
 opt.defaultDis {h : 14 m : 00}
 */
var HsSelect = (function () {
    function HsSelect(opt) {
        _classCallCheck(this, HsSelect);

        this.opt = opt;
        this.init();
    }

    _createClass(HsSelect, [{
        key: 'init',
        value: function init() {
            this._resetClick();
            this.renderUI();
            // this.show();
            this.bindEvent();
            this.setInitalData({});
        }
    }, {
        key: '_resetClick',
        value: function _resetClick() {
            this._CACHEOBJ = {
                hclick: false,
                mclick: false
            };
        }
    }, {
        key: 'renderUI',
        value: function renderUI() {
            var wrap = this.opt.wrap || $('body');
            var target = this.opt.target || $('body');
            var width = this.opt.width || $(target).outerWidth();
            // var top = $(target).offset().top + $(target).outerHeight();
            // var left = $(target).offset().left;
            this.DOM = $(tpl).css({
                position: 'absolute',
                top: top,
                width: width,
                // 'left': left,
                'z-index': 999,
                'display': 'none'
            });
            wrap.append(this.DOM);
        }
    }, {
        key: 'updateToday',
        value: function updateToday(tag) {
            var that = this;
            var max = that.opt.defaultDis && that.opt.defaultDis.h || 14;
            if (tag) {
                this.DOM.find('.hour-body a').each(function (i, v) {
                    var dom = $(v);
                    var val = dom.attr('data-hour') - 0;
                    if (max - val > 0) {
                        dom.addClass('disable');
                    }
                });
            } else {
                this.DOM.find('.hour-body a').each(function (i, v) {
                    var dom = $(v);
                    dom.removeClass('disable');
                });
            }
        }
    }, {
        key: 'updateInital',
        value: function updateInital(obj) {
            this.setInitalData(obj);
        }
    }, {
        key: 'show',
        value: function show() {
            this.DOM.show();
            return this;
        }
    }, {
        key: 'bindEvent',
        value: function bindEvent() {
            var that = this;
            this.DOM.find('a').on("click", function () {
                if ($(this).hasClass('disable')) {
                    return;
                }
                $(this).addClass('selected').siblings().removeClass('selected');
                if ($(this).parents('.hour-body').length > 0) {
                    that._CACHEOBJ.hclick = true;
                } else {
                    that._CACHEOBJ.mclick = true;
                }
                that.setTime();
            });
            this.opt.target.on('click', function () {
                if (that.DOM.css('display') != 'block') {
                    that.show();
                    if (!that.ISInital) {
                        that._getSelectHour();
                        that.ISInital = true;
                    }
                }
            });
            this.DOM.find('.ui-button').on("click", function () {
                that.hide();
            });
            $('body').on("click", function (e) {
                if ($(e.target).parents('.J-HsSelect').length > 0 || e.target == that.opt.target[0]) {
                    return;
                }
                that.hide();
            });
        }
    }, {
        key: 'setTime',
        value: function setTime() {
            var h = this.DOM.find('.selected').first().attr("data-hour");
            var m = this.DOM.find('.selected').last().attr("data-minute");
            this.opt.target.val(h + ':' + m);
            if (this._CACHEOBJ.hclick && this._CACHEOBJ.mclick) {
                this.hide();
            }
            $(document).trigger('select.hsselect');
        }
    }, {
        key: 'hide',
        value: function hide() {
            this.DOM.hide();
            this._resetClick();
        }
    }, {
        key: '_getSelectHour',
        value: function _getSelectHour() {
            var dom = this.DOM.find('.hour-body .selected');
            var top = dom.offset().top;
            $('.hour-body div').scrollTop(top);
        }
    }, {
        key: 'setInitalData',
        value: function setInitalData(obj) {

            if (!this.opt.val) {
                return;
            }

            this.DOM.find('.selected').removeClass('selected');

            var hh = this.DOM.find('.hour-body a');
            var mm = this.DOM.find('.minute-body a');
            var h = obj.h || this.opt.val.h;
            var m = obj.m || this.opt.val.m;
            var attr = '';

            if (!h) {
                hh.removeClass('selected');
            }
            if (!m) {
                mm.removeClass('selected');
            }

            $.each(hh, function (i, v) {
                attr = $(v).attr('data-hour');
                if (attr == h) {
                    $(v).addClass('selected');
                }
            });
            $.each(mm, function (i, v) {
                attr = $(v).attr('data-minute');
                if (attr == m) {
                    $(v).addClass('selected');
                }
            });
        }
    }]);

    return HsSelect;
})();
