import React , {Component,PropTypes} from 'react';
import './sass/index.scss';

class VisitorMessage extends Component{
	constructor(prop,context){
		super(prop,context);

        this.maxPassenger = this.props.maxPassenger|| 7;
        this.luggageNum = this.props.luggageNum || 3;
        this.luggageNumber = (this.props.maxPassenger + this.props.luggageNum) -1;
        this.state = {
              adultNum: this.props.adultNum || 1,
              childNum: this.props.childNum || 0,
              childSeatNum: this.props.childSeatNum || 0,
              // maxPassenger:this.props.maxPassenger|| 7,
              // luggageNum: this.props.luggageNum || 3
            };

	}

    componentWillReceiveProps (nextProps) {
        this.maxPassenger = nextProps.maxPassenger;
        this.luggageNum = nextProps.luggageNum;
        this.luggageNumber = (nextProps.maxPassenger + nextProps.luggageNum) -1; //可携带行李数
        if(nextProps.adultNum && nextProps.adultNum != 0){
          this.setState({
            adultNum: nextProps.adultNum,
            childNum: nextProps.childNum,
            childSeatNum: nextProps.childSeatNum,
            // maxPassenger: nextProps.maxPassenger,
            // luggageNum: nextProps.luggageNum
          })
        }
    }

    numControler(type,method){
        let obj = {
          adultNum : this.state.adultNum - 0,
          childNum : this.state.childNum - 0,
          childSeatNum : this.state.childSeatNum - 0,
          luggageNumber: this.luggageNumber
        };
        if(method == 'add'){
            if(obj['adultNum'] + obj['childNum'] + 0.5* obj['childSeatNum']>= this.maxPassenger){
                return false;
            }
            if(type=='childSeatNum' && obj.childSeatNum>=0 && obj.childSeatNum >= obj.childNum){
                return false;
            }
            if(type=='childNum'&&obj['adultNum'] + obj['childNum'] + 0.5* obj['childSeatNum']==this.maxPassenger-0.5){
                return false;
            }
            if(type=='adultNum'&&obj['adultNum'] + obj['childNum'] + 0.5* obj['childSeatNum']==this.maxPassenger-0.5){
            return false;
            }
            obj[type]++;
        }
        else if(method == 'sub'){
            if(obj[type] == 0){
                return false;
            }
            if(type=='adultNum' && obj['adultNum'] <= 1){
                return false;
            }
            if(type=='childNum' && obj['childSeatNum'] > 0 && obj['childSeatNum']==obj['childNum']){
                obj['childSeatNum']--;
            }
            obj[type]--;
        }
        this.setState(obj);
        this.handleBack(obj);
    }

    handleBack(obj) {
        let total = this.maxPassenger + this.luggageNum;
        let realTotal = Math.ceil(obj.adultNum + obj.childNum + 0.5* obj.childSeatNum);
        this.luggageNumber = total - realTotal;
        this.props.onHandle && this.props.onHandle.call(this, {
            adultNum: obj.adultNum,
            childNum: obj.childNum,
            childSeatNum: obj.childSeatNum,
            luggageNumber: this.luggageNumber
        })
    }

	render(){
        let total = this.maxPassenger + this.luggageNum;
        let realTotal = Math.ceil(this.state.adultNum + this.state.childNum + 0.5* this.state.childSeatNum);
        this.luggageNumber = total - realTotal;
		return(
		    <div className="c-selected">
                <div className="c-passengerWrap">
                    <div className="form-num">
                        <div className="passerger">
                            <span className='adult-chair'>乘坐人数</span>
                        </div>
                        <div className="adult-all">
                            <div className="form-num-box">
                                <i className="num-box-sub" onClick={this.numControler.bind(this,'adultNum', 'sub')}>-</i>
                                <input type="tel" value={this.state.adultNum} />
                                <i className="num-box-add" onClick={this.numControler.bind(this,'adultNum', 'add')}>+</i>
                            </div>
                            <span className="text">成人</span>
                        </div>
                        <div className="child-all">
                            <div className="form-num-box">
                                <i className="num-box-sub" onClick={this.numControler.bind(this,'childNum', 'sub')}>-</i>
                                <input type="tel" value={this.state.childNum}/>
                                <i className="num-box-add" onClick={this.numControler.bind(this,'childNum', 'add')}>+</i>
                            </div>
                            <span className="text">儿童</span>
                        </div>
                    </div>
                    <div className="form-num">
                        <div className="passerger">
                            <i  className='chile-chair'>儿童座椅</i>
                        </div>
                        <div className="form-num-box">
                            <i className="num-box-sub" onClick={this.numControler.bind(this,'childSeatNum', 'sub')}>-</i>
                            <input id="J-childSeatNum"  value={this.state.childSeatNum}/>
                            <i className="num-box-add" onClick={this.numControler.bind(this,'childSeatNum', 'add')}>+</i>
                        </div>
                    </div>
                </div>
                <div className="luggage-info">
                    <span>可携带行李数</span>
                    <ul>
                        <li>乘坐<em>{this.state.adultNum + this.state.childNum}人</em>，可携带行李<em>{total - realTotal}件</em>（按24寸计）</li>
                        <li>出行前请与司导联系，需要何种年龄段的儿童安全座椅</li>
                        <li>实际行李数如果超出限制，请更换更大车型</li>
                    </ul>
                </div>
            </div>

			)
	}

}
export default VisitorMessage;