//获取样式
function getCss(obj) {
    return obj.currentStyle || getComputedStyle(obj);
}
//getCss(obj).属性

//requestAnimationFrame
window.requestAnimationFrame = window.requestAnimationFrame || function (fn) {
    return setTimeout(fn , 1000/60)
};
window.cancelAnimationFrame = window.cancelAnimationFrame || clearTimeout;

//时间的封装
function time() {
    var now = new Date();

    var Year = now.getFullYear(),
        Mouth = now.getMonth(),
        Daily = now.getDate(),
        Day = now.getDay(),//星期几
        Hours = now.getHours(),
        Minutes = now.getMinutes(),
        Seconds = now.getSeconds();

    //处理星期几，和月份,日,秒
    Day = "星期"+["日","一","二","三","四","五","六"][Day];
    Mouth = zero(Mouth+1);
    Daily = zero(Daily);
    Seconds = zero(Seconds);

    return Year+","+Mouth+","+Daily+","+Hours+":"+Minutes+":"+Seconds;

    //加零
    function zero(a) {
        return a<10?"0"+a:a;
    }
}

//倒计时封装  指定时间，几年几月几日几时间.例如2018,5,1,10。2018年5月1号上午10点，对象装入倒计时文本
function countDown(year,mouth,date,hours,text) {
    var targetDate = new Date(year,mouth-1,date,hours);

    var d,h,m,s;
    setInterval(fn() , 1000)
    function fn() {
        var nowHours = new Date();
        //转换毫秒
        var mins = targetDate - nowHours;
        //转换为秒.0的格式
        mins = Math.floor(mins/1000);

         d = Math.floor(mins/60/60/24);//天
         h = Math.floor(mins/60/60)%24;//小时
         m = Math.floor(mins/60)%60;//分
         s = mins%60;//秒

        d = zero(d);
        h = zero(h);
        m = zero(m);
        s = zero(s);

        text.innerHTML = d+"天"+h+"时"+m+"分"+s+"秒";
        return fn;
    }
    //加零
    function zero(a) {
        return a<10?"0"+a:a;
    }
}

//运动框架，时间版。对象，json格式的属性对应目标值，时间（可选），运动函数默认linear
function move( obj , json , d , fn ) {
    switch (typeof d){
        case "undefined":
            d = 300;
            fn = "linear";
            break;
        case "number":
            fn = fn || "linear";
            break;
        case "string":
            fn = d;
            d = 300;
            break;
    }
    var Tween = {
            linear: function (t, b, c, d){  //匀速
                return c*t/d + b;   //  t/d = prop;
            },
            easeIn: function(t, b, c, d){  //加速曲线
                return c*(t/=d)*t + b;
            },
            easeOut: function(t, b, c, d){  //减速曲线
                return -c *(t/=d)*(t-2) + b;
            },
            easeBoth: function(t, b, c, d){  //加速减速曲线
                if ((t/=d/2) < 1) {
                    return c/2*t*t + b;
                }
                return -c/2 * ((--t)*(t-2) - 1) + b;
            },
            easeInStrong: function(t, b, c, d){  //加加速曲线
                return c*(t/=d)*t*t*t + b;
            },
            easeOutStrong: function(t, b, c, d){  //减减速曲线
                return -c * ((t=t/d-1)*t*t*t - 1) + b;
            },
            easeBothStrong: function(t, b, c, d){  //加加速减减速曲线
                if ((t/=d/2) < 1) {
                    return c/2*t*t*t*t + b;
                }
                return -c/2 * ((t-=2)*t*t*t - 2) + b;
            },
            elasticIn: function(t, b, c, d, a, p){  //正弦衰减曲线（弹动渐入）
                if (t === 0) {
                    return b;
                }
                if ( (t /= d) === 1 ) {
                    return b+c;
                }
                if (!p) {
                    p=d*0.3;
                }
                if (!a || a < Math.abs(c)) {
                    a = c;
                    var s = p/4;
                } else {
                    var s = p/(2*Math.PI) * Math.asin (c/a);
                }
                return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
            },
            elasticOut: function(t, b, c, d, a, p){    //正弦增强曲线（弹动渐出）
                if (t === 0) {
                    return b;
                }
                if ( (t /= d) === 1 ) {
                    return b+c;
                }
                if (!p) {
                    p=d*0.3;
                }
                if (!a || a < Math.abs(c)) {
                    a = c;
                    var s = p / 4;
                } else {
                    var s = p/(2*Math.PI) * Math.asin (c/a);
                }
                return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
            },
            elasticBoth: function(t, b, c, d, a, p){
                if (t === 0) {
                    return b;
                }
                if ( (t /= d/2) === 2 ) {
                    return b+c;
                }
                if (!p) {
                    p = d*(0.3*1.5);
                }
                if ( !a || a < Math.abs(c) ) {
                    a = c;
                    var s = p/4;
                }
                else {
                    var s = p/(2*Math.PI) * Math.asin (c/a);
                }
                if (t < 1) {
                    return - 0.5*(a*Math.pow(2,10*(t-=1)) *
                        Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
                }
                return a*Math.pow(2,-10*(t-=1)) *
                    Math.sin( (t*d-s)*(2*Math.PI)/p )*0.5 + c + b;
            },
            backIn: function(t, b, c, d, s){     //回退加速（回退渐入）
                if (typeof s === 'undefined') {
                    s = 1.70158;
                }
                return c*(t/=d)*t*((s+1)*t - s) + b;
            },
            backOut: function(t, b, c, d, s){
                if (typeof s === 'undefined') {
                    s = 3.70158;  //回缩的距离
                }
                return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
            },
            backBoth: function(t, b, c, d, s){
                if (typeof s === 'undefined') {
                    s = 1.70158;
                }
                if ((t /= d/2 ) < 1) {
                    return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
                }
                return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
            },
            bounceIn: function(t, b, c, d){    //弹球减振（弹球渐出）
                return c - Tween['bounceOut'](d-t, 0, c, d) + b;
            },
            bounceOut: function(t, b, c, d){
                if ((t/=d) < (1/2.75)) {
                    return c*(7.5625*t*t) + b;
                } else if (t < (2/2.75)) {
                    return c*(7.5625*(t-=(1.5/2.75))*t + 0.75) + b;
                } else if (t < (2.5/2.75)) {
                    return c*(7.5625*(t-=(2.25/2.75))*t + 0.9375) + b;
                }
                return c*(7.5625*(t-=(2.625/2.75))*t + 0.984375) + b;
            },
            bounceBoth: function(t, b, c, d){
                if (t < d/2) {
                    return Tween['bounceIn'](t*2, 0, c, d) * 0.5 + b;
                }
                return Tween['bounceOut'](t*2-d, 0, c, d) * 0.5 + c*0.5 + b;
            }
        },//运动方式
        sTime = new Date,//初始时间
        b = {},//初始值
        c = {},//变化值
        gCss = getCss(obj),
        TweenFn = Tween[fn];
    for (var attr in json) {
        if ( json.hasOwnProperty(attr) ){//判断json里面有没有attr的属性
            b[attr] = parseFloat( gCss[attr] );
            c[attr] = json[attr] - b[attr];
        }
    }
    ~function m() {
        var t = new Date - sTime;//经过了多长时间
        t >= d?t = d:requestAnimationFrame(m);
        for (var attr in json) {
            if ( json.hasOwnProperty(attr) ){
                if ( attr.toLowerCase() === "opacity" ){
                    var val = TweenFn(t,b[attr],c[attr],d);
                    obj.style.opacity = val;
                    //兼容ie低版本，滤镜阿尔法取值0-100
                    obj.style.filter = "alpha(opacity="+val*100+")";
                }else{
                    obj.style[attr] = TweenFn(t,b[attr],c[attr],d) + 'px';
                }
            }
        }
    }();
    function getCss(obj) {
        return obj.currentStyle || getComputedStyle(obj);
    }
}

//事件绑定的封装    节点对象 ，事件名 ，事件函数
function addEvent( obj , eName , eFn ){
    function fn(e){
        e = e || window.event;
        eFn.call(obj,e);
    }
    if ( !obj.Event ){
        obj.Event = {};
    }
    if ( !obj.Event[eName] ){
        obj.Event[eName] = [];
    }
    obj.Event[eName].push(fn);//为了方便解绑
    if ( document.addEventListener ){
        obj.addEventListener(eName , fn , false);
    }else{
        obj.attachEvent( "on"+eName , fn );
    }
    return fn;
}

//解绑
function removeEvent( obj , eName , fn ){

    if ( obj.Event && obj.Event[eName] ){
        var arr = obj.Event[eName];
        if ( fn ){
            var index = -1;
            for (var i = 0,length=arr.length; i < length; i++) {
                if ( arr[i] === fn ){
                    index = i;
                    break;
                }
            }
            if ( index !== -1 ){
                obj.Event[eName].splice(index,1);
                if ( document.addEventListener ){
                    obj.removeEventListener(eName , fn , false);
                }else{
                    obj.detachEvent( "on"+eName , fn );
                }
            }
        }else{
            if ( arr.length ){
                for (i = 0,length=arr.length; i < length; i++) {
                    if ( document.addEventListener ){
                        obj.removeEventListener(eName , arr[i] , false);
                    }else{
                        obj.detachEvent( "on"+eName , arr[i] );
                    }
                }
            }
            obj.afeiEvent[eName] = [];
        }
    }

}

//滚轮事件封装
// addWheelEvent(oBox , function (e , d) {
   // console.log( d );//判断d的正负就知道滚轮的方向
//});
function addWheelEvent( obj , eFn ){
    document.addEventListener?obj.addEventListener(document.createElement("div").onmousewheel===null?"mousewheel":"DOMMouseScroll",fn,false):obj.attachEvent("onmousewheel",fn);
    function fn(e){
        if ( eFn.call(obj , e = e || window.event , e.wheelDelta/120 || -e.detail/3) === false ){
            e.preventDefault && e.preventDefault();
            return false;
        }
    }
}

//常用正则
/*
           QQ号：
               非0数字开头
               5-11位
               纯数字
            */
var qq = /^[1-9]\d{4,10}$/;


/*
手机号：
    1开头
    第二位3-9
    11位

 */
var tel = /^1[3-9]\d{9}$/;  //手机号

/*
用户名：
    \w
    必须以字母开头
    6 <= n <= 16
 */
var user = /^[a-z]\w{5,15}$/i;

/*
密码：
    ~!@#$%^&*()+{}[]:"|',.?*-+/
    6 <= n <= 16
 */
var pwd = /^[\w~!@#$%^&*()+{}[\]:"|',.?\-/]{6,16}$/;

/*
邮箱：
    xxxxx@xxx.com.cn
    前面的用户名 \w
 */
var mail = /^[1-9a-z]\w+@[0-9a-z\-]{2,}(\.[a-z]{2,}){1,2}$/i;

/*
身份证：
    18位
    不能以0开头
    最后一位可能是x
 */
var IDCard = /^[1-9]\d{5}(19\d{2}|20[01]\d)(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])\d{3}[\dxX]$/;

//ajax封装
/*参数json所需要的属性：
* type ：string 可缺省（默认 "GET"），代表请求的方式
* url ：string 不可缺省，代表请求的地址
* aysn ：boolean 可缺省（默认 true），代表是否异步
* data ：json 可缺省，代表需要传递的数据
* success : function 可缺省，代表成功的回调函数，该函数第一个形参代表后台返回的数据
* error ：function 可缺省，代表失败的回调函数，该函数的第一个形参代表请求的HTTP状态码
*/
function ajax( json ){
    var type = json.type || "GET",
        url = json.url,
        aysn = json.aysn !== false,
        data = json.data,
        success = json.success,
        error = json.error;
    //将json格式的data处理成string格式
    data = data && (function () {
        var dataStr = "";
        for (var key in data) dataStr += key + "=" + data[key] + "&";
        return dataStr;
    })();
    //让get请求的url后面跟上数据
    if ( /get/i.test(type) ){
        url += "?" + (data||"") + "_="+new Date().getTime();//解决缓存;
        data = undefined;
    }
    //ajax主体
    var xhr = new XMLHttpRequest();
    xhr.open( type , url , aysn );
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send( data );
    xhr.onreadystatechange = function () {
        if ( this.readyState === 4 ){
            var status = this.status;
            if ( status >= 200 && status < 300 ){
                success && success( this.responseText );
            }else{
                error && error( status );
            }
        }
    };
}

//cookie封装 set方式中 数据json格式，时间多少天
var cookie = {
    Set : function ( dataJson , day ) {
        var d = new Date(new Date().getTime()+day*24*60*60*1000).toUTCString();
        for (var key in dataJson)document.cookie = key+"="+dataJson[key]+"; expires="+d;
    },
    Get : function (attr) {
        var value = document.cookie.match( new RegExp( "\\b"+attr+"=([^;]+)(;|$)" ) );
        return value?value[1]:"";
    },
    Remove : function (attr) {
        var obj = {};
        obj[attr] = "";
        this.Set(obj, -1);
    }
};


//无缝轮播的封装