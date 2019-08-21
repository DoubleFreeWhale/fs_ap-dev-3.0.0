<template>
  <div class="" >
    <div class="el-tree" :class="{ 'el-tree--highlight-current': highlightCurrent }" v-if ="tflag">
      <el-tree-node
        v-for="child in root.childNodes"
        :node="child"
        :props="props"
        :key="getNodeKey(child)"
        :render-content="renderContent"
        @node-expand="handleNodeExpand">
      </el-tree-node>

      <div class="el-tree__empty-block" v-if="!root.childNodes || root.childNodes.length === 0">
        <span class="el-tree__empty-text">{{ emptyText }}</span>
      </div>
    </div>
    <div class="" v-else>
      <mb-tree :data="data" @current-change="currentChange" @node-collapse="nodeCollapse" @node-click="nodeClick" @check-change="checkChange" @node-expand="nodeExpand" :props="props" :load="load" :lazy="lazy" :showCheckbox="showCheckbox" style="padding:0 0.5rem 0.5rem">
      </mb-tree>
    </div>


  </div>

</template>

<script>
  import TreeStore from './model/tree-store';
  import {t} from 'ifbp-element/src/locale';
  import emitter from 'ifbp-element/src/mixins/emitter';
  import ElTreeNode from './tree-node';
  import MbTreeNode from 'ifbp-element/packages/mbtree/src/mb-tree.vue';
  import {IsPC} from 'ifbp-element/src/utils/util';

  export default {
    name: 'ElTree',

    mixins: [emitter],

    components: {
      ElTreeNode,
      MbTreeNode,
    },

    data() {
      return {
        tflag: IsPC(),
        store: null,
        root: null,
        currentNode: null
      };
    },

    props: {
      data: {
        type: Array
      },
      emptyText: {
        type: String,
        default() {
          return t('el.tree.emptyText');
        }
      },
      nodeKey: String,
      checkStrictly: Boolean,
      defaultExpandAll: Boolean,
      expandOnClickNode: {
        type: Boolean,
        default: true
      },
      autoExpandParent: {
        type: Boolean,
        default: true
      },
      defaultCheckedKeys: Array,
      defaultExpandedKeys: Array,
      renderContent: Function,
      showCheckbox: {
        type: Boolean,
        default: false
      },
      props: {
        default() {
          return {
            children: 'children',
            label: 'label',
            icon: 'icon',
            disabled: 'disabled'
          };
        }
      },
      lazy: {
        type: Boolean,
        default: false
      },
      highlightCurrent: Boolean,
      currentNodeKey: [String, Number],
      load: Function,
      filterNodeMethod: Function,
      accordion: Boolean,
      indent: {
        type: Number,
        default: 16
      }
    },

    computed: {
      children: {
        set(value) {
          this.data = value;
        },
        get() {
          return this.data;
        }
      }
    },

    watch: {
      defaultCheckedKeys(newVal) {
        this.store.defaultCheckedKeys = newVal;
        this.store.setDefaultCheckedKey(newVal);
      },
      defaultExpandedKeys(newVal) {
        this.store.defaultExpandedKeys = newVal;
        this.store.setDefaultExpandedKeys(newVal);
      },
      currentNodeKey(newVal) {
        if (!newVal) {
          this.store.currentNode = null;
          this.store.currentNodeKey = null;
          return;
        }
        this.store.setCurrentNodeKey(newVal);
        this.store.currentNodeKey = newVal;
      },
      data(newVal) {
        this.store.setData(newVal);
      }
    },

    methods: {
      currentChange(currentNode) {
        this.$emit('current-change', currentNode ? currentNode.data : null, currentNode);
      },
      nodeCollapse(data, node, self) {
        this.$emit('node-collapse', data, node, self);
      },
      checkChange(data, checked, indeterminate) {
        this.$emit('check-change', data, checked, indeterminate);
      },
      nodeExpand(data, node, self) {
        this.$emit('node-expand', data, node, self);
      },
      nodeClick(data, node, self) {
        this.$emit('node-click', data, node, self);
      },
      filter(value) {
        if (!this.filterNodeMethod) throw new Error('[Tree] filterNodeMethod is required when filter');
        this.store.filter(value);
      },
      getNodeKey(node, index) {
        const nodeKey = this.nodeKey;
        if (nodeKey && node) {
          return node.data[nodeKey];
        }
        return index;
      },
      getCheckedNodes(leafOnly) {
        return this.store.getCheckedNodes(leafOnly);
      },
      getCheckedKeys(leafOnly) {
        return this.store.getCheckedKeys(leafOnly);
      },
      setCheckedNodes(nodes, leafOnly) {
        if (!this.nodeKey) throw new Error('[Tree] nodeKey is required in setCheckedNodes');
        this.store.setCheckedNodes(nodes, leafOnly);
      },
      setCheckedKeys(keys, leafOnly) {
        if (!this.nodeKey) throw new Error('[Tree] nodeKey is required in setCheckedNodes');
        this.store.setCheckedKeys(keys, leafOnly);
      },
      setChecked(data, checked, deep) {
        this.store.setChecked(data, checked, deep);
      },
      handleNodeExpand(nodeData, node, instance) {
        // this.root.childNodes = node.childNodes;
        this.broadcast('ElTreeNode', 'tree-node-expand', node);
        this.$emit('node-expand', nodeData, node, instance);
      }
    },

    created() {
      this.isTree = true;
      
      this.store = new TreeStore({
        key: this.nodeKey || this.props.id,
        data: this.data,
        lazy: this.lazy,
        props: this.props,
        load: this.load,
        currentNodeKey: this.currentNodeKey,
        checkStrictly: this.checkStrictly,
        defaultCheckedKeys: this.defaultCheckedKeys,
        defaultExpandedKeys: this.defaultExpandedKeys,
        autoExpandParent: this.autoExpandParent,
        defaultExpandAll: this.defaultExpandAll,
        filterNodeMethod: this.filterNodeMethod
      });

      this.root = this.store.root;
    }
  };
</script>
