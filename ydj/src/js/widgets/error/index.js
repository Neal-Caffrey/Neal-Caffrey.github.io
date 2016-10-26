/**
 * Created by kepeng on 2016/10/17.
 */
 // 使用方法
 // new window.ErrorPrompt({
	// 			msg: {				//msg 代表需要显示的文字
	// 				title: '查询价格失败',
	// 				sub: '无日租报价'
	// 			},
	// 			type: '0',    //表示图标状态，0:错误，1:警告
	// 			mode: '1'     //0或者不传表示自动隐藏，默认4秒，其它数值代表永久不隐藏
	// 		})
	//  还有一个hide方法调用可以手动隐藏

(function($, win, doc){
	// var TPL = [
	// 	'<div class="error-box error" id="J-errorBox">',
	// 		'<p>',
	// 			'<i class="{@if data.type == 0} error {@else if data.type == 1} warning  {@/if}"></i>',
	// 			'<b class="title">${data.msg.title}</b>',
	// 			'<small class="sub">${data.msg.sub}</small>',
	// 		'</p>',
	// 	'</div>'
	// ].join('');
	var TPL = [
		'<div class="error-box error" id="J-errorBox">',
			'<p>',
				'<i class="${getClassByErrorType(data.type)}"></i>',
				'<b class="title">${data.msg.title}</b>',
				'<small class="sub">${data.msg.sub}</small>',
			'</p>',
		'</div>'
	].join('');

	function ErrorPrompt(opt) {
	        this.opt = opt;
	        this.init();
	}
	ErrorPrompt.prototype = {
		init: function(){
			this.addJuicerHelper();
			this.getData();
			this.changeMode();
		},
		cacheData: function(){
			var that = this;
		},
		getData: function(){
			var that = this;
			// this.data = {};
			
			that.oData = {
					msg:{
						title: that.opt.msg.title || '报警',
						sub: that.opt.msg.sub || '操作异常'
					},
					type: that.opt.type,
					mode: that.opt.mode || 0
					
			};
			that.renderUI();
		},
		addJuicerHelper : function(){
				juicer.register('getClassByErrorType',function(type){
					switch(type-0){
						case 0 : 
						 return 'error';
						 // break;
						 case 1 :
						 return 'warning';
						 // break;
					}
				})
		},
		
		changeMode: function(){
			var that = this;
			if(that.oData.mode == 0){
					$("#J-errorBox").fadeOut(2000);
					// $("#J-errorBox").remove();
			}
		},
		renderUI: function(){
			var that = this;
			$('body').append(juicer(TPL, {data: that.oData}));
		},
		hide: function(){
			$("#J-errorBox").fadeOut(2000);
		}


	}

	win.ErrorPrompt = ErrorPrompt;

})(jQuery, window, document);