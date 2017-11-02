const Setting = (()=>{
  let obj = {};
  const step = 28;
  const hhArr = [];
  const mmArr = [];
  for(let index = 0 ;index < 24;index++){
    hhArr.push({
      hh : index < 10 ? `0${index}` : `${index}`,
      act : index == 9 ? true : false
    })
  }
  for(let index = 0 ; index < 6;index++){
    mmArr.push({
      mm : `${index}0`,
      act : index == 0 ? true : false
    })
  }
  return {
    hhArr,
    mmArr,
    hhScroll : 28*9,
    mmScroll : 0
  }

})();

export default Setting;
