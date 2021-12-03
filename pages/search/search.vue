<template>
	<view class="search">
		<musicHead title='搜索' :icon='true' color='black' :iconblack='true'></musicHead>
		<view class="container">
			<scroll-view scroll-y="true">
				<!-- 搜索页面 -->
					<!-- 搜索栏 -->
					<view class="search-search">
						<text class="iconfont icon-sousuo"></text>
						<input type="text" placeholder="搜索歌曲" v-model="searchWord"
							@confirm="handleToSearch(searchWord)" 
							@input="handleToSuggest"/>
						<text class="iconfont icon-guanbi" @tap='handleToClose'></text>
					</view>
					<block v-if='searchType==1'>
					<!-- 历史记录 -->
					<view class="search-history" v-show='!searchHistory.length==0'>
						<view class="search-history-head">
							<text>历史记录</text>
							<text class="iconfont icon-del" @tap='handleToClear'></text>
						</view>
						<view class="search-history-list">
							<view v-for='(item,index) in searchHistory' :key='index' @tap='handleToWord(item)'>{{item}}
							</view>
						</view>
					</view>
					<!-- 热搜榜 -->
					<view class="search-hot">
						<view class="search-hot-head"><text>热搜榜</text></view>
						<view class="search-hot-item" v-for='(item,index) in searchHot' :key='index'
							@tap='handleToWord(item.searchWord)'>
							<view class="search-hot-top">{{index + 1 }}</view>
							<view class="search-hot-word">
								<view>{{item.searchWord}}
									<image :src="item.iconUrl" mode="aspectFit"></image>
								</view>
								<view>{{item.content}}</view>
							</view>
							<text>{{item.score}}</text>
						</view>
					</view>
				</block>
				<!-- 搜索结果 -->
				<block v-else-if="searchType==2">
					<view class="search-result">
						<view class="search-result-item" v-for='(item,index) in searchList' :key='index' @tap='handleToDetail(item.id)'>
							<view class="search-result-word">
								<view>{{item.name}}</view>
								<view>
									<image src="../../static/sq.png" mode=""></image>{{item.artists[0].name}} - {{item.album.name}}
								</view>
							</view>
							<text class="iconfont icon-24gl-playCircle"></text>
						</view>
					</view>
				</block>
				<block v-else-if="searchType==3">
					<view class="search-suggest">
						<view class="search-suggest-head">
							搜索"{{searchWord}}"
						</view>
						<view class="search-suggest-item" v-for='(item,index) in searchSuggest' :key='index' @tap='handleToWord(item.keyword)'>
							<text class="iconfont icon-sousuo"></text>{{item.keyword}}
						</view>
					</view>
				</block>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import '@/common/iconfont.css'
	import {
		searchHot,
		searchWord,
		searchSuggest
	} from '../../common/api.js'
	export default {
		data() {
			return {
				searchHot: [],
				searchWord: '',
				searchHistory: [],
				searchType: 1,
				searchList:[],
				searchSuggest:[]
			}
		},
		onLoad() {
			// 获取热搜榜数据
			searchHot().then((res) => {
					if (res[1].data.code == '200') {
						this.searchHot = res[1].data.data
					}
				}),
				// 从本地存储中取出历史记录
				uni.getStorage({
					key: 'searchHistory',
					success: (res) => {
						this.searchHistory = res.data
					}
				})

		},
		methods: {
			// 点击热搜榜内容时将名称输入搜索框
			handleToWord(word) {
				this.searchWord = word
				this.handleToSearch(this.searchWord)
			},
			// 将搜索框里的词回车后添加进历史记录，并跳转到搜索结果
			handleToSearch(word) {
				this.searchHistory.unshift(word)
				// 去重
				// this.searchHistory=Array.from(new Set(this.searchHistory))
				this.searchHistory = [...new Set(this.searchHistory)]
				// 最多10个，超过了把前面的顶掉
				if (this.searchHistory.length > 10) {
					this.searchHistory.length = 10
				}
				// 本地存储
				uni.setStorage({
					key: 'searchHistory',
					data: this.searchHistory
				})
				this.getSearchList(word)
			},
			//清空历史记录
			handleToClear() {
				// uni.clearStorage() 整个本地存储都清空
				uni.removeStorage({
					key: 'searchHistory',
					success: (res) => {
						this.searchHistory = []
					}
				})
			},
			// 获得搜索详情列表
			getSearchList(word){
				searchWord(word).then((res)=>{
					if(res[1].data.code==200){
						this.searchList=res[1].data.result.songs
						console.log(this.searchList)
						this.searchType=2
					}
				})
			},
			// 点击x号，清除文字并切换页面
			handleToClose(){
				this.searchWord=''
				this.searchType=1
			},
			// 点击搜索结果进入歌曲播放页
			handleToDetail(songId){
				uni.navigateTo({
					url: '/pages/detail/detail?songId='+songId
				});
			},
			// 实时获取搜索框输入的值
			handleToSuggest(ev){
				let  value =ev.detail.value
				//搜索框为空返回搜索页
				if(!value){
					this.searchType=1
					return
				}
				// 调借口取回建议数据
				searchSuggest(value).then((res)=>{
					if(res[1].data.code==200){
						this.searchSuggest= res[1].data.result.allMatch
						this.searchType=3
					}
				})
			}
		}
	}
</script>

<style scoped>
	.search-search {
		display: flex;
		align-items: center;
		height: 70rpx;
		margin: 70rpx 30rpx 30rpx 30rpx;
		background-color: #f7f7f7;
		border-radius: 50rpx;
	}

	.search-search text {
		margin: 0 26rpx;
	}

	.search-search input {
		font-size: 28rpx;
		flex: 1;
	}

	.search-history {
		margin: 0 30rpx;
		font-size: 28rpx
	}

	.search-history-head {
		display: flex;
		justify-content: space-between;
		margin-bottom: 36rpx;
	}

	.search-history-list {
		display: flex;
		flex-wrap: wrap;
	}

	.search-history-list view {
		padding: 16rpx 28rpx;
		border-radius: 40rpx;
		margin-right: 30rpx;
		margin-bottom: 30rpx;
		background-color: #F7F7F7;
	}

	.search-hot {
		margin: 30rpx;
	}

	.search-hot-head {
		margin-bottom: 36rpx;
		font-size: 28rpx
	}

	.search-hot-item {
		display: flex;
		margin-bottom: 58rpx;
		align-items: center;
	}

	.search-hot-top {
		margin-left: 8rpx;
		width: 60rpx;
		color: #fb2222;
	}

	.search-hot-word {
		flex: 1;
		font-size: 30rpx;
	}

	.search-hot-word view:nth-child(2) {
		font-size: 24rpx;
		color: #878787;
		padding-top: 4rpx;
	}

	.search-hot-word image {
		width: 48rpx;
		height: 22rpx;
		margin-left: 10rpx;
	}

	.search-hot-item text {
		color: #878787;
		font-size: 24rpx
	}
	
	.search-result{
		border-top: 2rpx solid #e4e4e4;
		padding: 30rpx;
	}
	.search-result-item{display: flex;justify-content: space-between;align-items: center;padding-bottom: 30rpx;margin-bottom: 30rpx;border-bottom:2rpx solid #e4e4e4 ;}
	.search-result-word{}
	.search-result-word view:nth-child(1){font-size: 28rpx;margin-bottom: 12rpx;}
	.search-result-word view:nth-child(2){font-size: 22rpx;color:#898989;}
	.search-result-word image{
		width: 32rpx;
		height: 20rpx;
		margin-right: 10rpx;
		vertical-align: middle;
	}
	.search-result-item text{font-size: 50rpx;}
	
	.search-suggest{border-top: 2rpx solid #e4e4e4;
		padding: 30rpx;font-size: 26rpx;}
	.search-suggest-head{color: #4574a5;margin-bottom: 40rpx;}
	.search-suggest-item{color: #5d5d5d;margin-bottom: 40rpx;}
	.search-suggest-item text{color: #bdbdbd;margin-right: 28rpx;vertical-align: middle;}
	
</style>
