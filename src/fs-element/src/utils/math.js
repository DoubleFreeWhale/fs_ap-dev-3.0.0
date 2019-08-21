function accDiv(arg1, arg2) {
  if(typeof arg1 === 'undefined' || arg1 === null || typeof arg2 === 'undefined' || arg2 === null)
    return;
  let t1 = 0,
    t2 = 0,
    r1, r2;
  try {
    t1 = arg1.toString().split(".")[1].length
  } catch (e) {}
  try {
    t2 = arg2.toString().split(".")[1].length
  } catch (e) {}
  r1 = Number(arg1.toString().replace(".", ""))
  r2 = Number(arg2.toString().replace(".", ""))
  // return r1 / r2 * pow(10, t2 - t1)
  return accMul((r1 / r2), Math.pow(10, t2 - t1));
}
//乘法 
function accMul(arg1, arg2) {
  if(typeof arg1 === 'undefined' || arg1 === null || typeof arg2 === 'undefined' || arg2 === null)
    return;
  let m = 0,
    s1 = arg1.toString(),
    s2 = arg2.toString();
  try {
    m += s1.split(".")[1].length
  } catch (e) {}
  try {
    m += s2.split(".")[1].length
  } catch (e) {}
  return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
}
//加法  
function accAdd(arg1, arg2) {
  if(typeof arg1 === 'undefined' || arg1 === null || typeof arg2 === 'undefined' || arg2 === null)
    return;
  let r1, r2, m;
  try {
    r1 = arg1.toString().split(".")[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split(".")[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2))
  return (arg1 * m + arg2 * m) / m
}
//减法  
function accSub(arg1, arg2) {
  if(typeof arg1 === 'undefined' || arg1 === null || typeof arg2 === 'undefined' || arg2 === null)
    return;
  let r1, r2, m, n;
  try {
    r1 = arg1.toString().split(".")[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split(".")[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2));
  n = (r1 >= r2) ? r1 : r2;
  return ((arg1 * m - arg2 * m) / m).toFixed(n);
}

function setformat(number, decimals, separator, negativeFormat) {
  var appContext = this.$context && this.$context.getMaskerMeta("float");
  if (!decimals && appContext && appContext["precision"]) {
    decimals = parseInt(this.appContext["precision"]);
  }
  if (!separator && appContext && appContext["isThousandth"]) {
    separator = this.appContext["thousandthChar"];
  }
  if (!negativeFormat && appContext && appContext["negative"]) {
    negativeFormat = this.appContext["negative"];
  }

  if (isNaN(number)) {
    return "";
  }
  if (!number && number !== 0 && number !== "0") {
    return "";
  }
  let negative = false;
  number = parseFloat(number);
  if (number < 0) {
    negative = true;
    number = -1 * number;
  }
  let returnValue = number;
  if (!decimals && decimals !== 0) {
    var index = (number + "").indexOf(".");
    var l = (number + "").length;
    decimals = index > -1 ? l - index - 1 : 0;
  }
  if (separator) {
    const digitsRE = /(\d{3})(?=\d)/g;
    const stringified = number.toFixed(decimals);
    const int = decimals ? stringified.slice(0, -1 - decimals) : stringified;
    const i = int.length % 3;
    const head =
      i > 0 ? int.slice(0, i) + (int.length > 3 ? separator : "") : "";
    const float =
      decimals ? stringified.slice(-1 - decimals) : "";
    const sign = number < 0 ? "-" : "";
    returnValue =
      sign +
      head +
      int.slice(i).replace(digitsRE, "$1" + separator) +
      float;
  } else if (!separator) {
    returnValue = isNaN(number) ?
      "" :
      decimals || decimals === 0 ? number.toFixed(decimals) : number;
  }
  if (negative) {
    switch (negativeFormat) {
      case '-123456':
        returnValue = "-" + returnValue;
        break;
      case '- 123456':
        returnValue = '- ' + returnValue;
        break;
      case '123456-':
        returnValue = returnValue + '-';
        break;
      case '123456 -':
        returnValue = returnValue + ' -';
        break;
      case '(123456)':
        returnValue = '(' + returnValue + ')';
        break;
      default:
        returnValue = "-" + returnValue;
    }
  }
  return returnValue;
}

export default {
  accDiv,
  accMul,
  accAdd,
  accSub,
  setformat
}