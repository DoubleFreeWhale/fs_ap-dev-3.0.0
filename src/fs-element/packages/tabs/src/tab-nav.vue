<script>
  import TabBar from './tab-bar';

  import { addResizeListener, removeResizeListener } from 'ifbp-element/src/utils/resize-event';

  function noop() {}

  export default {
    name: 'TabNav',

    components: {
      TabBar
    },

    props: {
      panes: Array,
      currentName: String,
      editable: Boolean,
      onTabClick: {
        type: Function,
        default: noop
      },
      onTabRemove: {
        type: Function,
        default: noop
      },
      type: String
    },

    data() {
      return {
        scrollable: false,
        navStyle: {
          transform: ''
        }
      };
    },
	  computed: {
	  	//正常情况下 fontSize 显示为 14px 上下边距也是14px
	  	//现在设置为 fontSize 显示为 16px 上下边距也是16px  
    	isNormalClass:{
    		cache: false,
    		get(){
    			return this.$parent  && this.$parent.isNormalType
    		}
    	}
	  },
    methods: {
      scrollPrev() {
        const containerWidth = this.$refs.navScroll.offsetWidth;
        const currentOffset = this.getCurrentScrollOffset();

        if (!currentOffset) return;

        let newOffset = currentOffset > containerWidth
          ? currentOffset - containerWidth
          : 0;

        this.setOffset(newOffset);
      },
      scrollNext() {
        const navWidth = this.$refs.nav.offsetWidth;
        const containerWidth = this.$refs.navScroll.offsetWidth;
        const currentOffset = this.getCurrentScrollOffset();

        if (navWidth - currentOffset <= containerWidth) return;

        let newOffset = navWidth - currentOffset > containerWidth * 2
          ? currentOffset + containerWidth
          : (navWidth - containerWidth);

        this.setOffset(newOffset);
      },
      scrollToActiveTab() {
      	//currentName 为 -1 代表首页
        if (!this.scrollable || this.currentName == '-1') return;
        const nav = this.$refs.nav;
        const activeTab = this.$el.querySelector('.is-active');       
        const navScroll = this.$refs.navScroll;
        const activeTabBounding = activeTab.getBoundingClientRect();
        const navScrollBounding = navScroll.getBoundingClientRect();
        const navBounding = nav.getBoundingClientRect();
        const currentOffset = this.getCurrentScrollOffset();
        let newOffset = currentOffset;

        if (activeTabBounding.left < navScrollBounding.left) {
          newOffset = currentOffset - (navScrollBounding.left - activeTabBounding.left);
        }
        if (activeTabBounding.right > navScrollBounding.right) {
          newOffset = currentOffset + activeTabBounding.right - navScrollBounding.right;
        }
        if (navBounding.right < navScrollBounding.right) {
          newOffset = nav.offsetWidth - navScrollBounding.width;
        }
        this.setOffset(Math.max(newOffset, 0));
      },
      getCurrentScrollOffset() {
        const { navStyle } = this;
        return navStyle.transform
          ? Number(navStyle.transform.match(/translateX\(-(\d+(\.\d+)*)px\)/)[1])
          : 0;
      },
      setOffset(value) {
        this.navStyle.transform = `translateX(-${value}px)`;
      },
      update() {
        const navWidth = this.$refs.nav.offsetWidth;
        const containerWidth = this.$refs.navScroll.offsetWidth;
        const currentOffset = this.getCurrentScrollOffset();

        if (containerWidth < navWidth) {
          const currentOffset = this.getCurrentScrollOffset();
          this.scrollable = this.scrollable || {};
          this.scrollable.prev = currentOffset;
          this.scrollable.next = currentOffset + containerWidth < navWidth;
          if (navWidth - currentOffset < containerWidth) {
            this.setOffset(navWidth - containerWidth);
          }
        } else {
          this.scrollable = false;
          if (currentOffset > 0) {
            this.setOffset(0);
          }
        }
      }
    },

    updated() {
      this.update();
    },

    render(h) {
      const {
        type,
        panes,
        editable,
        onTabClick,
        onTabRemove,
        navStyle,
        scrollable,
        scrollNext,
        scrollPrev,
        isNormalClass
      } = this;

      const scrollBtn = scrollable
      ? [
        <span class={['el-tabs__nav-prev', scrollable.prev ? '' : 'is-disabled']} on-click={scrollPrev}><i class="el-icon-arrow-left"></i></span>,
        <span class={['el-tabs__nav-next', scrollable.next ? '' : 'is-disabled']} on-click={scrollNext}><i class="el-icon-arrow-right"></i></span>
      ] : null;

      const tabs = this._l(panes, (pane, index) => {
        let tabName = pane.name || pane.index || index;
        const closable = pane.isClosable || editable;

        pane.index = `${index}`;

        const btnClose = closable
          ? <span class="el-icon-close" on-click={(ev) => { onTabRemove(pane, ev); }}></span>
          : null;

        const tabLabelContent = pane.$slots.label || pane.label;
        // 这里面自定义的panel是不支持badge的
        const badgeNum = pane.$slots.number || pane.number;
        const showbadge = pane.$slots.ifbpShowbadge || pane.ifbpShowbadge;
        return pane.showbadge?(
          <el-badge 
        		value= {pane.value}
            max = {pane.maxvalue} 
        	>
	          <div
	            class={{
	              'el-tabs__item': isNormalClass ? true :false,
	              'el-tabs__item-improper':isNormalClass ? false :true,
	              'is-active': pane.active,
	              'is-disabled': pane.disabled,
	              'is-closable': closable
	            }}
	            ref="tabs"
	            refInFor
	            on-click={(ev) => { onTabClick(pane, tabName, ev); }}
	          >
	            {tabLabelContent}
	            {btnClose}
	          </div>
          </el-badge>
        ) :(
        	 <div
	            class={{
	              'el-tabs__item': isNormalClass ? true :false,
	              'el-tabs__item-improper':isNormalClass ? false :true,
	              'is-active': pane.active,
	              'is-disabled': pane.disabled,
	              'is-closable': closable
	            }}
	            ref="tabs"
	            refInFor
	            on-click={(ev) => { onTabClick(pane, tabName, ev); }}
	          >
	            {tabLabelContent}
              <a class={{'ifbp-tabs_badge': true,'tab-showbadge': !showbadge}}>{ badgeNum }</a>
              {btnClose}
	          </div>
        )
      });
      return (
        <div class={['el-tabs__nav-wrap', scrollable ? 'is-scrollable' : '']}>
          {scrollBtn}
          <div class={['el-tabs__nav-scroll']} ref="navScroll">
            <div class="el-tabs__nav" ref="nav" style={navStyle}>
              {!type ? <tab-bar tabs={panes}></tab-bar> : null}
              {tabs}
            </div>
          </div>
        </div>
      );
    },

    mounted() {
      addResizeListener(this.$el, this.update);
    },

    beforeDestroy() {
      if (this.$el && this.update) removeResizeListener(this.$el, this.update);
    }
  };
</script>

