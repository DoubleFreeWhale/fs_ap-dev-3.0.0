import { getCell, getColumnByCell, getRowIdentity } from './util';
import { hasClass } from 'ifbp-element/src/utils/dom';
import ElCheckbox from 'ifbp-element/packages/checkbox';
import ElTooltip from 'ifbp-element/packages/tooltip';
import debounce from 'throttle-debounce/debounce';
import _ from 'lodash';

export default {
  components: {
    ElCheckbox,
    ElTooltip
  },

  props: {
    elcolumnStyle: {
      type: Object,
      default: function() {
        return {};
      }
    },
    store: {
      required: true
    },
    stripe: Boolean,
    context: {},
    layout: {
      required: true
    },
    rowClassName: [String, Function],
    rowStyle: [Object, Function],
    fixed: String,
    highlight: Boolean
  },

  render(h) {
    const columnsHidden = this.columns.map((column, index) => this.isColumnHidden(index));
    return (
      <table
        class="el-table__body"
        cellspacing="0"
        cellpadding="0"
        border="0">
        <tbody>
          {
            this._l(this.data, (row, $index) =>
              [<tr
                style={ this.rowStyle ? this.getRowStyle(row, $index) : null }
                key={ this.table.rowKey ? this.getKeyOfRow(row, $index) : $index }
                on-dblclick={ ($event) => this.handleDoubleClick($event, row) }
                on-click={ ($event) => this.handleClick($event, row) }
                on-contextmenu={ ($event) => this.handleContextMenu($event, row) }
                on-mouseenter={ _ => this.handleMouseEnter($index) }
                on-mouseleave={ _ => this.handleMouseLeave() }
                class={ [this.getRowClass(row, $index)] }>
                {this._l(this.columns, (column, cellIndex) =>{
                  if(column.type === "expand" || column.type === "noIconExpand") {
                    this.isExpandTable = true;
                  }
                  if (column.type === 'expand' || column.type === 'index' || column.type === 'selection') {
                    return (<td
                          style="width:40px;"
                          class={ [column.id, column.align, column.className || '', columnsHidden[cellIndex] ? 'is-hidden' : '' ] }
                          on-mouseenter={ ($event) => this.handleCellMouseEnter($event, row) }
                          on-mouseleave={ this.handleCellMouseLeave }>
                          {
                            column.renderCell.call(this._renderProxy, h, { row, column, $index, store: this.store, _self: this.context || this.table.$vnode.context }, columnsHidden[cellIndex])
                          }
                        </td>);
                  }
                })
                }
                <td>
                {
                      this._l(this.columns, (column, cellIndex) => {

                        if (!(column.type === 'expand' || column.type === 'index' || column.type === 'selection'|| column.type === 'noIconExpand')) {
                          return (<div style="padding:8px;clear: both;">
                              <span style = { this.elcolumnStyle2[column.property] ? _.assign(this.elcolumnStyle2[column.property].label, {'width': '20%', 'display': 'block', 'float': 'left'}) : {'width': '20%', 'display': 'block', 'float': 'left'} } >
                                {column.label}:
                              </span>
                              <div style={this.elcolumnStyle2[column.property] ? _.assign(this.elcolumnStyle2[column.property].content, {'float': 'right', 'width': '80%', 'text-align': 'right'}) : {'float': 'right', 'width': '80%', 'text-align': 'right'}}>
                              {
                                column.renderCell.call(this._renderProxy, h, { row, column, $index, store: this.store, _self: this.context || this.table.$vnode.context }, columnsHidden[cellIndex])
                              }
                              </div>
                            </div>);
                        }
                      })
                }
                </td>
              </tr>,
                this.store.states.expandRows.indexOf(row) > -1
                ? (<tr>
                    <td colspan={ this.colspan } class="el-table__expanded-cell">
                      { this.table.renderExpanded ? this.table.renderExpanded(h, { row, $index, store: this.store }) : ''}
                    </td>
                  </tr>)
                : ''
              ]
            ).concat(
              this._self.$parent.$slots.append
            ).concat(
              <el-tooltip effect={ this.table.tooltipEffect } placement="top" ref="tooltip" content={ this.tooltipContent }></el-tooltip>
            )
          }
        </tbody>
      </table>
    );
  },

  watch: {
    'store.states.hoverRow'(newVal, oldVal) {
      if (!this.store.states.isComplex) return;
      const el = this.$el;
      if (!el) return;
      const rows = el.querySelectorAll('tbody > tr');
      const oldRow = rows[oldVal];
      const newRow = rows[newVal];     
      if (oldRow) {
        oldRow.classList.remove('hover-row');        
      }
      if (newRow) {
        newRow.classList.add('hover-row');        
      }      
    },
    'store.states.currentRow'(newVal, oldVal) {
      if (!this.highlight) return;
      const el = this.$el;
      if (!el) return;
      const data = this.store.states.data;
      const rows = el.querySelectorAll('tbody > tr.el-table__row');
      const oldRow = rows[data.indexOf(oldVal)];
      const newRow = rows[data.indexOf(newVal)];
      if (oldRow) {
        oldRow.classList.remove('current-row');
      } else if (rows) {
        [].forEach.call(rows, row => row.classList.remove('current-row'));
      }
      if (newRow) {
        newRow.classList.add('current-row');
      }
    }
  },

  computed: {
    elcolumnStyle2() {

      return this.elcolumnStyle || {};
    },
    table() {
      return this.$parent;
    },

    data() {
      return this.store.states.data;
    },

    columnsCount() {
      return this.store.states.columns.length;
    },

    leftFixedCount() {
      return this.store.states.fixedColumns.length;
    },

    rightFixedCount() {
      return this.store.states.rightFixedColumns.length;
    },

    columns() {
      return this.store.states.columns;
    },

    colspan() {
      var num = 0;
      this.columns.forEach((column) => {
        if (column.type === 'expand' || column.type === 'index' || column.type === 'selection') {
          num++;
        }
      });
      return num + 1;
    }
  },

  data() {
    return {
      tooltipContent: '',
      isExpandTable: false
    };
  },

  created() {
    this.activateTooltip = debounce(50, tooltip => tooltip.handleShowPopper());
  },

  methods: {
    getKeyOfRow(row, index) {
      const rowKey = this.table.rowKey;
      if (rowKey) {
        return getRowIdentity(row, rowKey);
      }
      return index;
    },

    isColumnHidden(index) {
      if (this.fixed === true || this.fixed === 'left') {
        return index >= this.leftFixedCount;
      } else if (this.fixed === 'right') {
        return index < this.columnsCount - this.rightFixedCount;
      } else {
        return (index < this.leftFixedCount) || (index >= this.columnsCount - this.rightFixedCount);
      }
    },

    getRowStyle(row, index) {
      const rowStyle = this.rowStyle;
      if (typeof rowStyle === 'function') {
        return rowStyle.call(null, row, index);
      }
      return rowStyle;
    },

    getRowClass(row, index) {
      const classes = ['el-table__row'];

      if (this.stripe && index % 2 === 1) {
        classes.push('el-table__row--striped');
      }
      const rowClassName = this.rowClassName;
      if (typeof rowClassName === 'string') {
        classes.push(rowClassName);
      } else if (typeof rowClassName === 'function') {
        classes.push(rowClassName.call(null, row, index) || '');
      }

      return classes.join(' ');
    },

    handleCellMouseEnter(event, row) {
      const table = this.table;
      const cell = getCell(event);

      if (cell) {
        const column = getColumnByCell(table, cell);
        const hoverState = table.hoverState = {cell, column, row};
        table.$emit('cell-mouse-enter', hoverState.row, hoverState.column, hoverState.cell, event);
      }

      // 判断是否text-overflow, 如果是就显示tooltip
      const cellChild = event.target.querySelector('.cell');

      if (hasClass(cellChild, 'el-tooltip') && cellChild.scrollWidth > cellChild.offsetWidth) {
        const tooltip = this.$refs.tooltip;

        this.tooltipContent = cell.innerText;
        tooltip.referenceElm = cell;
        tooltip.$refs.popper.style.display = 'none';
        tooltip.doDestroy();
        tooltip.setExpectedState(true);
        this.activateTooltip(tooltip);
      }
    },

    handleCellMouseLeave(event) {
      const tooltip = this.$refs.tooltip;
      if (tooltip) {
        tooltip.setExpectedState(false);
        tooltip.handleClosePopper();
      }
      const cell = getCell(event);
      if (!cell) return;

      const oldHoverState = this.table.hoverState;
      this.table.$emit('cell-mouse-leave', oldHoverState.row, oldHoverState.column, oldHoverState.cell, event);
    },

    handleMouseEnter(index) {
      this.store.commit('setHoverRow', index);
    },

    handleMouseLeave() {
      this.store.commit('setHoverRow', null);
    },

    handleContextMenu(event, row) {
      this.handleEvent(event, row, 'contextmenu');
    },

    handleDoubleClick(event, row) {
      this.handleEvent(event, row, 'dblclick');
    },

    handleClick(event, row) {
      this.store.commit('setCurrentRow', row);
      this.handleEvent(event, row, 'click');
    },

    handleEvent(event, row, name) {
      const table = this.table;
      const cell = getCell(event);
      let column;
      if (cell) {
        column = getColumnByCell(table, cell);
        if (column) {
          table.$emit(`cell-${name}`, row, column, cell, event);
        }
      }
      table.$emit(`row-${name}`, row, event, column);
    },

    handleExpandClick(row, event) {
      event && event.stopPropagation();
      if(this.isExpandTable) {
        this.store.commit('toggleRowExpanded', row);
      } else {
        console.log("未设置展开列");
      }
      // this.store.commit('toggleRowExpanded', row);
    }
  }
};
