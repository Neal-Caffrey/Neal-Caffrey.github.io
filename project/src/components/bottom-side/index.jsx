import React,{Component} from 'react';
import {connect} from 'react-redux';
import {Button} from 'local-Antd';
class BottomSide extends Component{
  constructor(props,context){
    super(props,context);
    this.state = {
      isCompleteAll : this.props.isCompleteAll
    }
  }
  componentWillReceiveProps(nextProps){
    this.setState({
      isCompleteAll : nextProps.isCompleteAll
    })
  }
  render(){
    return (
      <div className="ui-bottom-side">
        {
          this.state.isCompleteAll ?
          <Button>
            查询用车价格
          </Button> :
          <Button disabled>
            查询用车价格
          </Button>
        }

      </div>
    )
  }
}
function mapStateToProps(state) {
  const { leftSide } = state;
  const { middleSide } = state;
  const {planList,isCompleteAll} = leftSide;
  const {test} = middleSide;
  return {
    planList,
    isCompleteAll,
    test
  }
}
export default connect(mapStateToProps)(BottomSide);
