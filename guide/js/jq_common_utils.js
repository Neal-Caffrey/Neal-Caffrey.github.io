/**
 * Created by LuoShuai on 2015/11/26.
 */
(function ($) {
    $.isNotNull = function (string) {
        if (string != "" && string != undefined && string != null) {
            return true;
        } else {
            return false;
        }
    }
})(jQuery);

(function ($) {
    $.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }
})(jQuery);

