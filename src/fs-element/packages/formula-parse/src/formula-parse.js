/**
 * 编辑公式、校验公式解析
 */

var fn = {
  getValue: function(param){
    return typeof param === 'object' ? this.formula(param) : param;
  },
  /**
   * 消息提示
   */
  message: function(params){
    var result = this.getValue(params[0]);
    return result;
  },
  /**
   * 消息提示
   */
  error: function(params){
    var result = this.getValue(params[0]);
    return result;
  },
  /**
   * 判断表达式
   */
  iif : function(params){
    var result = this.getValue(params[0]);
    var trueValue = this.getValue(params[1]);
    var falseValue = this.getValue(params[2]);
    return result == true ? trueValue : falseValue;
	},
	if : function(params){
    var result = this.getValue(params[0]);
    var trueValue = this.getValue(params[1]);
    var falseValue = this.getValue(params[2]);
    return result == true ? trueValue : falseValue;
  },
  /**
   * 小于
   */
  lt : function(params){
    var lValue = this.getValue(params[0]);
    var rValue = this.getValue(params[1]);
    lValue = isNaN(lValue) ? lValue : parseFloat(lValue);
    rValue = isNaN(rValue) ? rValue : parseFloat(rValue);    
    return lValue < rValue ? true : false;
  },
  /**
   * 大于
   */
  gt : function(params){
    var lValue = this.getValue(params[0]);
    var rValue = this.getValue(params[1]);
    lValue = isNaN(lValue) ? lValue : parseFloat(lValue);
    rValue = isNaN(rValue) ? rValue : parseFloat(rValue);  
    return lValue > rValue ? true : false;
  },
  /**
   * 等于
   */
  eq : function(params){
    var lValue = this.getValue(params[0]);
    var rValue = this.getValue(params[1]);
    return lValue == rValue ? true : false;
  },
  /**
   * 小于等于
   */
  lteq : function(params){
    var lValue = this.getValue(params[0]);
    var rValue = this.getValue(params[1]);
    lValue = isNaN(lValue) ? lValue : parseFloat(lValue);
    rValue = isNaN(rValue) ? rValue : parseFloat(rValue);  
    return lValue <= rValue ? true : false;
  },
  /**
   * 大于等于
   */
  gteq : function(params){
    var lValue = this.getValue(params[0]);
    var rValue = this.getValue(params[1]);
    lValue = isNaN(lValue) ? lValue : parseFloat(lValue);
    rValue = isNaN(rValue) ? rValue : parseFloat(rValue);  
    return lValue >= rValue ? true : false;
  },
  /**
   * 加法运算
   */
  sum: function(params){
    var value1 = this.getValue(params[0]);
    var value2 = this.getValue(params[1]);

    
    value1 = isNaN(value1) ? (value1 +"") : parseFloat(value1);
    value2 = isNaN(value2) ? (value2 +"") : parseFloat(value2);
    return value1 + value2;
  },
  /**
   * 减法运算
   */
  sub: function(params){
    var value1 = this.getValue(params[0]);
    var value2 = this.getValue(params[1]);
    return value1 - value2;
  },
  /**
   * 乘法运算
   */
  mul: function(params){
    var value1 = this.getValue(params[0]);
    var value2 = this.getValue(params[1]);
    return value1 * value2;
  },
  /**
   * 除法运算
   */
  div: function(params){
    var value1 = this.getValue(params[0]);
    var value2 = this.getValue(params[1]);
    return value1 / value2;
  },
  /**
   * 取余数
   */
  res: function(params){
    var value1 = this.getValue(params[0]);
    var value2 = this.getValue(params[1]);
    return value1 % value2;
  },
  /**
   * 设置字段值
   */
  setFieldValue:function(params){
    var fieldName = this.getValue(params[0]);
		var value = this.getValue(params[1]);
		if (fieldName.indexOf('head.') == 0){ // 写入主UI模板
			var headField = fieldName.replace('head.', '');
			if (this.headDataModel){
				this.headDataModel[headField] = value;
			}
		}else if(fieldName.indexOf('beanmap.') == 0){ // 动态增加的字段
			var beanmapField = fieldName.replace('beanmap.', '');
			this.dataModel.beanMap[beanmapField] = value;
		}else{
			this.dataModel[fieldName] = value;
		}
  },
  /**
   * 获取字段值
   */
  getFieldValue: function(params){
		var fieldName = this.getValue(params[0]);
		if (fieldName.indexOf('head.') == 0){ // 写入主UI模板
			var headField = fieldName.replace('head.', '');
			if (this.headDataModel){
				return this.headDataModel[headField];
			}else{
				throw new Error('getFieldValue error, headDataModel is null!');
			}
		}else if(fieldName.indexOf('beanmap.') == 0){ // 动态增加的字段
			var beanmapField = fieldName.replace('beanmap.', '');
			return this.dataModel.beanMap[beanmapField];
		}else{
			return this.dataModel[fieldName];
		}	
  },
  /**
   * 生成0-1之间随机数 
   * */
  rand:function(){
  	return Math.random();
  },
  /**
   * sqrt(x)返回数值x的平方根
   * */
  sqrt:function(params){
  	var x = parseFloat(this.getValue(params[0]));
        x = isNaN(x) && x >=0 ? 0 : x;
        return Math.sqrt(x);
  },
  /**
   * angle 方法可返回从 x 轴到点 (x,y) 之间的角度。
   * */
  angle:function(params){
  	var x = parseFloat(this.getValue(params[0]));
  	var y = parseFloat(this.getValue(params[1]));
        x = isNaN(x) ? 0 : x;
        y = isNaN(y) ? 0 : x;
        return Math.atan2(x, y)
  },
  /**
   * 返回 x 的反双曲正切值. atanh是es6新增的函数 
   * */
  atanh:function(params){
  	var x = parseFloat(this.getValue(params[0]));	
  	return isNaN(x) ? 0 : Math.atanh(x)
  },
  /**
   * log(x)返回给定数n的以十为底的对数  如果指定的 number 为负数，则返回值为 NaN
   * */
   log:function(params){
  	var x = parseFloat(this.getValue(params[0]));	
  	return  Math.log10(x)
  },
  /**
   * 返回x的反双曲余弦值.
   * */
  acosh:function(params){
  	var x = parseFloat(this.getValue(params[0]));
  	return  Math.acosh(x);
  },
  /**
   * min(x, y) 求x,y两者中的最小值 
   * */
  min:function(params){
  	var x = parseFloat(this.getValue(params[0]));
  	var y = parseFloat(this.getValue(params[1]));
  	return x > y ? y : x;
  },
   /**
   * max(x, y) 求x,y两者中的最大值 
   * */
  max:function(params){
  	var x = parseFloat(this.getValue(params[0]));
  	var y = parseFloat(this.getValue(params[1]));
  	return x > y ? x : y;																																																																							
  },
  /**
   * abs(num)求数num的绝对值
   * */
  abs:function(params){
  	var x = parseFloat(this.getValue(params[0]));
  	return Math.abs(x);
  },
  /**
   * toNumber(String st) 将字符串st转换为本解析器可识别的数字,比如toNumber("45.0")将返回一个数字型45.0,经过转化后可参与各种数值计算.
   * */
  tonumber:function(params){
  	return parseFloat(this.getValue(params[0]));
  },
  /**
   * cos(x)返回给定角度x的余弦值
   * */
  cos:function(params){
  	var x = parseFloat(this.getValue(params[0]));
  	return Math.cos(x);
  },
  /**
   * sgn(num) 当数num大于0时,返回1,等于0时,返回0,小于0时返回-1
   * */
   sgn:function(params){
  	var x = parseFloat(this.getValue(params[0]));
  	if(isNaN(x)){
  		return NaN;
  	}
  	else if(x > 0){
  		return 0;
  	}
  	else if(x = 0){
  		return 0;
  	}
  	else {
  		return  -1;
  	}
  },
  /**
   * tan(x)返回给定角度x的正切值
   * */
    tan:function(params){
	  	var x = parseFloat(this.getValue(params[0]));
	  	return Math.tan(x);
	},
	/**
	 * ln(x)返回给定数值x的自然对数
	 * */
	ln:function(params){
	  	var x = parseFloat(this.getValue(params[0]));
	  	return Math.log(x);
	},
	/**
	 * acos(x)返回一个弧度x的反余弦,弧度值在0到Pi之间
	 * */
	acos:function(params){
	  	var x = parseFloat(this.getValue(params[0]));
	  	return Math.acos(x);
	},
	/**
	 * ainh返回x的双曲正弦值.
	 * */
	sinh:function(params){
	  	var x = parseFloat(this.getValue(params[0]));
	  	return Math.sinh(x);
	},
	/**
	 * sin(x)返回给定角度x的正弦值
	 * */
	sin:function(params){
	  	var x = parseFloat(this.getValue(params[0]));
	  	return Math.sin(x);
	},
	/**
	 * atan(x)返回一个弧度x的反正切值,弧度值在-Pi/2到Pi/2之间
	 * */
	atan:function(params){
	  	var x = parseFloat(this.getValue(params[0]));
	  	return Math.atan(x);
	},
	/**
	 * tanh 返回x的双曲正切值.
	 * 
	 * */
	tanh:function(params){
	  	var x = parseFloat(this.getValue(params[0]));
	  	return Math.tanh(x);
	},
	/**
	 * round(double num, int index) 对num保留index位小数(四舍五入)
	 * */
	round:function(params){
	  	var num = parseFloat(this.getValue(params[0]));
	  	var index = parseInt(this.getValue(params[0]));
	  	return isNaN(num) ? 0 :  num.toFixed(index);
	},
	/**
	 * asin(x)返回一个弧度x的反正弦,弧度值在-Pi/2到Pi/2之间
	 * */
	asin:function(params){
	  	var x = parseFloat(this.getValue(params[0]));
	  	return Math.asin(x);
	},
	/**
	 * getresult 计算两个数的和
	 * */
	getresult:function(params){
	  	var x = this.getValue(params[0]);
	  	var y = this.getValue(params[1]);
	  	return a + b;
	},
	/**
	 * int(数字或者字符串) 将变量转换为int类型  字符串返回0
	 * */
	int:function(params){
	  	var x = parseInt(this.getValue(params[0]));
	  	return isNaN(x) ? 0 : x;
	},
	/**
	 * 返回x的双曲余弦值.
	 * */
	cosh:function(params){
		var x = parseFloat(this.getValue(params[0]));
	  	return Math.cosh(x)
	},
	/**
	 * mod取模运算
	 * */
	mod:function(params){
		var x = parseFloat(this.getValue(params[0]));
		var y = parseFloat(this.getValue(params[1]));
		if(isNaN(x) || isNaN(y)){
			return NaN;
		}
		else{
			var c = Math.floor(x/y);
			return x - c*y;
		}
	},
	/**
	 * asinh 返回x的反双曲余弦值
	 * */
    asinh:function(params){
    	var x = parseFloat(this.getValue(params[0]));
    	return Math.asinh(x);
    },
    /**
     * exp(x)e的x次方
     * */
    exp:function(params){
    	var x = parseFloat(this.getValue(params[0]));
    	return Math.exp(x);
    },
    /**
     * 日期相关的函数
     * */
    /**
     * year()求当前年
     * */
    year:function(params){
      var d = new Date();
      return d.getFullYear();
    },
    /**
     * yearof(date)求日期date的年
     * */
    yearof:function(params){
      var param = this.getValue(params[0])
      var date = void 0;
      if(param instanceof  Date){
      	 date =  param;
      }
      else{
      	 date = new Date(param);
      }
      return date.getFullYear();
    },
    /**
     * toTime(str)将字符串格式的时间str转换成UFTime对象
     * */
    toTime:function(params){
    	 var param = this.getValue(params[0])
	     return  (param instanceof  Date) ? param : new Date(param);
    },
    /**
     * toDateTime(str)将字符串格式的时间str转换成UFDateTime对象,比如toDateTime("2006-10-15 21:01:01").
     * */
    toDateTime:function(params){
    	 var param = this.getValue(params[0])
	     return  (param instanceof  Date) ? param : new Date(param);
	     
    },
    todate:function(params){
    	var param = this.getValue(params[0])
	    return  (param instanceof  Date) ? param : new Date(param);
    },
    /**
     * compareDate(date1, date2, field)用于日期比较,
     * 返回两个日期指定时间域的差值,可比较的时间域包括"Y"-比较年;"M"-比较月;"D"-比较日;"H"-比较小时;"m"-比较分钟;"S"-比较秒
     * .比如:compareDate("2005-12-27 23:12:10", toDateTime("2005-12-27 23:12:08"), "S")将返回两个日期相差的秒数.
     * */
    comparedate:function(params){
    	var a = this.getValue(params[0])
    	var b = this.getValue(params[1])
    	var field = this.getValue(params[2])
    	var date1 = (a instanceof  Date) ? a : new Date(a);
    	var date2 = (b instanceof  Date) ? b : new Date(b);
    	if(!date1 || !date2){
    		return 0;
    	}
    	var time1 = date1.getTime();
        var time2 = date2.getTime();
        var differ_time = Math.abs(time1 - time2)/1000; //两个时间相差的秒数
    	switch(field){		
			case "Y":
			  return Math.abs(date1.getFullYear() - date2.getFullYear());
			  break;
			case "M":			  
			  if(date1.getTime() > date2.getTime()) {
		     	 return (date1.getFullYear() - date2.getFullYear())*12 + date1.getMonth()-date2.getMonth();
			  }
			  else{
			  	return (date2.getFullYear() - date1.getFullYear())*12 + date2.getMonth()-date1.getMonth();
			  }	  
			  break;
			case "D":{
				return Math.floor(differ_time/(60*60*24));
				break;
			}
			case "H":{
				return Math.floor(differ_time/(60*60));
				break;
			}
			case "m":{
				return Math.floor(differ_time/60);
			    break;
			}
			case "S":{
				return differ_time;
				break;
			}
			default:{
				return 0;
				break;
			}			 
		}    	
    },
    /**
     * dayOf(date)求日期date的天数
     * */
    dayOf:function(params){
      var param = this.getValue(params[0])
      var date = void 0;
      if(param instanceof  Date){
      	 date =  param;
      }
      else{
      	 date = new Date(param);
      }
	    return date.getDate();
	},
	/**
	 * month(date)得到指定日期内的月份
	 * */
	monof:function(params){
	  var param = this.getValue(params[0])
      var date = void 0;
      if(param instanceof  Date){
      	 date =  param;
      }
      else{
      	 date = new Date(param);
      }
	    return date.getMonth()
	},
	/**
	 * 返回当前日期
	 * */
	date:function(){
		return new Date();
	},
	/**
	 * dateAdd(date1, num, fieldchar)
	 * 返回在指定日期的年、月或者日上增加某个值num,可增加的时间域fieldchar
	 * 包括"Y"-增加年;"M"-增加月;"D"-增加日;"H"-增加小时;"m"-增加分钟;
	 * "S"-增加秒.比如dateAdd("23:13:23", 1, "H")表示对前面的时间增加一小时.
	 * */
	dateadd:function(params){
		var param1 = this.getValue(params[0]);
		var num = parseInt(this.getValue(params[1]));
		var fieldchar = this.getValue(params[2]);
		var date1 = (param1 instanceof  Date) ? param1 : new Date(param1);

		if(isNaN(num) || !date1 || num < 0){
			return new Date();
		}
		var differ_time = 1000;
		var new_date = void 0;
		switch(fieldchar){
			case 'Y':{   
				new_date = new Date(date1.getFullYear()+num,date1.getMonth(),date1.getDate(),date1.getHours(),date1.getMinutes(),date1.getSeconds());
				break;
			}
			case 'M':{
				new_date = new Date(date1.getFullYear(),date1.getMonth()+num,date1.getDate(),date1.getHours(),date1.getMinutes(),date1.getSeconds());
				break;
			}
			case 'D':{
				new_date = new Date(date1.getFullYear(),date1.getMonth(),date1.getDate()+num,date1.getHours(),date1.getMinutes(),date1.getSeconds());
				break;
			}
			case 'H':{
				new_date = new Date(date1.getFullYear(),date1.getMonth(),date1.getDate(),date1.getHours()+num,date1.getMinutes(),date1.getSeconds());
				break;
			}
			case 'm':{
				new_date = new Date(date1.getTime() + differ_time*60*60);				
				break;
			}
			case 'S':{
				new_date = new Date(date1.getTime() + differ_time*60);
				break;
			}
			default:{
				new_date =  date1;
				break;
			}
		}	
		return new_date;
	},
	/**
	 * dateFormat(date, pattern[,language])用于将时间格式化为期望的字符串,其中date可以是时间字符串,也可以是Date对象,
	 * pattern为格式化参数,yyyy表示年,MM表示月,dd表示天数,HH表示小时,mm表示分钟,ss表示秒.
	 * 比如dateFormat("2006-07-04 12:12:12", "日期:yyyy-MM-dd HH:mm:ss") 将返回"日期:2006-07-04 12:12:12".
	 * */
	dateFormat:function(params){
		var param1 = this.getValue(params[0]);
		var fmt = parseInt(this.getValue(params[1]));
		var date1 = (param1 instanceof  Date) ? param1 : new Date(param1);	
	    var o = {         
	    	"M+" : date1.getMonth()+1, //月份         
	    	"d+" : date1.getDate(), //日         
	    	"h+" : date1.getHours()%12 == 0 ? 12 : date1.getHours()%12, //小时         
		    "H+" : date1.getHours(), //小时         
		    "m+" : date1.getMinutes(), //分         
		    "s+" : date1.getSeconds(), //秒         
		    "q+" : Math.floor((date1.getMonth()+3)/3), //季度         
		    "S" : date1.getMilliseconds() //毫秒         
	    };         
		var week = {         
			"0" : "/u65e5",         
			"1" : "/u4e00",         
			"2" : "/u4e8c",         
			"3" : "/u4e09",         
			"4" : "/u56db",         
			"5" : "/u4e94",         
			"6" : "/u516d"        
		};         
	    if(/(y+)/.test(fmt)){         
	        fmt=fmt.replace(RegExp.$1, (date1.getFullYear()+"").substr(4 - RegExp.$1.length));         
	    }         
	    if(/(E+)/.test(fmt)){         
	        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[date1.getDay()+""]);         
	    }         
	    for(var k in o){         
	        if(new RegExp("("+ k +")").test(fmt)){         
	            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));         
	        }         
	    }         
   		return fmt;    		
	},
	/**
	 * 获取当前时间格式是 HH:mm:SS
	 * */
    time:function(){
    	var date = new Date();
	    var o = {               
		    "H+" : date.getHours(), //小时         
		    "m+" : date.getMinutes(), //分         
		    "s+" : date.getSeconds(), //秒         
	    };
	    var fmt = 'HH:mm:ss';	    
        for(var k in o){         
	        if(new RegExp("("+ k +")").test(fmt)){         
	            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));         
	        }         
	    }  
	    return fmt;
    },
    /**
     *  month()求当前月
     * */
    month:function(){
    	var date = new Date();
    	return date.getMonth()+1;
    },
    /**
     * 字符串相关
     * */
    /**
     * 字符串转大写字母
     * */
    toUpperCase:function(params) {
    	var str = this.getValue(params[0]);
    	return str ? str.toUpperCase() : "";
    },
    
    /**
     * toString(obj) 将对象obj转换为本解析器可识别的字符串形式
     * */
    tostring:function(params){
    	var param = this.getValue(params[0]);
    	var str = void 0 ;
    	if(typeof param == "object"){
    		str = JSON.stringify(param);
    	}
    	else{
    		str = param.toString();
    	}
    	return str;
    },
    /**
     * left(st, index) 求字符串st左边前index个字符组成的字符串
     * */
    left:function(params){
    	var str = this.getValue(params[0]);
    	var index = parseInt(this.getValue(params[1]));
    	return isNaN(index) ? str : str.substr(0,index);
    },
    /**
     * endswith(st, end)判断字符串st是否以字符串end结尾
     * */
    endswith:function(params){
    	var str = this.getValue(params[0]);
    	var end = this.getValue(params[1]);
    	if(!str || !end){
    		return false;
    	}
    	return str.substring(str.length-end.length,str.length) == end
    },
    /**
     *  mid(String st, int start, int end) 求字符串st左边前第start个字符至第end个字符之间的字符串
     * */
    mid:function(params){
    	var st = this.getValue(params[0]);
    	var start = parseInt(this.getValue(params[1]));
    	var end = parseInt(this.getValue(params[2]));
    	if(!st || isNaN(start) || isNaN(end)) {
    		return ""
    	}
    	return st.substring(start,end);
    },
    /**
     * length(st) 求字符串st的长度
     * */
    length:function(params){
    	var st = this.getValue(params[0]);
    	return st ? st.length : 0;
    },
    /**
     * 字符串转小写字母
     * */
    tolowercase:function(params) {
    	
    	return str ? str.toLowerCase() : "";
    },
    /**
     * right(String st, int index) 求字符串st右边前index个字符组成的字符串
     * */
    right:function(params){
    	var str = this.getValue(params[0]);
    	var index = parseInt(this.getValue(params[1]));
    	return isNaN(index) ? str : str.substring(str.length-index,str.length);
    },
    /**
     * charat(st,index)得到字符串st中第index个字符
     * */
    charat:function(params){
    	var str = this.getValue(params[0]);
    	var index = parseInt(this.getValue(params[1]));
    	return isNaN(index) ? str : str.charAt(index);
    },
    /**
     * isEmpty(变量)用于判断变量是否为空,包括空串("")及空值(null)
     * */
    isempty:function(params){
    	var str = this.getValue(params[0]);
        return str ? false : true;
    },
    /**
     * lastIndexOf(st1, st2) 判断字符串st1中最后一个字符串st2所在的位置,比如lastIndexOf("HI,UAP2006,UAP","UAP")返回11.
     * */
    lastindexof:function(params){
    	var st1 = this.getValue(params[0]);
    	var st2 = this.getValue(params[1]);
    	if(!st1 || !st2){
    		return 0;
    	}
    	return st1.lastIndexOf(st2)
    },
    indexof:function(params){
		var st1 = this.getValue(params[0]);
    	var st2 = this.getValue(params[1]);
    	if(!st1 || !st2){
    		return 0;
    	}
    	return st1.indexOf(st2)
    },
    /**
     * rightStr(st,len,defaultStr) 
     * 求字符串st右边后len个字符组成的字符串，如果字符串长度小于len，
     * 则用defaultStr补齐,比如rightStr("abc",6,"@")将返回abc@@@.
     * */
    rightstr:function(st,len,defaultStr){
    	var st = this.getValue(params[0]).toString();
    	var len = parseInt(this.getValue(params[1]));
    	var defaultStr = this.getValue(params[0]).toString();
    	if(!st || isNaN(len) || !defaultStr){
    		return "";
    	}
    	else if(st.length >= len){
    		return st.substring(st.length-len,st.length);
    	}
    	else{
    		var  c = parseInt((len - st.length) / defaultStr.length)   //求整数商
    		var  y = (len - st.length) % defaultStr.length
            for(var i=0;i<c;i++){
            	st += defaultStr;
            }
            if(y){
            	st += defaultStr.substring(0,y)
            }
            return st
    	}
    	
    },
     leftstr:function(st,len,defaultStr){
    	var st = this.getValue(params[0]).toString();
    	var len = parseInt(this.getValue(params[1]));
    	var defaultStr = this.getValue(params[0]).toString();
    	if(!st || isNaN(len) || !defaultStr){
    		return "";
    	}
    	else if(st.length >= len){
    		return st.substring(0,len);
    	}
    	else{
    		var  c = parseInt((len - st.length) / defaultStr.length)   //求整数商
    		var  y = (len - st.length) % defaultStr.length
            for(var i=0;i<c;i++){
            	st = defaultStr + st;
            }
            if(y){
            	st = defaultStr.substring(0,y) + st;
            }
            return st
    	}    	
    },
    startswith:function(params){
    	var str = this.getValue(params[0]);
    	var end = this.getValue(params[1]);
    	if(!str || !end){
    		return false;
    	}
    	return str.indexOf(end) == 0;
    },
    /**
     * equalsIgnoreCase(st1, st2)判断忽略大小写字符串st1是否与字符串st2相等
     * */
    equalsignorecase:function(params){
    	var st1 = this.getValue(params[0]);
    	var st2 = this.getValue(params[1]);
    	if(!st1 || !st2){
    		return false;
	    }
    	return st1.toLowerCase() == st2.toLowerCase();
    },
    zeroifnull:function(params){
    	var st1 = this.getValue(params[0]);
    	st1 = isNaN(st1) ? st1 :parseFloat(st1);
    	return st1 ?  st1 : 0;
		},
		/**
		 * 什么都不做，兼容nc公式解析问题
		 */
		donothing: function(params){
			return this.getValue(params[0]);
		},
		/**
		 * 对该行字段做合计
		 */
		summary: function(params){
			var field = params[0].params[0];//this.getValue(params[0]);
			if (this.tableDataModel && Array.isArray(this.tableDataModel)){
				//
				var sum = 0;
				for(var i = 0 ; i < this.tableDataModel.length; i++){
					sum = sum + parseFloat(this.tableDataModel[i][field]);
				}
				return sum;
			}else{
				return 0;
			}
		},
  /**
   * 解析公式符号
   */
  parse: function(name){
    switch (name){
      case '<':
        return 'lt';
      case '>':
        return 'gt';
      case '==':
        return 'eq';
      case '<=':
        return 'lteq';
      case '>=':
        return 'gteq';
      case '+':
        return 'sum';
      case '-':
        return 'sub';
      case '*':
        return 'mul';
      case '/':
        return 'div';
      case '%':
        return 'res';
      default:
        return name;
    }
  },
  /**
   * 公式函数 传入公式 递归处理返回
   */
  formula : function(formulaJson){
		if(formulaJson){
			var name = this.parse(formulaJson['funcname']);
			var params = formulaJson['params'];
			if (this[name]){
				return this[name](params);
			}
		}
  }
}

var Formula = function(dataModel){
	this.dataModel = dataModel;
	this.headDataModel = null;
	this.tableDataModel = null;
}
Formula.prototype = fn;
Formula.prototype.setDataModel = function(dataModel){
  this.dataModel = dataModel;
}

export default {
  Formula: Formula
}