# ZhyNet
特别好用的网络访问库,适合开发POST和GET脚本,支持Promise规范.每个Net实例独享一个cookies池,不用自行管理<br/>
<br/>
#npm install zhynet<br/>
var net=require("zhynet");<br/>
var Net=new net();<br/>
<br/>
Net.post("https://xxx.com/xxx.php")<br/>
  .then((result)=>{<br/>
  <br/>
  console.log(result);<br/>
  <br/>
  });<br/>
  <br/>
  <br/>
  var func = async ()=>{<br/>
  <br/>
 var result=await Net.post("https://xxx.com/xxx.php");<br/>
  console.log(result);<br/>
  <br/>
  }<br/>
