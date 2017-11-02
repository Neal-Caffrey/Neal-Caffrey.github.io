import moment from 'moment';
import update from 'react-addons-update';
const addEventListener =  (obj, evt, fnc) => {
  // W3C model
  if (obj.addEventListener) {
    obj.addEventListener(evt, fnc, false);
    return true;
  }
  // Microsoft model
  else if (obj.attachEvent) {
    return obj.attachEvent('on' + evt, fnc);
  }
  // Browser don't support W3C or MSFT model, go on with traditional
  else {
    evt = 'on'+evt;
    if(typeof obj[evt] === 'function'){
      // Object already has a function on traditional
      // Let's wrap it with our own function inside another function
      fnc = (function(f1,f2){
        return function(){
          f1.apply(this,arguments);
          f2.apply(this,arguments);
        }
      })(obj[evt], fnc);
    }
    obj[evt] = fnc;
    return true;
  }
  return false;
};

const isEmptyObject = (e)=>{
  var t;
  for (t in e)
  return !1;
  return !0
}

const getChannelId = ()=>{
  if(!window.__AGENT_INFO){
    return '';
  }
  return (window.__AGENT_INFO.agentId)
}

const initailArrayByLenAndObj = (len,obj)=>{
  let arr = new Array(len).fill(obj,0,len);
  return arr.map((val,index)=>{
    const _obj = Object.assign({},obj,{
      date : moment(obj.date).add(index,'days')
    });
    return _obj;
  });

}

const modifyPlanListLen = (planList,length)=>{
  /*
  根据length添加或减少数组的长度，
  如果添加，以最后一个object添加
  */
  let len = planList.length,
  resArr = [];
  for(let index = 0 ; index < length ; index++){
    if(len >= index + 1){
      resArr[index] = planList[index];
    }else{
      resArr[index] = resetObjectToDefault(planList[len-1],index+1-len);
    }

  }

  return resArr;
}

const resetObjectToDefault = (object,index=1)=>{
  console.log(index)
  const _obj = Object.assign({},object,{
    date : moment(object.date).add(index,'days'),
    distanceDesc : '',//
    isComplete : false,
    isLast : false,
    // startCity : object.startCity,
    dailyVo : {
      startCity : object.dailyVo.startCity,
      time : '09:00',
      isHalfDay : false,
      type : -1
    },
    type : 0
});
return _obj;
}

const modifyPlanList = (planList,obj,index)=>{
  /*
  planVo
  修改一个object 有可能会影响到余下的数组。
  如果Vo.type变化 ：由包车游变成无包车等。
  如果Vo.dailyVo的结束城市变化。
  */

  //修改当前
  let lastObj = planList[index];
  let plan =  update(planList,{
    $splice : [[index,1,obj]]
  });
  /*
  修改后面的元素:
  1:当前endCity变化，以后所有的startCity都变化
  2：当前的type变化，
  */
  //修改剩下元素的开始城市
  let endCity = obj.dailyVo.endCity;
  let startCity = obj.dailyVo.startCity;
  return plan.map((val,nIndex)=>{
    if(nIndex > index){
      // endCity && (val.dailyVo.startCity = endCity);
      // endCity && (val.startCity = endCity);
      if(endCity){
        // (val.dailyVo.startCity = endCity);
        // (val.startCity = endCity);
        val = resetObjectToDefault({
          // startCity:endCity,
          startCity : obj.startCity,
          date : moment(val.date.format('YYYY-MM-DD'),'YYYY-MM-DD').add(-1,'days'),
          dailyVo : {
            startCity : endCity,
            time : '09:00',
            isHalfDay : false,
            type : -1
          }
        });
      }else if(val.dailyVo.startCity.cityId != startCity.cityId){
        // (val.dailyVo.startCity = startCity);
        // val.startCity = startCity;
        val = resetObjectToDefault({
          startCity,
          date : moment(val.date.format('YYYY-MM-DD'),'YYYY-MM-DD').add(-1,'days'),
          dailyVo : {
            startCity,
            time : '09:00',
            isHalfDay : false,
            type : -1
          }
        });
      }else if(obj.type === 2 || obj.type === 3){
        //本日无包车，下面全部清空
        val = resetObjectToDefault({
          startCity,
          date : moment(val.date.format('YYYY-MM-DD'),'YYYY-MM-DD').add(-1,'days'),
          dailyVo : {
            startCity,
            time : '09:00',
            isHalfDay : false,
            type : -1
          }
        })
      }
    }
    return val;
  });
}


const checkIsAllDone = (planList)=>{
  for(let index = 0,len = planList.length;index < len ;index ++){
    if(planList[index].isComplete == false){
      return false;
    }
  }
  return true;
}

const getOrder = (planList) =>{
  let res = [];
  /*
    拆单规则： 首日，末日，仅接送机的拆开
    中间无包车的拆开
    更改开始城市的，拆开
   */
  planList = Object.assign(planList);
   let isLast = false;
   let prev = null;
   let cur = null;
   let lastSliceIndex = 0;
   let index = 0;
   for(let i = 0,len = planList.length ;i<len;i++){
      isLast = !!(i === len -1);
      cur = planList[i];
      prev = (i === 0 || i=== lastSliceIndex) ? null : planList[i-1];
      if(checkToSplice(prev,cur,isLast)){
        i>0 && res.push(planList.slice(lastSliceIndex,i));
        lastSliceIndex = i;
        prev= null;
      }

   }
    // while(planList.length !== 0){
    //
    // }
    res.push(planList.slice(lastSliceIndex,planList.length));
   return res;

   function checkToSplice(prev,cur,isLast){
     /**
      *
      */
      if((!prev || isLast) && cur.type === 3){
        //开头，结尾的仅接送机要拆
        return true;
      }
      // if(isLast){
      //   //最后一天要强制拆成一个数组
      //   return true;
      // }
      if(cur.type === 2){
        return true;
      }
      if(!prev){
        //
        return false;
      }

     const prevDailyType = (prev.type === 0 || prev.type === 1);
     const curDailyType = (cur.type === 0 || cur.type === 1);
     if(prevDailyType && curDailyType){
       // 都是包车
       // 要判断是否改变开始城市
       if(prev.startCity.cityId != cur.startCity.cityId){
         return true;
       }
       return false;
     }else{
       return true;
     }
   }
}

const getPriceParam = (arr)=>{
  let paramArray = arr.map((travl,index)=>{
    let obj = {};
    let serviceType;
    if(travl[0].type === 0 || travl[0].type === 1){
      //包车单
      return getParamByType(travl,3,index+1);
    }
    if(travl[0].type === 3){
      // 仅接送机单
      // obj = getParamByType(travl,2);
      return getParamByType(travl,2,index+1);
    }
    if(travl[0].type === 2){
      //本日无包车
      return null;
    }
  }).filter((val)=>{
    return val!=null;
  });

  return paramArray;


  function getParamByType(travl,serviceType,index){
    if(serviceType === 3){
      //包车单
      let plan1Vo = travl[0];
      let plan2Vo = travl[travl.length-1];
      let serviceType = 3;
      let startCityId = plan1Vo.startCity.cityId;
      let specialCarsIncluded = 1;
      let startLocation = plan1Vo.startCity.cityLocation;
      let startDate = plan1Vo.date.format('YYYY-MM-DD') + ' ' + plan1Vo.dailyVo.time+':00';
      let endCityId = plan2Vo.dailyVo.endCity ? plan2Vo.dailyVo.endCity.cityId : plan2Vo.dailyVo.startCity.cityId;
      let endLocation = plan2Vo.dailyVo.endCity ? plan2Vo.dailyVo.endCity.cityLocation : plan2Vo.dailyVo.startCity.cityLocation;
      let endDate = plan2Vo.date.format('YYYY-MM-DD') + ' 23:59:59';
      let halfDay = (plan1Vo.dailyVo.isHalfDay === true && travl.length === 1)? 1 : 0;
      let channelId = getChannelId();
      let arrangements = travl.map((val)=>{
        let serviceDate = (()=>{
          return val.date.format('YYYY-MM-DD') + ' ' + val.dailyVo.time + ':00';
        })();
        let startCityId = val.dailyVo.startCity.cityId;
        let endCityId = val.dailyVo.endCity ? val.dailyVo.endCity.cityId : val.dailyVo.startCity.cityId;
        let tourType = (()=>{
          //游玩类型 0.半日 1.市内 2.周边 3.出城 4.推荐线路
          if(val.type === 102){
            return 0;
          }
          if(val.dailyVo.type === 101){
            return 1
          }
          if(val.dailyVo.type === 201){
            return 2
          }
          if(val.dailyVo.type === 301){
            return 3
          }
        })();
        let airportCode = (()=>{
          let flight = val.dailyVo.pickupVo || val.dailyVo.dropoffVo;
          if(!flight)return '';
          return {
            airportCode : flight.flightVo.arrAirportCode || flight.flightVo.airportCode || '',
            airportServiceType : val.dailyVo.pickupVo ? 1 : (val.dailyVo.dropoffVo ? 2 : ''),
            airportLocation : flight.flightVo.airportLocation || flight.flightVo.arrLocation || ''
          }
        })();

        return {
          serviceDate,
          startCityId,
          endCityId,
          tourType,
          ...airportCode
        }
      });
      return {
        serviceType,
        index,
        param : {
          specialCarsIncluded,
          endCityId,
          startLocation,
          startCityId,
          endDate,
          halfDay,
          channelId,
          endLocation,
          startDate,
          arrangements
        }
      }

    }

    if(serviceType === 2){
      let planVo = travl[0];
      let {pickupVo,dropoffVo} = planVo.flightVo;
      let serviceType = (()=>{
        return pickupVo ? 1 : 2;
      })();
      let channelId = getChannelId();
      let specialCarsIncluded = 1;
      let locations = (()=>{
        if(pickupVo){
          let serviceDate;
          if(pickupVo.type === 0){
            serviceDate = pickupVo.flightVo.arrDate+ ' ' + pickupVo.flightVo.arrTime+':00';
          }else{
            serviceDate = pickupVo.date.format('YYYY-MM-DD')+' ' + pickupVo.time+':00';
          }
          return {
            startLocation : pickupVo.flightVo.arrLocation || pickupVo.flightVo.airportLocation,
            endLocation :  `${pickupVo.placeVo.placeLat},${pickupVo.placeVo.placeLng}`,
            airportCode : pickupVo.flightVo.airportCode || pickupVo.flightVo.arrAirportCode,
            serviceDate
          }
        }
        if(dropoffVo){
          return {
            startLocation :`${dropoffVo.placeVo.placeLat},${dropoffVo.placeVo.placeLng}`,
            endLocation :   dropoffVo.flightVo.arrLocation || dropoffVo.flightVo.airportLocation,
            airportCode : dropoffVo.flightVo.airportCode || dropoffVo.flightVo.arrAirportCode,
            serviceDate : dropoffVo.date.format('YYYY-MM-DD')+' ' + dropoffVo.time+':00'
          }
        }
      })();
      return {
        serviceType,
        index,
        param : {
          specialCarsIncluded,
          channelId,
          ...locations
        }
      }
    }
  }
}



export {addEventListener,isEmptyObject,initailArrayByLenAndObj,modifyPlanList,checkIsAllDone,modifyPlanListLen,getOrder,getPriceParam,getChannelId}
