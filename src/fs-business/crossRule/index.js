export default {
    addCrossRule: function(page, billtype, pk_org){
      page.$pageMgr.addCrossRule(page, billtype, pk_org);
    },
    updateOrg(page, pk_org) {
      page.$pageMgr.updateCrossOrg(pk_org);
    },
}