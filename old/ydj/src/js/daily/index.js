/**
 * Created by Gorden on 2016/10/15.
 */
~(function ($, win, doc) {
    function Daily() {
        this.init()
    }

    Daily.prototype = {
        init: function () {
            this.cacheData();
            this.renderUI();
            this.bindEvent();
        },
        cacheData: function () {
            this.plugin = {}
        },
        cacheDom: function () {

        },
        renderUI: function () {

        },
        bindEvent: function () {
            this._bindDatePicker();
            this._bindCity();
            this._bindLeftToggleEvent();
            this._bindDaysClick();
            this._bindVisListClick();
            this._bindHsSelectClick();
        },
        _bindDaysClick: function () {
            var that = this;
            $(document).on('click', '.cen-tag', function () {
                var obj = $(this);


                if (!that._valiData()) {
                    return;
                } else {
                    var current = obj.prev('.active');
                    obj.prev('.active ').removeClass('active').addClass('com');
                    current.data('data',that._getFormData());
                    console.log(current.data('data'));

                }

                if (obj.hasClass('active')) {
                    return;
                }
                if (!obj.prev('.cen-tag').hasClass('com')) {
                    return;
                }


                obj.addClass('active').siblings().removeClass('active');


                var obj = {
                    cityVo: $('#J-City').data('city'),
                    route: '', //0:室内,1:周边,2:室外
                    desCityVo: '',
                    ifFirst: obj.index() == 0 ? true : false,
                    tplId: '#dailyloc'
                }
                var dayLoc = new DailyLoc(obj);
            })
        },
        _getFormData: function () {
            var that = this,
                wrap = $("#J-sel-form"),
                inputs = wrap.find('input'),
                obj = {};

            inputs.each(function (i, v) {
                var name = $(v).attr('data-name');
                var val = $(v).val();
                obj[name] = val;
            });
            return obj;


        },
        _bindHsSelectClick: function () {
            var that = this;
            $(document).on('click', '#J-cen-time', function () {
                debugger;
                if (that.plugin.hsSelct) {
                    that.plugin.hsSelct.show();
                    return;
                }
                debugger;
                that.plugin.hsSelct = new HsSelect({
                    wrap: $("#J-cen-time-wrap"),
                    target: $("#J-cen-time"),
                    val: {h: '09', m: '00'}
                }).show();
            })

            $(document).on('select.hsselect', function () {
                $("#J-cen-time").parents('.form-group').removeClass('has-error')
            })
        },
        _bindVisListClick: function () {
            //
            $(document).on('click', '#J-cen-type', function () {
                $(this).next('.J-ul-list').toggle();
            });
            $(document).on('click', '#J-bao-type', function () {
                $(this).next('.J-ul-list').toggle();
            });
            $(document).on('click', '.J-ul-list>li', function () {
                var ul = $(this).parents('ul.J-ul-list');
                var target = ul.attr('target');
                if ($(this).find('h4').length > 0) {
                    $(target).val($(this).find('h4').html());
                } else {
                    $(target).val($(this).html());
                }
                $(target).parents('.form-group').removeClass('has-error')
                ul.hide();
            })
        },
        _valiData: function () {
            var res = true;
            var requires = $('.J-Jur-Wrap').find('[data-require=true]');
            requires.each(function (i, v) {
                if ($.trim($(v).val()) == '') {
                    $(v).parents('.form-group').addClass('has-error');
                    res = false;
                }
            });
            return res;
        },
        _setLeftMianHeight: function () {
            var leftHeight = $('.y-left').height();
            var leftOringHeight = $('.y-left>.form-origin').css('display') == 'block' ? $('.y-left>.form-origin').height() : 0;
            var leftSelHeight = $('.y-left>.form-sel').css('display') == 'block' ? $('.y-left>.form-sel').height() : 0;
            $('.y-left>.left-main').height(leftHeight - leftOringHeight - leftSelHeight);
        },
        _bindLeftToggleEvent: function () {
            var that = this;
            $(".J-toShow").on('click', function () {
                $(".form-origin").show();
                $(".form-origin .J-toHide").show();
                $(".form-sel").hide();
                that._setLeftMianHeight();
            });
            $(".J-toHide").on('click', function () {
                $(".form-origin").hide();
                $(".form-sel").show();
                that._setLeftMianHeight();
            });

        },
        _bindCity: function () {
            var that = this;
            this.plugin.city = new win.CitySearch({
                target: $('#J-City'),
                tplId: '#J-CityTpl',
                hoturl: 'https://api3.huangbaoche.com/price/v1.0/p/serviceCities',
                searchurl: 'https://api3.huangbaoche.com/price/v1.0/p/serviceCities'
            });
            $('#J-City').on('hide.citysearch', function () {
                that._checkIsHideTop();
                var cityData = $('#J-City').data('city');
                if (!cityData.placeId) {
                    $(this).parents('.form-group').addClass('has-error')
                }
            }).on('citysel.citysearch', function () {
                that._checkIsHideTop();
                $(this).parents('.form-group').removeClass('has-error')
            });
        },
        _bindDatePicker: function () {
            var that = this;
            $('#J-Date').daterangepicker({
                "locale": {
                    "format": "YYYY-MM-DD",
                    "separator": " 至 ",
                    "daysOfWeek": [
                        "日",
                        "一",
                        "二",
                        "三",
                        "四",
                        "五",
                        "六"
                    ],
                    "monthNames": '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
                },
                "startDate": moment().format('YYYY-MM-DD'),
                "endDate": moment().format('YYYY-MM-DD'),
                "minDate": moment().format('YYYY-MM-DD'),
                "autoApply": true,
            }, function (start, end, label) {
                $('#J-Date').data('time', {start: start, end: end, range: HUT.getRangeOfMoment(start, end)});
                that._checkIsHideTop();
            });
        },
        _checkIsHideTop: function () {
            var that = this,
                cityData = $('#J-City').data('city'),
                timeData = $('#J-Date').data('time');

            if (cityData && timeData) {
                $(".form-origin").hide();
                $(".form-sel").show();
                $(".J-left-main").show();
                that._setLeftMianHeight();
                that._renderCenLeft(timeData.range);
            }


        },
        _renderCenLeft: function (daysCount) {
            var that = this;
            var tpl = [
                '{@each i in range(0,' + daysCount + ')}',
                '<div class="cen-tag {@if i==0}active{@/if}">D${i+1}</div>',
                '{@/each}',
            ].join('');
            $('.J-days-count i').html(daysCount);

            $(".J-cen-days").html(juicer(tpl, {}));
        }
    }

    new Daily();
})(jQuery, window, document)