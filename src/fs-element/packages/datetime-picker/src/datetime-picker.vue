<template>
  <mt-popup v-model="visible" position="bottom" class="mint-datetime">
    <mt-picker
      :slots="dateSlots"
      @change="onChange"
      :visible-item-count="visibleItemCount"
      class="mint-datetime-picker"
      ref="picker"
      :tipBtn="tipBtn"
      show-toolbar>
      <span class="mint-datetime-action mint-datetime-cancel" :class="{'mint-datetime-mincancel':tipBtn}" @click="visible = false;$emit('cancel')">{{ cancelText }}</span>
      <span v-if="tipBtn" class="mint-datetime-action" :class="{'mint-datetime-tips':tipBtn}">{{tipText}}</span>
      <span class="mint-datetime-action mint-datetime-confirm" :class="{'mint-datetime-minconfirm':tipBtn}" @click="confirm">{{ confirmText }}</span>
    </mt-picker>
  </mt-popup>
</template>

<style lang="css">
  /* @import "../../../src/style/var.css";

  @component-namespace mint {
    @component datetime {
      width: 100%;

      .picker-slot-wrapper, .picker-item {
        backface-visibility: hidden;
      }

      .picker-toolbar {
        border-bottom: solid 1px #eaeaea;
      }

      @descendent action {
        display: inline-block;
        width: 50%;
        text-align: center;
        line-height: 40px;
        font-size: 12px;
        color:#2d2d2d;
      }
      @descendent tips{
        float: left;
        width:40%;
        padding:0;
      }

      @descendent cancel {
        float: left;
        text-align:left;
        width:48%;
        padding-left:2%;
      }

      @descendent confirm {
        float: right;
        text-align:right;
        width:48%;
        padding-right:2%;
        color:#E60012;
      }
      @descendent minconfirm{
         width:28%; 
      }
      @descendent mincancel{
        width:28%;
      }
    }
  }  */
</style>
<script type="text/babel">
  import picker from 'ifbp-element/packages/picker/index.js';
  import { formatDate, parseDate, equalDate, isDate } from './util';
  import popup from 'ifbp-element/packages/popup/index.js';
  if (process.env.NODE_ENV === 'component') {
    require('ifbp-element/packages/picker/style.css');
    require('ifbp-element/packages/popup/style.css');
  }

  const FORMAT_MAP = {
    Y: 'year',
    M: 'month',
    D: 'date',
    H: 'hour',
    m: 'minute',
    s: 'second'
  };
  const DEFAULT_FORMATS = {
    date: 'yyyy-MM-dd',
    month: 'yyyy-MM',
    datetime: 'yyyy-MM-dd HH:mm:ss',
    time: 'HH:mm:ss',
    // week: 'yyyywWW',
    // timerange: 'HH:mm:ss',
    // daterange: 'yyyy-MM-dd',
    // datetimerange: 'yyyy-MM-dd HH:mm:ss',
    year: 'yyyy'
  };
  const HAVE_TRIGGER_TYPES = [
    'date',
    'datetime',
    'time',
    'time-select',
    // 'week',
    'month',
    'year'
    // 'daterange',
    // 'timerange',
    // 'datetimerange'
  ];
  const DATE_FORMATTER = function(value, format) {
    return formatDate(value, format);
  };
  const DATE_PARSER = function(text, format) {
    return parseDate(text, format);
  };
  const TYPE_VALUE_RESOLVER_MAP = {
    default: {
      formatter(value) {
        if (!value) return '';
        return '' + value;
      },
      parser(text) {
        if (text === undefined || text === '') return null;
        return text;
      }
    },
    date: {
      formatter: DATE_FORMATTER,
      parser: DATE_PARSER
    },
    datetime: {
      formatter: DATE_FORMATTER,
      parser: DATE_PARSER
    },

    time: {
      formatter: DATE_FORMATTER,
      parser: DATE_PARSER
    },
    month: {
      formatter: DATE_FORMATTER,
      parser: DATE_PARSER
    },
    year: {
      formatter: DATE_FORMATTER,
      parser: DATE_PARSER
    },
    number: {
      formatter(value) {
        if (!value) return '';
        return '' + value;
      },
      parser(text) {
        let result = Number(text);

        if (!isNaN(text)) {
          return result;
        } else {
          return null;
        }
      }
    }
  };
  const compareTime = function(time1, time2) {
    ;
    const value1 = parseTime(time1);
    const value2 = parseTime(time2);

    const minutes1 = value1.minutes + value1.hours * 60;
    const minutes2 = value2.minutes + value2.hours * 60;

    if (minutes1 === minutes2) {
      return 0;
    }

    return minutes1 > minutes2 ? 1 : -1;
  };
  const parseTime = function(time) {
    const values = ('' || time).split(':');
    if (values.length >= 2) {
      const hours = parseInt(values[0], 10);
      const minutes = parseInt(values[1], 10);

      return {
        hours,
        minutes
      };
    }
    /* istanbul ignore next */
    return null;
  };
  const formatTime = function(time) {
    return (time.hours < 10 ? '0' + time.hours : time.hours) + ':' + (time.minutes < 10 ? '0' + time.minutes : time.minutes);
  };

  const nextTime = function(time, step) {
    const timeValue = parseTime(time);
    const stepValue = parseTime(step);

    const next = {
      hours: timeValue.hours,
      minutes: timeValue.minutes
    };

    next.minutes += stepValue.minutes;
    next.hours += stepValue.hours;

    next.hours += Math.floor(next.minutes / 60);
    next.minutes = next.minutes % 60;

    return formatTime(next);
  };
  const PLACEMENT_MAP = {
    left: 'bottom-start',
    center: 'bottom-center',
    right: 'bottom-end'
  };
  export default {
    name: 'mt-datetime-picker',
    props: {
      cancelText: {
        type: String,
        default: '取消'
      },
      confirmText: {
        type: String,
        default: '确定'
      },
      tipText:{
        type:String,
        default:"开始时间"
      },
      format: String,
      type: {
        type: String,
        default: 'date'
      },
      startDate: {
        type: Date,
        default() {
          return new Date(new Date().getFullYear() - 50, 0, 1);
        }
      },
      endDate: {
        type: Date,
        default() {
          return new Date(new Date().getFullYear() + 50, 11, 31);
        }
      },
      startHour: {
        type: Number,
        default: 0
      },
      endHour: {
        type: Number,
        default: 23
      },
      start: {
        type: String,
        default: '09:00'
      },
      end: {
        type: String,
        default: '18:00'
      },
      step: {
        type: String,
        default: '00:30'
      },
      yearFormat: {
        type: String,
        default: '{value}'
      },
      monthFormat: {
        type: String,
        default: '{value}'
      },
      dateFormat: {
        type: String,
        default: '{value}'
      },
      hourFormat: {
        type: String,
        default: '{value}'
      },
      minuteFormat: {
        type: String,
        default: '{value}'
      },
      secondFormat: {
        type: String,
        default: '{value}'
      },
      visibleItemCount: {
        type: Number,
        default: 7
      },
      rangeSeparator: {
        default: ' - '
      },
      align: {
        type: String,
        default: 'left'
      },
      value: null,
      tipBtn:{
        type:Boolean,
        default:false
      }
    },

    data() {
      return {
        visible: false,
        startYear: null,
        endYear: null,
        startMonth: 1,
        endMonth: 12,
        startDay: 1,
        endDay: 31,
        currentValue: null,
        selfTriggered: false,
        dateSlots: [],
        shortMonthDates: [],
        longMonthDates: [],
        febDates: [],
        leapFebDates: [],
        begainDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), new Date().getHours(), new Date().getMinutes(), new Date().getSeconds())
      };
    },

    components: {
      'mt-picker': picker,
      'mt-popup': popup
    },

    methods: {
      open() {
        this.visible = true;
      },

      close() {
        this.visible = false;
      },

      isLeapYear(year) {
        return (year % 400 === 0) || (year % 100 !== 0 && year % 4 === 0);
      },

      isShortMonth(month) {
        return [4, 6, 9, 11].indexOf(month) > -1;
      },

      getMonthEndDay(year, month) {
        if (this.isShortMonth(month)) {
          return 30;
        } else if (month === 2) {
          return this.isLeapYear(year) ? 29 : 28;
        } else {
          return 31;
        }
      },
      getTrueValue(formattedValue) {
        if (!formattedValue) return;
        while (isNaN(parseInt(formattedValue, 10))) {
          formattedValue = formattedValue.slice(1);
        }
        return parseInt(formattedValue, 10);
      },

      getValue(values) {
        let value;
        if (this.type === 'time') {
          // value = values.map(value => ('0' + this.getTrueValue(value)).slice(-2)).join(':');
          // console.log(typeof value);
          let hour = this.typeStr.indexOf('H') > -1 ? this.getTrueValue(values[this.typeStr.indexOf('H')]) : 0;
          let minute = this.typeStr.indexOf('m') > -1 ? this.getTrueValue(values[this.typeStr.indexOf('m')]) : 0;
          let second = this.typeStr.indexOf('s') > -1 ? this.getTrueValue(values[this.typeStr.indexOf('s')]) : 0;
          value = new Date(0, 0, 0, hour, minute, second);
        } else {
          if (this.type === 'year') {
            let year = this.getTrueValue(values[0]);
            value = new Date(year, 0);
          } else if (this.type === 'month') {
            let year = this.getTrueValue(values[0]);
            let month = this.getTrueValue(values[1]);
            value = new Date(year, month - 1);
          } else if (this.type === 'time-select') {
            value = values[0];
          } else {
            let year = this.getTrueValue(values[0]);
            let month = this.getTrueValue(values[1]);
            let date = this.getTrueValue(values[2]);
            let maxDate = this.getMonthEndDay(year, month);
            if (date > maxDate) {
              this.selfTriggered = true;
              date = 1;
            }
            let hour = this.typeStr.indexOf('H') > -1 ? this.getTrueValue(values[this.typeStr.indexOf('H')]) : 0;
            let minute = this.typeStr.indexOf('m') > -1 ? this.getTrueValue(values[this.typeStr.indexOf('m')]) : 0;
            let second = this.typeStr.indexOf('s') > -1 ? this.getTrueValue(values[this.typeStr.indexOf('s')]) : 0;

            value = new Date(year, month - 1, date, hour, minute, second);
          }

        }
        return value;
      },
      getFormatValue() {
        var value;
        if(this.currentValue instanceof Object){
          value = this.currentValue.getTime();
        } else {
          value = this.currentValue;
        }
        // const value = this.currentValue;
        if (!value) return;
        const formatter = (
          TYPE_VALUE_RESOLVER_MAP[this.type] ||
          TYPE_VALUE_RESOLVER_MAP['default']
        ).formatter;
        const format = DEFAULT_FORMATS[this.type];
        return formatter(value, this.format || format, this.rangeSeparator);
      },
      onChange(picker) {

        let values = picker.$children.filter(child => child.currentValue !== undefined).map(child => child.currentValue);
        if (this.selfTriggered) {
          this.selfTriggered = false;
          return;
        }
        this.currentValue = this.getValue(values);
        this.handleValueChange();
      },

      fillValues(type, start, end) {
        let values = [];
        for (let i = start; i <= end; i++) {
          if (i < 10) {
            values.push(this[`${FORMAT_MAP[type]}Format`].replace('{value}', ('0' + i).slice(-2)));
          } else {
            values.push(this[`${FORMAT_MAP[type]}Format`].replace('{value}', i));
          }
        }
        return values;
      },

      pushSlots(slots, type, start, end) {
        slots.push({
          flex: 1,
          values: this.fillValues(type, start, end)
        });
      },

      generateSlots() {
        let dateSlots = [];
        const INTERVAL_MAP = {
          Y: this.rims.year,
          M: this.rims.month,
          D: this.rims.date,
          H: this.rims.hour,
          m: this.rims.min,
          s: this.rims.sec
          // S: this.rims.selectTime
        };
        let typesArr = this.typeStr.split('');
        if (typesArr.length === 1 && typesArr[0] === 'T') {
          var selectTimeValues = this.getSelectTimeValues();
          dateSlots.push({
            flex: 1,
            values: selectTimeValues
          });
        }
        typesArr.forEach(type => {
          if (INTERVAL_MAP[type]) {
            // null 没有对象调用这个方法，只需要用这个方法帮我运算,得到返回的结果就行
            this.pushSlots.apply(null, [dateSlots, type].concat(INTERVAL_MAP[type]));
          }
        });
        if (this.typeStr === 'Hms') {
          dateSlots.splice(1, 0, {
            divider: true,
            content: ':'
          });
        }
        this.dateSlots = dateSlots;
        this.handleExceededValue();
      },

      getSelectTimeValues() {
        const start = this.start;
        const end = this.end;
        const step = this.step;
        const result = [];
        if (start && end && step) {
          let current = start;
          while (compareTime(current, end) <= 0) {
            ;
            result.push(current);

            current = nextTime(current, step);
          }
        }

        return result;

      },

      handleExceededValue() {
        let values = [];
        if (this.type === 'time') {
          // const currentValue = this.currentValue.split(':');
          values = [
            // this.hourFormat.replace('{value}', currentValue[0]),
            // this.minuteFormat.replace('{value}', currentValue[1])
            this.hourFormat.replace('{value}', ('0' + this.getHour(this.currentValue)).slice(-2)),
            this.minuteFormat.replace('{value}', ('0' + this.getMinute(this.currentValue)).slice(-2)),
            this.secondFormat.replace('{value}', ('0' + this.getSecond(this.currentValue)).slice(-2))
          ];

        } else {
          if (this.type === 'year') {
            values = [
              this.yearFormat.replace('{value}', this.getYear(this.currentValue))
            ];
          } else if (this.type === 'month') {
            values = [
              this.yearFormat.replace('{value}', this.getYear(this.currentValue)),
              this.monthFormat.replace('{value}', ('0' + this.getMonth(this.currentValue)).slice(-2))
            ];
          } else if (this.type === 'time-select') {
            values = [
              this.currentValue
            ];
          } else {
            values = [
              this.yearFormat.replace('{value}', this.getYear(this.currentValue)),
              this.monthFormat.replace('{value}', ('0' + this.getMonth(this.currentValue)).slice(-2)),
              this.dateFormat.replace('{value}', ('0' + this.getDate(this.currentValue)).slice(-2))
            ];
            if (this.type === 'datetime') {
              values.push(
                this.hourFormat.replace('{value}', ('0' + this.getHour(this.currentValue)).slice(-2)),
                this.minuteFormat.replace('{value}', ('0' + this.getMinute(this.currentValue)).slice(-2)),
                this.secondFormat.replace('{value}', ('0' + this.getSecond(this.currentValue)).slice(-2))
              );
            }

          }

        }
        this.dateSlots.filter(child => child.values !== undefined)
          .map(slot => slot.values).forEach((slotValues, index) => {
            if (slotValues.indexOf(values[index]) === -1) {
              values[index] = slotValues[0];
            }
          });
        this.$nextTick(() => {
          this.setSlotsByValues(values);
        });
      },

      setSlotsByValues(values) {
        const setSlotValue = this.$refs.picker.setSlotValue;
        if (this.type === 'time') {
          setSlotValue(0, values[0]);
          setSlotValue(1, values[1]);
          setSlotValue(2, values[2]);
        }
        if (this.type !== 'time') {
          if (this.type === 'year') {
            setSlotValue(0, values[0]);
          } else if (this.type === 'month') {
            setSlotValue(0, values[0]);
            setSlotValue(1, values[1]);
          } else if (this.type === 'time-select') {
            setSlotValue(0, values[0]);
          } else {
            setSlotValue(0, values[0]);
            setSlotValue(1, values[1]);
            setSlotValue(2, values[2]);
            if (this.type === 'datetime') {
              setSlotValue(3, values[3]);
              setSlotValue(4, values[4]);
              setSlotValue(5, values[5]);
            }
          }
        }
        [].forEach.call(this.$refs.picker.$children, child => child.doOnValueChange());
      },

      rimDetect(result, rim) {
        let position = rim === 'start' ? 0 : 1;
        let rimDate = rim === 'start' ? this.startDate : this.endDate;
        if (this.getYear(this.currentValue) === rimDate.getFullYear()) {
          result.month[position] = rimDate.getMonth() + 1;
          if (this.getMonth(this.currentValue) === rimDate.getMonth() + 1) {
            result.date[position] = rimDate.getDate();
            if (this.getDate(this.currentValue) === rimDate.getDate()) {
              result.hour[position] = rimDate.getHours();
              if (this.getHour(this.currentValue) === rimDate.getHours()) {
                result.min[position] = rimDate.getMinutes();
                if (this.getMinute(this.currentValue) === rimDate.getMinutes()) {
                  result.min[position] = rimDate.getSeconds();
                }
              }
            }
          }
        }
      },

      isDateString(str) {
        return /\d{4}(\-|\/|.)\d{1,2}\1\d{1,2}/.test(str);
      },

      getYear(value) {
        return this.isDateString(value) ? value.split(' ')[0].split(/-|\/|\./)[0] : value.getFullYear();
      },

      getMonth(value) {
        return this.isDateString(value) ? value.split(' ')[0].split(/-|\/|\./)[1] : value.getMonth() + 1;
      },

      getDate(value) {
        return this.isDateString(value) ? value.split(' ')[0].split(/-|\/|\./)[2] : value.getDate();
      },
      getHour(value) {
        if (this.isDateString(value)) {
          const str = value.split(' ')[1] || '00:00:00';
          return str.split(':')[0];
        }
        return value.getHours();
      },

      getMinute(value) {
        if (this.isDateString(value)) {
          const str = value.split(' ')[1] || '00:00:00';
          return str.split(':')[1];
        }
        return value.getMinutes();
      },
      getSecond(value) {
        if (this.isDateString(value)) {
          const str = value.split(' ')[1] || '00:00:00';
          return str.split(':')[2];
        }
        return value.getSeconds();
      },

      confirm() {

        this.visible = false;
        // console.log(this.currentValue);
        this.$emit('confirm', this.currentValue);
      },

      handleValueChange() {
        this.$emit('input', this.currentValue);
      }
    },

    computed: {

      rims() {
        if (!this.currentValue) return { year: [], month: [], date: [], hour: [], min: [], sec: []};
        let result;
        if (this.type === 'time') {
          result = {
            // hour: [this.startHour, this.endHour],
            // min: [0, 59]
            hour: [0, 23],
            min: [0, 59],
            sec: [0, 59]
          };
          return result;
        } else if (this.type === 'time-select') {
          result = {
            selectTime: ['00:00', '23:59']
          };
          return result;
        } else if (this.type === 'year') {
          result = {
            year: [this.startDate.getFullYear(), this.endDate.getFullYear()]
          };
          return result;
        } else if (this.type === 'month') {
          result = {
            year: [this.startDate.getFullYear(), this.endDate.getFullYear()],
            month: [1, 12]
          };
          return result;
        } else if (this.type === 'date') {
          result = {
            year: [this.startDate.getFullYear(), this.endDate.getFullYear()],
            month: [1, 12],
            date: [1, this.getMonthEndDay(this.getYear(this.currentValue), this.getMonth(this.currentValue))]
          };
          return result;
        } else if (this.type === 'datetime') {
          result = {
            year: [this.startDate.getFullYear(), this.endDate.getFullYear()],
            month: [1, 12],
            date: [1, this.getMonthEndDay(this.getYear(this.currentValue), this.getMonth(this.currentValue))],
            hour: [0, 23],
            min: [0, 59],
            sec: [0, 59]
          };
          return result;
        }
        this.rimDetect(result, 'start');
        this.rimDetect(result, 'end');
      },

      typeStr() {
        if (this.type === 'time') {
          return 'Hms';
        } else if (this.type === 'date') {
          return 'YMD';
        } else if (this.type === 'year') {
          return 'Y';
        } else if (this.type === 'month') {
          return 'YM';
        } else if (this.type === 'datetime') {
          return 'YMDHms';
        } else if (this.type === 'time-select') {
          return 'T';
        } else {
          return 'YMD';
        }
      }
    },

    watch: {
      value(val) {
        this.currentValue = val;
      },
      rims() {
        this.generateSlots();
      }
    },
    mounted() {

      this.currentValue = this.value;
      if (!this.value) {
        if (this.type.indexOf('date') > -1) {
          this.currentValue = this.begainDate;
        } else if (this.type === 'year') {
          this.currentValue = this.begainDate;
        } else if (this.type === 'month') {
          this.currentValue = this.begainDate;
        } else if (this.type === 'time') {
          this.currentValue = this.begainDate;
          // this.currentValue = `${ ('0' + this.startHour).slice(-2) }:00`;
        } else if (this.type === 'time-select') {
          this.currentValue = this.start;
        } else {
          this.currentValue = this.begainDate;
        }
      }
      this.generateSlots();
    }
  };
</script>
