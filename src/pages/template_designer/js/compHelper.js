
import layoutArray from '../res/designLayouts.json'
import layoutDef from '../res/designLayoutsProperty.json'
import formCompArray from '../res/formComp.json'
import formCompDef from '../res/formCompProperty.json'

export default {
    getFormCompArray: function () {
        return formCompArray;
    },
    getFormCompDef: function (key) {
        return formCompDef[key];
    },
    getLayoutArray: function () {
        return layoutArray;
    },
    getLayoutDef: function (key) {
        return layoutDef[key];
    },
    removeField: function($dom){
        try{
            let field = $dom.attr('prop');
            let nowData = window.engine.getTplData();
            if($dom[0].nodeName === 'EL-FORM-ITEM'){
                let table = $dom.closest('el-form').attr(':model');
                delete nowData[table][field];
                //删除数据中的v-if
                delete nowData['formItemVIf'+field];
                window.engine.setTplData(nowData);
            }else if($dom[0].nodeName === 'EL-TABLE-COLUMN'){
                delete nowData['tableCoulmnVIf'+field];
                window.engine.setTplData(nowData);
            }
        }catch(e){
            console.log(e);
        }
    },
    _appendDomFun: function($dom){
        if ($dom[0].localName === 'el-table') {
            if(window.engine.currentDom.find('el-table').length > 0){
                window.engine.$message({
                    showClose: true,
                    message: '只能存在一个表格元素',
                    type: 'error'
                });
                return;
            }
            let targetEle = window.engine.currentDom.find('#table_area');
            $(targetEle).append($dom);
        } else if ($dom[0].localName === 'el-form') {
            if(window.engine.currentDom.find('el-form').length > 0){
                window.engine.$message({
                    showClose: true,
                    message: '只能存在一个表单元素',
                    type: 'error'
                });
                return;
            }
            let targetEle = window.engine.currentDom.find('#form_area');
            $(targetEle).append($dom);
        } else {
            let targetEle = window.engine.currentDom.find('[_id=' + window.dropId + ']');
            if (window.dropType === 'insertBefore') {
                $dom.insertBefore($(targetEle));
            } else {
                $(targetEle).append($dom);
            }
        }
    }
}