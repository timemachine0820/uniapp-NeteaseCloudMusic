<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	.container{
		width: 100%;
		height:calc(100vh - 70px);
		overflow: hidden;
	}
	.container scroll-view{
		height: 100%;
	}
	.fixbg{
		width: 100%;
		height: 100vh;
		position: fixed;
		left: 0;
		top: 0;
		background-position: 0 center;
		background-size: cover;
		filter: blur(15px);
		transform: scale(1.1);
	}
</style>
