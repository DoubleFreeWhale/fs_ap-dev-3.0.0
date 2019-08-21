<script>
  import TabNav from './tab-nav';

  export default {
    name: 'ElTabs',

    components: {
      TabNav
    },

    props: {
      type: String,
      activeName: String,
      closable: Boolean,
      addable: Boolean,
      value: {},
      editable: Boolean,
      tabPositionTop:{
      	type:Boolean,
      	default:false
      },
      hasBottomBorder:{
      	type:Boolean,
      	default:true
      },
      isNormalType:{
      	type:Boolean,
      	default:true
      }
    },

    data() {
      return {
        currentName: this.value || this.activeName,
        panes: []
      };
    },

    watch: {
      activeName(value) {
        this.setCurrentName(value);
      },
      value(value) {
        this.setCurrentName(value);
      },
      currentName(value) {
        if (this.$refs.nav) {
          this.$nextTick(_ => {
            this.$refs.nav.scrollToActiveTab();
          });
        }
      }
    },

    methods: {
      handleTabClick(tab, tabName, event) {
        if (tab.disabled) return;
        this.setCurrentName(tabName);
        this.$emit('tab-click', tab, event);
        this.$nextTick(()=>{
          this.checkFooters();
          this.checkPanelGroups();
        })
      },
      checkFooters(){
        if(window.ifbpFooters && window.ifbpFooters.length > 0){
          for(let i = 0; i < window.ifbpFooters.length;i++){
            window.ifbpFooters[i].checkRemoveEl &&  window.ifbpFooters[i].checkRemoveEl();
          }
        }
      },
      checkPanelGroups(){
        if(window.panelGroups && window.panelGroups.length > 0){
          for(let i = 0; i < window.panelGroups.length;i++){
            window.panelGroups[i].checkRemoveEl &&  window.panelGroups[i].checkRemoveEl();
          }
        }
      },
      handleTabRemove(pane, ev) {
        if (pane.disabled) return;
        ev.stopPropagation();
        this.$emit('edit', pane.name, 'remove');
        this.$emit('tab-remove', pane.name);
      },
      handleTabAdd() {
        this.$emit('edit', null, 'add');
        this.$emit('tab-add');
      },
      setCurrentName(value) {
        this.currentName = value;
        this.$emit('input', value);
      },
      addPanes(item) {
        const index = this.$slots.default.indexOf(item.$vnode);
        this.panes.splice(index, 0, item);
      },
      removePanes(item) {
        const panes = this.panes;
        const index = panes.indexOf(item);
        if (index > -1) {
          panes.splice(index, 1);
        }
      }
    },
    render(h) {
      let {
        type,
        handleTabClick,
        handleTabRemove,
        handleTabAdd,
        currentName,
        panes,
        editable,
        addable,
        tabPositionTop,
        hasBottomBorder
      } = this;

      const newButton = editable || addable
        ? (
            <span
              class="el-tabs__new-tab"
              on-click={ handleTabAdd }
            >
                <i class="el-icon-plus"></i>
            </span>
          )
        : null;

      const navData = {
        props: {
          currentName,
          onTabClick: handleTabClick,
          onTabRemove: handleTabRemove,
          editable,
          type,
          panes
        },
        ref: 'nav'
      };

      return (
        <div class={{
          'el-tabs': true,
          'el-tabs--card': type === 'card',
          'el-tabs--border-card': type === 'border-card'
        }}>
          {hasBottomBorder ? (
          	 <div class="el-tabs__header">
            {newButton}
            {this.$slots.header}
            <tab-nav { ...navData }></tab-nav>
          	</div>
          ):(
          	 <div class="el-tabs__header-has-border">
            {newButton}
            {this.$slots.header}
            <tab-nav { ...navData }></tab-nav>
          	</div>
          )}

          <div class="el-tabs__content">
            {this.$slots.default}
          </div>
        </div>
      );
    },
    created() {
      if (!this.currentName) {
        this.setCurrentName('0');
      }
    }
  };
</script>
