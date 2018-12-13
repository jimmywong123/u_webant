/*!
 * 本地化存储(localStorage) 组件
 */
/*
 *[功能描述]
 * 给不支持本地存储的浏览器创建一个 window.localStorage 对象来提供类似接口
 * 该对象支持以下方法或属性
	setItem : function(key, value)
	getItem : function(key)
	removeItem : function(key)
	clear : function()
	length : int
	key : function(i)
	isVirtualObject : true
 * 二次包装的接口 window.LS 提供以下方法和属性（如果有jQuery则同样会扩展该对象），推荐使用
	set : function(key, vlaue)
	get : function(key)
	remove : function(key)
	clear : function()
	each : function(callback) callback接受两个参数 key 和 value
	obj : function() 返回一个对象描述的localStorage副本
	length : int
 * 
 *[已知问题、使用限制]
 * 原生本地存储的key是区分大小写的，模拟对象不区分（因为userData不区分key的大小写）
 * 模拟对象的 clear 方法仅仅能清理通过本组件设定的数据
 * 模拟对象的实际的存储容量跟原生本地存储有差异
 * 模拟对象不支持任何localStorage事件件
 *
 */


// 准备模拟对象、空函数等


const initLS = () => {
  let LS;
  const noop = function(){}; 
  const notSupport = {
    set:noop,
    get:noop,
    remove:noop,
    clear:noop,
    each:noop,
    obj:noop,
    length:0
  };

  const addCookie = (name,value,expiresHours) => { 
    let cookieString=`${name}=${escape(value)}`; 
    // 判断是否设置过期时间 
    if(expiresHours>0){ 
      const date=new Date(); 
      date.setTime(date.getTime+expiresHours*3600*1000); 
      cookieString=`${cookieString}; expires=${date.toGMTString()}`; 
    } 
    document.cookie=cookieString; 
  } 
  const getCookie = (name) => {
    const strCookie=document.cookie; 
    const arrCookie=strCookie.split("; "); 

    // eslint-disable-next-line no-plusplus
    for(let i=0; i < arrCookie.length; i++){ 
      const arr=arrCookie[i].split("="); 
      if(arr[0]===name) return arr[1]; 
    } 
    return ""; 
  }
  const deleteCookie = (name) => { 
    const date=new Date(); 
    date.setTime(date.getTime()-10000); 
    document.cookie=`${name}=v; expires=${date.toGMTString()}`; 
  } 

  const cookieObj = {
    setItem: addCookie,
    getItem: getCookie,
    removeItem: deleteCookie
  }



  // 优先探测userData是否支持，如果支持，则直接使用userData，而不使用localStorage
  // 以防止IE浏览器关闭localStorage功能或提高安全级别(*_* 万恶的IE)
  // 万恶的IE9(9.0.11）)，使用userData也会出现类似seesion一样的效果，刷新页面后设置的东西就没有了...
  // 只好优先探测本地存储，不能用再尝试使用userData


  // 先探测本地存储 
  // 尝试访问本地存储，如果访问被拒绝，则继续尝试用userData，注： "localStorage" in window 却不会返回权限错误
  // 防止IE10早期版本安全设置有问题导致的脚本访问权限错误
  if( "localStorage" in window ){
    try{
      LS = window.localStorage;
      return LS
    }catch(e){
      // 如果报错，说明浏览器已经关闭了本地存储或者提高了安全级别
      // 则尝试使用userData
    }
  }

  // 继续探测userData
  let o = document.getElementsByTagName("head")[0];
  const hostKey = window.location.hostname || "localStorage";
  const d = new Date();
  let doc;
  let agent;

  // typeof o.addBehavior 在IE6下是object，在IE10下是function，因此这里直接用!判断
  // 如果不支持userData则跳出使用原生localStorage，如果原生localStorage报错，则放弃本地存储
  if(!o.addBehavior){
    try{
      LS = window.localStorage;
    }catch(e){
      LS = null;
    }
    return LS;
  }

  try{ // 尝试创建iframe代理，以解决跨目录存储的问题
    // eslint-disable-next-line no-undef
    agent = new ActiveXObject('htmlfile');
    agent.open();
    agent.write('<script>document.w=window;</script><iframe src="/favicon.ico"></iframe>');
    agent.close();
    doc = agent.w.frames[0].document;
    // 这里通过代理document创建head，可以使存储数据垮文件夹访问
    o = doc.createElement('head');
    doc.appendChild(o);
  }catch(e){
    // 不处理跨路径问题，直接使用当前页面元素处理
    // 不能跨路径存储，也能满足多数的本地存储需求
    // eslint-disable-next-line prefer-destructuring
    o = document.getElementsByTagName("head")[0];
  }

  // 初始化userData
  try{
    d.setDate(d.getDate() + 36500);
    o.addBehavior("#default#userData");
    o.expires = d.toUTCString();
    o.load(hostKey);
    o.save(hostKey);
  }catch(e){
    // 防止部分外壳浏览器的bug出现导致后续js无法运行
    // 如果有错，放弃本地存储
    return cookieObj;
  }
  // 开始处理userData
  // 以下代码感谢瑞星的刘瑞明友情支持，做了大量的兼容测试和修改
  // 并处理了userData设置的key不能以数字开头的问题
  let root;
  let attrs;
  try{
    root = o.XMLDocument.documentElement;
    attrs = root.attributes;
  }catch(e){
    // 防止部分外壳浏览器的bug出现导致后续js无法运行
    // 如果有错，放弃本地存储
    return cookieObj;
  }
  const prefix = "p__hack_";
  const spfix = "m-_-c";
  const reg1 = new RegExp(`^${prefix}`);
  const reg2 = new RegExp(spfix,"g");
  const encode = function(key){ return encodeURIComponent(prefix + key).replace(/%/g, spfix); };
  const decode = function(key){ return decodeURIComponent(key.replace(reg2, "%")).replace(reg1,""); };
  // 创建模拟对象
  LS= {
    length: attrs.length,
    isVirtualObject: true,
    getItem(key){
      // IE9中 通过o.getAttribute(name);取不到值，所以才用了下面比较复杂的方法。
      return (attrs.getNamedItem( encode(key) ) || {nodeValue: null}).nodeValue||root.getAttribute(encode(key)); 
    },
    setItem(key, value){
      // IE9中无法通过 o.setAttribute(name, value); 设置#userData值，而用下面的方法却可以。
      try{
        root.setAttribute( encode(key), value);
        o.save(hostKey);
        this.length = attrs.length;
      }catch(e){// 这里IE9经常报没权限错误,但是不影响数据存储
      }
    },
    removeItem(key){
      // IE9中无法通过 o.removeAttribute(name); 删除#userData值，而用下面的方法却可以。
      try{
        root.removeAttribute( encode(key) );
        o.save(hostKey);
        this.length = attrs.length;
      }catch(e){// 这里IE9经常报没权限错误,但是不影响数据存储
      }
    },
    clear(){
      while(attrs.length){
        this.removeItem( attrs[0].nodeName );
      }
      this.length = 0;
    },
    key(i){
      return attrs[i] ? decode(attrs[i].nodeName) : undefined;
    }
  };

  LS = !LS ? notSupport : {
    set(key, value){
      // fixed iPhone/iPad 'QUOTA_EXCEEDED_ERR' bug
      if( this.get(key) !== undefined )
        this.remove(key);
      LS.setItem(key, value);
      this.length = LS.length;
    },
    // 查询不存在的key时，有的浏览器返回null，这里统一返回undefined
    get(key){
      const v = LS.getItem(key);
      return v === null ? undefined : v;
    },
    remove(key){ LS.removeItem(key);this.length = LS.length; },
    clear(){ LS.clear();this.length = 0; },
    // 本地存储数据遍历，callback接受两个参数 key 和 value，如果返回false则终止遍历
    each(callback){
      const list = this.obj();
      const fn = callback || function(){};
      let key;
      // eslint-disable-next-line no-restricted-syntax
      for(key in list) {
        if( fn.call(this, key, this.get(key)) === false ) {
          break;
        }
      }
        
    },
    // 返回一个对象描述的localStorage副本
    obj(){
      let list={};
      let i=0;
      let n
      let key;
      if( LS.isVirtualObject ){
        list = LS.key(-1);
      }else{
        n = LS.length;
        // eslint-disable-next-line no-plusplus
        for(; i<n; i++){
          key = LS.key(i);
          list[key] = this.get(key);
        }
      }
      return list;
    },
    length : LS.length
  };

  return LS;
}

export default initLS()
