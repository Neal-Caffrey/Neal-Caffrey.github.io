const initailPlanList = (stc,stt,edt)=>{
    const startCity = Object.assign({},stc);
    const startTime = moment(stt);
    const endTime = moment(edt);
    const arrayLen = endTime.diff(startTime,'days')+1;
    const defaultObject = {
      date : startTime,//日期
      distanceDesc : '',//
      isComplete : false,
      isLast : false,
      startCity : startCity,
      dailyVo : {
        startCity : startCity,
        // endCity : startCity,
        time : '09:00',
        isHalfDay : false,
        type : -1
      },//每天的行程
      type : 0 // 0 : 按天包车，1：半日包车，2：仅接送机，3：本日无包车
    }
    // this.props.dispatch(initailPlanList(initailArrayByLenAndObj(arrayLen,defaultObject)));
    // this.props.dispatch(updateTime(stt,edt));
    // this.props.dispatch(updateCurrentDayIndex(0,defaultObject));
    // this.props.dispatch(updateDailyVo(defaultObject['dailyVo']));
    return defaultObject;
}
