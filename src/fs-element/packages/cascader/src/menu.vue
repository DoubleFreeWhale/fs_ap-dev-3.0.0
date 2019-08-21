<script>
  export default {
    name: 'ElCascaderMenu',

    data() {
      return {
        inputWidth: 0,
        options: [],
        props: {},
        visible: false,
        activeValue: [],
        value: [],
        expandTrigger: 'click',
        changeOnSelect: false,
        popperClass: '',
        isNoData:false
      };
    },

    watch: {
      visible(value) {
        if (value) {
          this.activeValue = this.value;
        }
      },
      value: {
        immediate: true,
        handler(value) {
          this.activeValue = value;
        }
      },
      options: {
        handler(newVal){
          if(newVal.length==0){
            this.isNoData=true;
          }else{
            this.isNoData=false;
          }
        }
      }
    },

    computed: {
      activeOptions: {
        cache: false,
        get() {
          const activeValue = this.activeValue;
          const configurableProps = ['label', 'value', 'children', 'disabled'];
          
          const formatOptions = options => {
            options.forEach(option => {
              if (option.__IS__FLAT__OPTIONS) return;
              configurableProps.forEach(prop => {
                const value = option[this.props[prop] || prop];
                if (value) option[prop] = value;
              });
              if (Array.isArray(option.children)) {
                formatOptions(option.children);
              }
            });
          };

          const loadActiveOptions = (options, activeOptions = []) => {
            const level = activeOptions.length;
            activeOptions[level] = options;
            let active = activeValue[level];
            if (active) {
              options = options.filter(option => option.value === active)[0];
              if (options && options.children) {
                loadActiveOptions(options.children, activeOptions);
              }
            }
            return activeOptions;
          };

          formatOptions(this.options);
          return loadActiveOptions(this.options);
        }
      }
    },

    methods: {
      select(item, menuIndex,event) {
        let nodeName = '';
        if(!event){
        }else{
          nodeName = event.target.nodeName;
        }
        if(nodeName && nodeName == "LI" || !nodeName){
          if (item.__IS__FLAT__OPTIONS) {
            this.activeValue = item.value;
          } else if (menuIndex) {
            this.activeValue.splice(menuIndex, this.activeValue.length - 1, item.value);
          } else {
            this.activeValue = [item.value];
          }
          this.$emit('pick', this.activeValue);
          this.$emit('ifbpMenuItemClick', item, menuIndex);
        }else if(nodeName && nodeName == "SPAN"){
          this.$emit('activeItemIconClick', this.activeValue, item, menuIndex);
        }
      },
      handleMenuLeave() {
        this.$emit('menuLeave');
      },
      activeItem(item, menuIndex,event) {
        const len = this.activeOptions.length;
        this.activeValue.splice(menuIndex, len, item.value);
        this.activeOptions.splice(menuIndex + 1, len, item.children);
        let nodeName = '';
        if(!event){
          this.$emit('activeItemChange', this.activeValue, item, menuIndex);
        }else{
          nodeName = event.target.nodeName;
        }
        if(this.changeOnSelect){
          if(nodeName && nodeName == "LI"){
            this.$emit('pick', this.activeValue, true);
          }else if(nodeName && nodeName == "SPAN"){
            this.$emit('activeItemIconClick', this.activeValue, item, menuIndex);
            this.$emit('activeItemChange', this.activeValue, item, menuIndex);
          }
        }else{
          this.$emit('activeItemChange', this.activeValue, item, menuIndex);
        }
      },
      clickWhenHoverTrigger(item, menuIndex) {
        this.$emit('ifbpMenuItemClick', item);
      }
    },

    render(h) {
      const {
        activeValue,
        activeOptions,
        visible,
        expandTrigger,
        popperClass,
        isNoData,
        notLeafSelectable
      } = this;

      const menus = this._l(activeOptions, (menu, menuIndex) => {
        let isFlat = false;
        if(menu.length > 0){

        const items = this._l(menu, item => {
          const events = {
            on: {}
          };

          if (item.__IS__FLAT__OPTIONS) isFlat = true;
          let localExpandTrigger = notLeafSelectable ? 'hover' : expandTrigger;
          if (!item.disabled) {
            if (item.children) {
              let triggerEvent = {
                click: 'click',
                hover: 'mouseenter'
              }[localExpandTrigger];
              //判断,hover时,特殊处理等待250毫秒;
              if(localExpandTrigger=="hover"){
                var that=this;
                var timer;
                events.on[triggerEvent] = (e) => {
                    timer= setTimeout(function(){
                        that.activeItem(item, menuIndex);
                    },250); 
                 };
                 events.on.mouseleave=function(){
                   clearTimeout(timer);
                 }
              }else{
                 events.on[triggerEvent] = (e) => {
                   this.activeItem(item, menuIndex,e); 
                 }; 
              }
              if (notLeafSelectable) {
                events.on.click = (e) => { this.select(item, menuIndex, e); };
                // events.on.click = () => { this.clickWhenHoverTrigger(item, menuIndex); };
              }
            } else {
              events.on.click = (e) => { this.select(item, menuIndex, e); };
            }
          }

          return (
                <li
                  class={{
                    'el-cascader-menu__item': true,
                    'el-cascader-menu__item--extensible': item.children,
                    'is-active': item.value === activeValue[menuIndex],
                    'is-disabled': item.disabled
                  }}
                  {...events}
                >
                  {item.label}
                  <span v-show={item.children} class="fakeLabel"></span>
                </li>
          );
        });
        let menuStyle = {};
        if (isFlat) {
          menuStyle.minWidth = this.inputWidth + 'px';
        }

        return (
            <ul
              class={{
                'el-cascader-menu': true,
                'el-cascader-menu--flexible': isFlat
              }}
              style={menuStyle}>
              {items}
            </ul>
        );
        }
      });
      return (
        <transition name="el-zoom-in-top" on-after-leave={this.handleMenuLeave}>
          <div
            v-show={visible}
            class={[
              'el-cascader-menus',
              popperClass,
              {"cascader-no-data":isNoData}
            ]}
          >
            {menus}
          </div>
        </transition>
      );
    }
  };
</script>
<style>
/* .fakeLabel{
    height: 100%;
    width: 30px;
    background-color:rgba(100,100,100,0);
    position: absolute;
    top: 0;
    right: 0;
}
.el-cascader-menu .el-cascader-menu__item::after{
  pointer-events: none;
} */
</style>

