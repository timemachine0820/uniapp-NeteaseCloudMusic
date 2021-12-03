<template>
	<view class="music-head" :style='{color:color}'>
		<view class="music-head-icon" v-if="icon" :class="{'music-head-iconblack':iconblack}">
			<text class=" iconfont icon-zuojiantou" @tap='backToBack'></text> |
			<text class="iconfont icon-shouye" @tap='backToHome'></text>
		</view>
		{{title}}
	</view>
</template>

<script>
	export default {
		name: "musicHead",
		data() {
			return {

			};
		},
		props: {
			title: {
				type: String
			},
			icon: {
				type: Boolean
			},
			color: {
				type: String
			},
			iconblack:{
				type: Boolean
			}
		},
		methods: {
			backToBack() {
				uni.navigateBack()
			},
			backToHome() {
				uni.navigateTo({
					url: '/pages/index/index'
				})
			}
		}
	}
</script>

<style scoped>
	.music-head {
		height: 75px;
		width: 100%;
		font-size: 16px;
		line-height: 80px;
		text-align: center;
		color: #000;
		position: relative;
	}

	.music-head-icon {
		position: absolute;
		left: 8px;
		top: 26px;
		width: 90px;
		height: 30px;
		background-color: rgba(0, 0, 0, .4);
		color: #FFFFFF;
		line-height: 30px;
		border-radius: 15px;
		display: flex;
		/* align-items: center; */
		justify-content: space-evenly;
	}
	
	.music-head-iconblack{
		color:#000000;
		border: 1px solid #eaeaea;
		background-color: #FFFFFF;
	}
</style>
