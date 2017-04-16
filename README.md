# ZhyNet
特别好用的网络访问库,适合开发POST和GET脚本,支持Promise规范.每个Net实例独享一个cookies池,不用自行管理

#npm install zhynet
var net=require("zhynet");
var Net=new net();

Net.post("https://xxx.com/xxx.php")
  .then((result)=>{
  
  console.log(result);
  
  });
  
  
  var func = async ()=>{
  
 var result=await Net.post("https://xxx.com/xxx.php");
  console.log(result);
  
  }
