

const getNavSetting =   function getNavSetting(allData){
  let key = [];
  let NAV_LIST = [
    {
      title : '热门',
      isActive : true,
      isHot : true,
    }
  ]
  let obj = {};
  allData.map((v,i)=>{
    let initail = v.spell[0].toUpperCase();
    key.indexOf(initail) === -1 ? key.push(initail) : null;
    typeof obj[initail] === 'object' ? obj[initail].push(v) : (obj[initail] = [],obj[initail].push(v));
    return;
  });
  let index = 1;
  let title = '';
  let innerObj = {citys : {}};
  for(let key in obj){
    if(index % 3 === 0){
      title+=key;
      innerObj.title = title;
      innerObj['citys'][key] = obj[key];
      innerObj['isActive'] = false;
      NAV_LIST.push(innerObj);
      title='';
      innerObj = {citys : {}};
    }else{
      title+=key;
      innerObj['citys'][key] = obj[key];

    }
    index ++;
  }
  return NAV_LIST;

}
export {getNavSetting}
