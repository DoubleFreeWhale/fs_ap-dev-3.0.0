import dateUtils from './dateUtil';

var defaultMaskerMeta = {
  'float': {
    precision: 2,
    isThousandth : true,
	  thousandthChar : ',',
	  negative : '-123456'  /* 其他选项有'- 123456','123456-','123456 -','(123456)' */
  },
  'datetime': {
    format: 'YYYY-MM-DD HH:mm:ss',
  },
  'time': {
    format: 'HH:mm'
  },
  'date': {
    format: 'YYYY-MM-DD'
  },
  'currency': {
    precision: 2,
    curSymbol: '￥'
  },
  'percent': {

  },
  'addressbook':{
  	format: 'N-P-C-D-S-Z' /*N-国家Nation, P-省Province, C-市City, D-区县District, S-详细地址Street，Z-邮编Zipcode*/  
  }
};

var _dateRender = function (value, format, type, vueIns) {
  var trueValue = value;
  if (typeof value === 'undefined' || value === null)
    return value
  //value 为 ko对象
  if (typeof value === 'function')
    trueValue = value()
  var maskerMeta = vueIns.$context ? vueIns.$context.getMaskerMeta(type) : defaultMaskerMeta[type];
  if (typeof format != 'undefined')
    maskerMeta.format = format
  var maskerValue = dateUtils.format(trueValue, maskerMeta.format);
  return maskerValue;
}

var _traceBackRender = function(value, vueIns) {
  if (typeof value === 'undefined' || value === null) {
    return value;
  }
  const oneMinute = 60 * 1000,
        oneHour = oneMinute * 60,
        threeHours = oneHour * 3,
        oneDay = oneHour * 24,
        oneWeek = oneDay * 7,
        now = new Date(),
        todayStr = now.toDateString(),
        nowTime = now.getTime(),
        target = new Date(value),
        targetDayStr = target.toDateString(),
        targetTime = target.getTime(),
        targetHours = target.getHours(),
        targetMinutes = target.getMinutes(),
        targetFormatedMinutes = targetMinutes > 9 ? targetMinutes : `0${targetMinutes}`,
        targetFormatedHours = targetHours > 12 ? targetHours - 12 : targetHours,
        yesterdayTime = new Date(todayStr).getTime() - oneDay,
        yesterday = new Date(yesterdayTime),
        timeDiff = nowTime - targetTime,
        noonPrefix = targetHours < 12 || (targetHours === 12 && targetMinutes === 0) ? '上午' : '下午',
        formatedHoursAndMinutes = noonPrefix + targetFormatedHours + ':' + targetFormatedMinutes;
  // 当前时间之后, 返回默认时间
  if (timeDiff < 0) {
    return _dateRender(value, undefined, 'time', vueIns);
  }
  // 1分钟以内
  if (timeDiff < oneMinute) {
    return '现在';
  }
  // 1小时以内
  if (timeDiff < oneHour) {
    return Math.floor(timeDiff / oneMinute) + ' 分钟前';
  }
  // 当日
  if (targetDayStr === todayStr) {
    // 3小时以内
    if (timeDiff < threeHours) {
      return Math.floor(timeDiff / oneHour) + ' 小时前';
    }
    // 3小时以上
    return formatedHoursAndMinutes;
  }
  // 跨1天(昨天0-24时)
  if (targetTime > yesterdayTime) {
    return '昨天 ' + formatedHoursAndMinutes;
  }
  // 一周内
  if (targetTime > nowTime - oneWeek) {
    return '周' + '日一二三四五六'.charAt(target.getDay()) + ' ' + formatedHoursAndMinutes;
  }
  return _dateRender(value, 'YYYY/MM/DD', 'date', vueIns);
}

export default {
  /**
   * 处理数据显示格式
   */

  floatRender: function (value, precision) {
    var trueValue = value;
    if (typeof value === 'undefined' || value === null)
      return value;
    var maskerMeta = this.$context ? this.$context.getMaskerMeta('float') :defaultMaskerMeta['float'];
    if (typeof precision === 'number')
      maskerMeta.precision = precision;
    var formater = new u.NumberFormater(maskerMeta.precision);
    var masker = new NumberMasker(maskerMeta);
    return masker.format(formater.format(trueValue)).value;
  },

  integerRender: function (value) {
    var trueValue = value;
    if (typeof value === 'undefined' || value === null)
      return value;
    return trueValue
  },


  dateRender: function (value, format) {
    return _dateRender(value, format, 'date', this);
  },

  dateTimeRender: function (value, format) {
    return _dateRender(value, format, 'datetime', this);
  },

  timeRender: function (value, format) {
    return _dateRender(value, format, 'time', this);
  },

  traceBackRender: function(value) {
    return _traceBackRender(value, this);
  },

  percentRender: function (value) {
    var trueValue = value
    if (typeof value === 'undefined' || value === null)
      return value
    //value 为 ko对象
    if (typeof value === 'function')
      trueValue = value()
    var maskerMeta = this.$context ? this.$context.getMaskerMeta('percent') : defaultMaskerMeta['percent']
    var masker = new PercentMasker(maskerMeta);
    var maskerValue = masker.format(trueValue);
    return (maskerValue && maskerValue.value) ? maskerValue.value : '';
  },

  dateToUTCString: function (date) {
    if (!date) return ''
    if (date.indexOf("-") > -1)
      date = date.replace(/\-/g, "/");
    var utcString = Date.parse(date);
    if (isNaN(utcString)) return "";
    return utcString;
  }
}