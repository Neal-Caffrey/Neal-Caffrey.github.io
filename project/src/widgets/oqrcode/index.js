/*
* order Oqrcode - 0.0.1
* option
* toBase64 -> function	
*/
const [_gol, _define, _exports] = [window || this, define, exports];
const qrcode = require('arale-qrcode');
const util = require('local-Utils/dist/main.js');

const _toImg = (canva) => canva.toDataURL("image/png"); 


class Oqrcode {
	constructor(ops = {}) {
		this.option = {
			text : 'https://www.yundijie.com',
			background : '#ffffff',
			foreground : '#000000',
			pdground : '#000000',
		};
		
		if(typeof wrap == 'string' ) this.wrap = _gol.document.querySelectorAll(wrap)[0];
		if(typeof wrap == 'object') util._extend(this.option, wrap);
		util._extend(this.option, ops);

		return this._init();
	}

	_init(){
		let options = {
			render : 'canvas',
			text   : this.option.text,
			size: this.option.width || 220,
			background : this.option.background,
			foreground : this.option.foreground,
			pdground : this.option.pdground,
		};
		let QRcode = new qrcode(options);
		util._extend(QRcode, {'toBase64' : function(){ return _toImg(QRcode)}});
		return QRcode;
	}

};


if(typeof _define === 'function' && _define.amd) _define(function() {return Oqrcode});
else if(typeof _exports === 'object') module[_exports] = Oqrcode;
else _gol.OOqrcode = Oqrcode;