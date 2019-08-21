export
default {
  methods: {
    getSelectHasOptions4kangfu($dom, options, changeFun) {
      $dom.attr('filterable', '');
      $dom.attr('clearable', '');
      $dom.attr(':allow-create', true);
      $dom.attr('v-on:change', changeFun);
      $dom[0].innerHTML = '<el-option v-for="item in ' + options + '" :item="item" :key="item.label" :label="item.label":value="item.label"></el-option>';
    },
    getSelectNoOptions4kangfu($dom, options, changeFun, remoteMethod) {
      $dom.attr('filterable', '');
      $dom.attr('clearable', '');
      $dom.attr(':allow-create', true);
      $dom.attr('remote', '');
      $dom.attr(':remote-method', remoteMethod);
      $dom.attr('v-on:change', changeFun);
      $dom[0].innerHTML = '<el-option v-for="item in ' + options + '" :item="item" :key="item.label" :label="item.label":value="item.label"></el-option>';
    },
    getfilterSelectDom4kangfu($dom, options, changeFun, blurFun) {
      $dom.attr('filterable', '');
      $dom.attr('clearable', '');
      $dom.attr(':allow-create', false);
      $dom.attr('remote', '');
      $dom.attr(':remote-method', 'shjdsansbah'); // 这个是随便填的值，不要去实现此方法
      $dom.attr('v-on:change', changeFun);
      $dom.attr('v-on:blur', blurFun);
      $dom[0].innerHTML = '<el-option v-for="item in ' + options + '" :item="item" :key="item.label" :label="item.label":value="item.label"></el-option>';
    }
  }
};
