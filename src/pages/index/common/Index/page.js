
function install(Vue) {
  Vue.component('Page', {
    data: function () {
      return {
        gridData: []
      }
    },
    props: ['layoutcontext'],
    mounted: function () {
      this.getLayoutData();
    },
    methods: {
      getLayoutData: function () {
        var container = $('#' + this.layoutcontext.options.element);
        var layouts = container.find('.ui-grid'),
          data = [], html = [], str = 0, This = this;
        $.each(layouts, function (i, item) {
          var index = parseInt($(item).attr("class").replace(/[^0-9]/ig, ''));
          data.push(index);
        });
        container.data("gridData", data);
      },
      setModifiedLayout: function () {
        var container = $('#' + layoutcontext.options.element);
        var w = (container.width() + 30) / 12;
        var grid = container.data("gridData");
        function limit() {
          var lines = [], place = [], curLength = 0;
          $.each(grid, function (i, item) {
            var l = grid.length;
            var p = [], n = i + 1;
            curLength += item;
            var persent = (curLength / 12 * 100).toFixed(4) + '%%';
            var line = '<div class="line" style="left:' + persent + '"></div>';
            if (i == (l - 1)) {
              return false;
            }
            var p = [parseInt((curLength - item + 1) * w), 0, parseInt((curLength + grid[n] - 1) * w), 0];
            place.push(p);
            lines.push(line);
          })
          if (container.find(".line").length == 0) {
            container.find(".row").append(lines.join(""));
          }
          return place;
        }
        var place = limit();
        container.find(".line").each(function (i, item) {
          var L = i;
          $(item).draggable({
            axis: 'x',
            containment: place[i],
            grid: [w],
            drag: function (event, ui) {
              var myW = ui.helper.width();
              var lW = Math.round(ui.position.left / w);
            },
            stop: function (event, ui) {
              var myW = ui.helper.width();
              var lW = Math.round(ui.position.left / w);
              var grid = container.data("gridData");
              var curL = 0, prevL = 0;
              ui.helper.css('left', (lW / 12 * 100).toFixed(4) + '%%');
              $.each(grid, function (t, item) {
                if (t < i) {
                  prevL += item;
                }
              })
              curL = (i == 0) ? lW : lW - prevL;


              var l = grid[i] + grid[i + 1];
              //console.log(l);
              //console.log(grid[i]);
              var grids = container.find(".ui-grid");
              grids.eq(i).attr("class", "col-md-" + curL + " ui-grid");
              grids.eq(i + 1).attr("class", "col-md-" + (l - curL) + " ui-grid");

              grid[i] = curL;

              grid[i + 1] = l - curL;
              container.data("gridData", grid);

              var place = limit();

              //ui.helper.draggable('option',"containment",place[i]);

              //更新拖动限制范围
              if (grid.length == 2) {
                //ui.helper.draggable('option',"containment",place[i]);
              }
              else if (i == grid.length - 1 - 1 && grid.length != 2) {
                ui.helper.prev().draggable('option', "containment", place[i - 1]);
              }
              else {
                ui.helper.next().draggable('option', "containment", place[i + 1]);
              }
              //$(".ui-grid").eq(0).attr("class","col-md-"+lW+" ui-grid");
              //$(".ui-grid").eq(1).attr("class","col-md-"+(12-lW)+" ui-grid");
              //console.log(ui.helper.draggable('option',"containment",[500, 0, 1000, 0]));
              //var grid = _this.getLayoutData().options.gridData;
              //var length = grid-length,
              //    l = 0;

            }
          });
        })
      },
    },
    template: '<div class="page_content"><slot></slot></div>'
  });
}

export  default {
  install: install
}
