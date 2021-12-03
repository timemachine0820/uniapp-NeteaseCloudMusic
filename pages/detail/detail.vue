<template>
	<view class="detail">
		<view class="fixbg" :style="{'backgroundImage':'url('+songDetail.al.picUrl+')'}"></view>
		<musicHead :title='songDetail.name' :icon='true' color='white'></musicHead>
		<view class="container" v-show="!isLoading">
			<scroll-view scroll-y="true">
				<!-- 播放器 -->
				<view class="detail-play" @tap='handleToPlay'>
					<image :src="songDetail.al.picUrl" :class="{'detail-play-run':isPlayRotate}" mode=""></image>
					<text class="iconfont" :class="iconPlay"></text>
					<view class=""></view>
				</view>
				<!-- 歌词 -->
				<view class="detail-lyric">
					<view class="detail-lyric-wrap" :style="{transform:'translateY('+ - (lyricIndex-1)*82+'rpx)'}">
						<view class="detail-lyric-item" :class="{active:lyricIndex==index}"
							v-for='(item,index) in songLyric' :key='index'>{{item.lyric}}</view>
					</view>
				</view>
				<!-- 喜欢这首歌的人也听 -->
				<view class="detail-like">
					<view class="detail-like-head">喜欢这首歌的人也听</view>
					<view class="detail-like-item" v-for='(item,index) in songSimi' :key='index'
						@tap='handleToSimi(item.id)'>
						<view class="detail-like-img">
							<image :src="item.album.picUrl" mode=""></image>
						</view>
						<view class="detail-like-song">
							<view>{{item.name}}</view>
							<view>
								<image v-if="item.privilege.fee==1" src="../../static/vip.png" mode=""></image>
								<image v-if="item.privilege.flag>60&&item.privilege.flag<70"
									src="../../static/dujia.png" mode=""></image>
								<image v-if="item.privilege.maxbr==999000" src="../../static/sq.png" mode=""></image>
								{{item.album.artists[0].name}} - {{item.name}}
							</view>
						</view>
						<text class="iconfont icon-24gl-playCircle"></text>
					</view>
				</view>
				<!-- 评论 -->
				<view class="detail-comment">
					<view class="detail-comment-head">精彩评论</view>
					<view class="detail-comment-item" v-for='(item,index) in songComment' :key='index'>
						<view class="detail-comment-img">
							<image :src="item.user.avatarUrl" mode=""></image>
						</view>
						<view class="detail-comment-content">
							<view class="detail-comment-title">
								<view class="detail-comment-name">
									<view>{{item.user.nickname}}</view>
									<view>{{item.timeStr}}</view>
								</view>
								<view class="detail-comment-like">
									{{item.likedCount}}
									<text class="iconfont icon-icon"></text>
								</view>
							</view>
							<view class="detail-comment-text">
								{{item.content}}
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
	import {
		songDetail,
		songSimi,
		songComment,
		songLyric,
		songUrl
	} from '@/common/api.js'
	export default {
		data() {
			return {
				songDetail: {
					al: {
						picUrl: ''
					}
				},
				songSimi: [],
				songComment: [],
				songLyric: [],
				lyricIndex: 0,
				iconPlay: 'icon-zanting',
				isPlayRotate: true,
				isLoading:true
			}
		},
		onLoad(options) {
			// console.log(options.songId)
			this.getMusic(options.songId)
		},
		onUnload() {
			// 离开页面时清除定时器
			this.cancelLyricIndex()
			// #ifdef H5
			// H5离开页面销毁歌曲播放对象
			this.bgAudioManager.destroy()
			// #endif
		},
		onHide() {
			// 离开页面时清除定时器
			this.cancelLyricIndex()
			// #ifdef H5
			// H5离开页面销毁歌曲播放对象
			this.bgAudioManager.destroy()
			// #endif

		},
		methods: {
			getMusic(songId) {
				// 当前歌曲id传到store
				this.$store.commit('NEXT_ID',songId)
				
				// 切换页面时‘加载中’
				uni.showLoading({
					title: '加载中'
				});
				this.isLoading=true
				
				Promise.all([songDetail(songId), songSimi(songId), songComment(songId), songLyric(songId), songUrl(
					songId)]).then((res) => {
					if (res[0][1].data.code == '200') {
						this.songDetail = res[0][1].data.songs[0]
					}
					if (res[1][1].data.code == '200') {
						this.songSimi = res[1][1].data.songs
					}
					if (res[2][1].data.code == '200') {
						this.songComment = res[2][1].data.hotComments
					}
					if (res[3][1].data.code == '200') {
						let lyric = res[3][1].data.lrc.lyric
						let re = /\[([^\]]+)\]([^\[]+)/g
						var result = []
						lyric.replace(re, ($0, $1, $2) => {
							result.push({
								'time': this.formatTimeToSec($1),
								'lyric': $2
							})
						})
						this.songLyric = result
					}
					if (res[4][1].data.code == '200') {

						// #ifdef MP-WEIXIN
						this.bgAudioManager = uni.getBackgroundAudioManager();
						this.bgAudioManager.title = this.songDetail.name;
						// #endif

						// #ifdef H5
						// 判断是否已经有该对象了，否则进入其他歌曲会同时播放
						if (!this.bgAudioManager) {
							this.bgAudioManager = uni.createInnerAudioContext();
						}
						this.iconPlay = 'icon-bofang'
						this.isPlayRotate = false
						// #endif
						//若获取不到歌曲url，则给个''
						this.bgAudioManager.src = res[4][1].data.data[0].url || '';
						this.listenLyricIndex()
						this.bgAudioManager.onPlay(() => {
							this.iconPlay = 'icon-zanting'
							this.isPlayRotate = true
							this.listenLyricIndex()
						})
						this.bgAudioManager.onPause(() => {
							this.iconPlay = 'icon-bofang'
							this.isPlayRotate = false
							// 暂停时清除定时器
							this.cancelLyricIndex()
						})
						// 歌曲结束时调用getMusic，进入下一首
						this.bgAudioManager.onEnded(()=>{
							this.getMusic(this.$store.state.nextId)
						})
					}
					// 加载完成隐藏‘加载中’
					this.isLoading = false
					uni.hideLoading()
				})
			},
			// 对歌词中时间格式化成秒
			formatTimeToSec(value) {
				let arr = value.split(':')
				// toFixed会转成字符串,所以最后再加
				return (Number(arr[0] * 60) + Number(arr[1])).toFixed(1)
			},
			// 控制播放暂停
			handleToPlay() {
				if (this.bgAudioManager.paused) {
					this.bgAudioManager.play()
				} else {
					this.bgAudioManager.pause()
				}
			},
			// 歌词Index
			listenLyricIndex() {
				clearInterval(this.timer)
				this.timer = setInterval(() => {
					this.songLyric.forEach((val, index) => {
						// 播放时间大于歌词时间最后一项，则Index等于最后一项
						if (this.bgAudioManager.currentTime > this.songLyric[this.songLyric.length - 1]
							.time) {
							this.lyricIndex = this.songLyric.length - 1
							return

						}
						// 上一项歌词<播放时间<下一项歌词 则index等于上一项
						if (this.bgAudioManager.currentTime > val.time &&
							this.bgAudioManager.currentTime < this.songLyric[index + 1].time) {
							this.lyricIndex = index
						}
					})
				}, 500)
			},
			// 清除歌词定时器
			cancelLyricIndex() {
				clearInterval(this.timer)
			},
			// 进入相似的歌曲页面（修改songId即可，不用进入另一个页面）
			handleToSimi(songId){
				this.getMusic(songId)
			}
		}
	}
</script>

<style scoped>
	.detail-play {
		position: relative;
		display: flex;
		width: 580rpx;
		height: 580rpx;
		background: url(~@/static/disc.png);
		background-size: cover;
		margin: 214rpx auto 0 auto;
		align-items: center;
		justify-content: center;
	}

	.detail-play image {
		width: 380rpx;
		height: 380rpx;
		border-radius: 50%;
		animation: 10s linear move infinite;
		animation-play-state: paused;
	}

	.detail-play .detail-play-run {
		animation-play-state: running;
	}

	@keyframes move {
		from {
			transform: rotate(0deg);
		}

		to {
			transform: rotate(360deg);
		}
	}

	.detail-play text {
		position: absolute;
		font-size: 100rpx;
		color: #FFFFFF;
		z-index: 999;
	}

	.detail-play view {
		position: absolute;
		left: 250rpx;
		top: -180rpx;
		width: 200rpx;
		height: 320rpx;
		background: url(~@/static/needle.png);
		background-size: 100% 100%;
		margin: auto;
	}

	.detail-lyric {
		height: 246rpx;
		font-size: 32rpx;
		line-height: 82rpx;
		text-align: center;
		overflow: hidden;
		color: #6f6e73;
	}

	.detail-lyric-wrap {
		transition: .5s;
	}

	.detail-lyric-item {
		height: 82rpx;
	}

	.detail-lyric-item.active {
		color: #FFFFFF;
	}

	.detail-like {
		margin: 0 30rpx;
	}

	.detail-like-head {
		font-size: 36rpx;
		color: #FFFFFF;
		margin: 50rpx 0;
	}

	.detail-like-item {
		display: flex;
		align-items: center;
		margin-bottom: 28rpx;
	}

	.detail-like-img {
		width: 82rpx;
		height: 82rpx;
		border-radius: 20rpx;
		overflow: hidden;
		margin-right: 20rpx;
	}

	.detail-like-img image {
		width: 100%;
		height: 100%;
	}

	.detail-like-song {
		flex: 1;
		color: #c6c6bf;
	}

	.detail-like-song view:nth-child(1) {
		font-size: 28rpx;
		color: #FFFFFF;
		margin-bottom: 12rpx;
	}

	.detail-like-song view:nth-child(2) {
		font-size: 22rpx;
	}

	.detail-like-song image {
		width: 26rpx;
		height: 20rpx;
		margin-right: 10rpx;
	}

	.detail-like-item text {
		font-size: 50rpx;
		color: #c6c6bf;
	}

	.detail-comment {
		margin: 0 30rpx;
	}

	.detail-comment-head {
		font-size: 36rpx;
		color: #FFFFFF;
		margin: 50rpx 0;
	}

	.detail-comment-item {
		margin-bottom: 28rpx;
		display: flex;
	}

	.detail-comment-img {
		width: 64rpx;
		height: 64rpx;
		border-radius: 50%;
		overflow: hidden;
		margin-right: 18rpx;
	}

	.detail-comment-img image {
		width: 100%;
		height: 100%;
	}

	.detail-comment-content {
		flex: 1;
		color: #cbcacf;
	}

	.detail-comment-title {
		display: flex;
		justify-content: space-between;
	}

	.detail-comment-name {}

	.detail-comment-name view:nth-child(1) {
		font-size: 26rpx;
	}

	.detail-comment-name view:nth-child(2) {
		font-size: 18rpx;
	}

	.detail-comment-like {
		font-size: 26rpx;
	}

	.detail-comment-like text {
		margin-left: 8rpx;
	}

	.detail-comment-text {
		font-size: 28rpx;
		line-height: 40rpx;
		color: #FFFFFF;
		margin-top: 20rpx;
		padding-bottom: 20rpx;
		border-bottom: 1rpx solid #cbcacf;
	}
</style>
