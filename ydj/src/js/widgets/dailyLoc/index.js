/**
 * Created by Gorden on 2016/10/18.
 */
/*
 opt : {
 cityName,
 cityId,
 location,
 route,[0,1,2] //0:室内,1:周边,2:室外
 desCity,
 ifFirst : 1 true,
 tplId : '#abc'
 }
 */
~(function ($, win, doc) {

    function DailyLoc(opt) {
        this.opt = opt;
        this.init();
    }

    DailyLoc.prototype = {
        init: function () {
            this.renderUI();
        },
        renderUI: function () {
            console.log(this.opt)
            $('.J-Jur-Wrap').html(juicer($(this.opt.tplId).html(), this.opt));
        },
        vali : function(){
            var requires = $('.J-Jur-Wrap').find(['data-require=true']);
            requires.each(function(i,v){
                if($.trim(v) == ''){
                    $(v).parents('.form-group').addClass('has-error')
                }
            });
        }
    }

    win.DailyLoc = DailyLoc;
})(jQuery, window, document);

