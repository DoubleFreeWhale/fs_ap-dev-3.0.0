export default {
  error:function(e,message){
    if (typeof e === 'string'){
      message = e;
      e  = null;
    }
    if (message){
      console.error(message);
    }
    if (e){
      console.error(e.stack);
    }
    console.trace();
  }
}