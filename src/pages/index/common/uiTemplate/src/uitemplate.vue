<template>
	<div>
		<iframe :src="url" style="width: 100%;min-height:650px;padding:0 16px;overflow-y:auto;height: 100%;position:absolute;box-sizing: border-box;-moz-box-sizing: border-box;-webkit-box-sizing: border-box;">
			
		</iframe>
		
	</div>
</template>

<script>
	export default{
		
		data(){
			return{
				url:""
			}
		},
		mounted(){
			const flag = this.$commonUtils.getUrlParam("tilecode", window.location.href);
			this.url = flag + "&isNewtem=true";
		}
		
		
	}
</script>

<style>
</style>