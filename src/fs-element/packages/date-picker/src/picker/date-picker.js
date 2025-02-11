import Picker from '../picker';
import DatePanel from '../panel/date';
import DateRangePanel from '../panel/date-range';
import { IsPC } from 'ifbp-element/src/utils/util';
const getPanel = function(type) {
  if (type === 'daterange' || type === 'datetimerange') {
    return DateRangePanel;
  }  
  return DatePanel;
};

export default {
  mixins: [Picker],

  name: 'ElDatePicker',

  props: {
    type: {
      type: String,
      default: 'date'
    }
  },
  data(){
    return{
      IsPC: IsPC()
    }
  },
  watch: {
    type(type) {
      if (this.picker) {
        this.unmountPicker();
        this.panel = getPanel(type);
        this.mountPicker();
      } else {
        this.panel = getPanel(type);
      }
    }
  },
  mounted () {
    this.dispatch('ElFormItem', 'havPaddingRight', [this.IsPC]);
  },
  created() {
    this.panel = getPanel(this.type);
  }
};
