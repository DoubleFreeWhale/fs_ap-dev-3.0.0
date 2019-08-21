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
        popperClass: ''
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
      }
    },
    computed: {
      activeOptions: {
        cache: false,
        get() {
          const activeValue = this.activeValue;
          const configurableProps = ['label', 'value', 'children', 'disabled'];
          const formatOptions = (options) => {
            options.forEach((option) => {
              const tmpOpt = option;
              if (tmpOpt.__IS__FLAT__OPTIONS) return;
              configurableProps.forEach((prop) => {
                const value = tmpOpt[this.props[prop] || prop];
                if (value) tmpOpt[prop] = value;
              });
              if (Array.isArray(tmpOpt.children)) {
                formatOptions(tmpOpt.children);
              }
            });
          };
          const loadActiveOptions = (options, activeOptions = []) => {
            const tmpActiveOpt = activeOptions;
            const level = tmpActiveOpt.length;
            tmpActiveOpt[level] = options;
            const active = activeValue[level] ? activeValue[level].value : false;
            if (active) {
              let tmpOpt = options;
              tmpOpt = tmpOpt.filter(option => option.value === active)[0];
              if (tmpOpt && tmpOpt.children) {
                loadActiveOptions(tmpOpt.children, tmpActiveOpt);
              }
            }
            return tmpActiveOpt;
          };
          formatOptions(this.options);
          return loadActiveOptions(this.options);
        }
      }
    },
    methods: {
      select(item, menuIndex) {
        if (item.__IS__FLAT__OPTIONS) {
          this.activeValue = item;
        } else if (menuIndex) {
          this.activeValue.splice(menuIndex, this.activeValue.length - 1, item);
        } else {
          this.activeValue = [item];
        }
        this.$emit('pick', this.activeValue);
      },
      handleMenuLeave() {
        this.$emit('menuLeave');
      },
      activeItem(item, menuIndex) {
        const len = this.activeOptions.length;
        this.activeValue.splice(menuIndex, len, item);
        this.activeOptions.splice(menuIndex + 1, len, item.children);
        if (this.changeOnSelect) {
          this.$emit('pick', this.activeValue, false);
        } else {
          this.$emit('activeItemChange', this.activeValue);
        }
      }
    },
    render(h) {
      const {
        activeValue,
        activeOptions,
        visible,
        expandTrigger,
        popperClass
      } = this;
      const menus = this._l(activeOptions, (menu, menuIndex) => {
        let isFlat = false;
        const items = this._l(menu, (item) => {
          const events = {
            on: {}
          };
          if (item.__IS__FLAT__OPTIONS) isFlat = true;
          if (!item.disabled) {
            if (item.children) {
              const triggerEvent = {
                click: 'click',
                hover: 'mouseenter'
              }[expandTrigger];
              events.on[triggerEvent] = () => { this.activeItem(item, menuIndex); };
            } else {
              events.on.click = () => { this.select(item, menuIndex); };
            }
          }
          if (!item || !item.href) {
            return (
            <li
              class={{
                'el-cascader-menu__item': true,
                'el-cascader-menu__item--extensible': item.children,
                'is-active': item.value === (activeValue[menuIndex] ? activeValue[menuIndex].value : ''),
                'is-disabled': item.disabled
              }}
              {...events}
            >
              {item.label}
            </li>
            );
          } else {
            return (
            <li
              class={{
                'el-cascader-menu__item': true,
                'el-cascader-menu__item--extensible': item.children,
                'is-active': item.value === (activeValue[menuIndex] ? activeValue[menuIndex].value : ''),
                'is-disabled': item.disabled
              }}
              {...events}
            >
              <a
                target="_blank"
                style="color: #48576a; text-decoration: none;"
                href={item.href}
              >{item.label}</a>
            </li>
            );
          }
        });
        const menuStyle = {};
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
      });
      return (
        <transition name="el-zoom-in-top" on-after-leave={this.handleMenuLeave}>
          <div
            v-show={visible}
            class={[
              'el-cascader-menus',
              popperClass
            ]}
          >
            {menus}
          </div>
        </transition>
      );
    }
  };
</script>

<style scoped>
.el-cascader-menus{
  z-index:1000;
}
</style>
