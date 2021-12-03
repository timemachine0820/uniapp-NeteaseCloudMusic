<template>
	<view class="index">
		<musicHead title='网易云音乐' :icon='false'></musicHead>
		<view class="container">
			<scroll-view scroll-y="true">
				<view class="index-search" @tap='handleToSerach'>
					<text class="iconfont icon-sousuo"></text>
					<input type="text" placeholder="搜索歌曲" />
				</view>
				<view class="index-list">
					<!-- <view class="index-list-item">
						<view class="index-list-img">
							<image src="../../static/replace.png" mode=""></image>
							<text>每天更新</text>
						</view>
						<view class="index-list-text">
							<view>1.这是一首歌 - 歌手</view>
							<view>1.这是一首歌 - 歌手</view>
							<view>1.这是一首歌 - 歌手</view>
						</view>
					</view> -->
					<view class="index-list-item" v-for="(item,index) in topList" :key="index"
						@tap="handleToList(item.id)">
						<view class="index-list-img">
							<image :src="item.coverImgUrl" mode=""></image>
							<text>{{item.updateFrequency}}</text>
						</view>
						<view class="index-list-text">
							<view v-for="(mitem,index) in item.tracks" :key='index'>
								<p> {{index+1}}.{{mitem.first}} -
									{{mitem.second}}
								</p>
							</view>
						</view>
					</view>

				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import '@/common/iconfont.css'
	// import musicHead from '../../components/musicHead/musicHead.vue';
	import {
		topList
	} from '../../common/api.js'
	export default {
		data() {
			return {
				topList: []
			}
		},
		// comments: {
		// 	musicHead
		// },
		onLoad() {
			topList().then((res) => {
				if (res.length) {
					console.log(res);
					this.topList = res
				}
			})
		},
		methods: {
			handleToList(listId) {
				uni.navigateTo({
					url: '/pages/list/list?listId=' + listId,
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			handleToSerach() {
				uni.navigateTo({
					url: '/pages/search/search'
				})
			}
		}
	}
</script>

<style scoped>
	.index-search {
		display: flex;
		align-items: center;
		height: 70rpx;
		margin: 70rpx 30rpx 30rpx 30rpx;
		background-color: #f7f7f7;
		border-radius: 50rpx;
	}

	.index-search text {
		font-size: 26rtx;
		margin: 0 28rpx 0 26rpx;
	}

	.index-search input {
		font-size: 28rpx;
		flex: 1;
	}

	.index-list {
		margin: 0 30rpx;
	}

	.index-list-item {
		display: flex;
		margin-bottom: 34rpx;
	}

	.index-list-img {
		width: 212rpx;
		height: 212rpx;
		position: relative;
		border-radius: 30rpx;
		overflow: hidden;
		margin-right: 22rpx;
	}

	.index-list-img image {
		width: 100%;
		height: 100%;
	}

	.index-list-img text {
		position: absolute;
		left: 12rpx;
		bottom: 16rpx;
		color: #FFFFFF;
		font-size: 20rpx;
	}

	.index-list-text {
		flex: 1;
		line-height: 66rpx;
		font-size: 24rpx;
		/* flex下text-overflow: ellipsis会失效,父容器加min-width: 0即可 */
		min-width: 0;
	}

	.index-list-text p {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
