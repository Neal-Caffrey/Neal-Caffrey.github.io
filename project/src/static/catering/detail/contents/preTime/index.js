class Index {
	constructor(opt) {
		// {time:1222,type:'s', showRules: 1}
		if (!opt.time) return null;
		this.data = opt;
		this.data.type = this.data.type || 'm';
		this.data.showType = this.data.showType || 1;
	}

	_getMs() {
		let ms = this.data.time;
		switch (this.data.type) {
			case 'd':
				ms = ms * 24;
			case 'h':
				ms = ms * 60;
			case 'm':
				ms = ms * 60;
			case 's':
				ms = ms * 1000;
			case 'ms':
				ms = ms * 1;
				break;
		}
		return ms;
	}
	getShow() {
		let ms = this._getMs();
		let show;
		switch (this.data.showType) {
			case 1:
				let m = ms / (60 * 1000);
				// 0-120分钟 显示分钟； 121 - 1440分钟 四舍五入到小时；1441以上四舍五入到天
				if(m < 121) {
					show = m + '分钟';
				} else if(m < 1441) {
					show = Math.ceil(m / 60) + '小时';
				} else {
					show = Math.ceil(m / (60 * 24)) + '天'
				}
			break;
		}
		return show;
	}
};

module.exports = Index;