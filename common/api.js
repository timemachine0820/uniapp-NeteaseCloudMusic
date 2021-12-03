import {
	baseUrl
} from "./config.js"

// 获取飙升榜、新歌榜、原创榜、热歌榜歌单
export function topList() {
	// 返回的结果里已经有id了，不用手动给了
	// let topListId = ['19723756', '3779629', '2884035', '3778678']
	return new Promise((reslove, reject) => {
		uni.request({
			url: `${baseUrl}/toplist/detail`,
			method: 'GET',
			data: {},
			success: res => {
				let result = res.data.list
				result.length = 4;
				// result.forEach((item, index) => {
				// 	item.listId = topListId[index]
				// })
				reslove(result)
			},
			fail: () => {},
			complete: () => {}
		})
	})
}

// 具体榜单详情
export function list(listId){
	return uni.request({
		url: `${baseUrl}/playlist/detail?id=${listId}`,
		method: 'GET'
	});
}

// 歌曲详情
export function songDetail(songId){
	return uni.request({
		url: `${baseUrl}/song/detail?ids=${songId}`,
		method: 'GET'
	});
}

// 相似歌曲
export function songSimi(songId){
	return uni.request({
		url: `${baseUrl}/simi/song?id=${songId}`,
		method: 'GET'
	});
}

// 歌曲评论
export function songComment(songId){
	return uni.request({
		url: `${baseUrl}/comment/music?id=${songId}`,
		method: 'GET'
	});
}

// 歌曲歌词
export function songLyric(songId){
	return uni.request({
		url: `${baseUrl}/lyric?id=${songId}`,
		method: 'GET'
	});
}

// 歌曲链接
export function songUrl(songId){
	return uni.request({
		url: `${baseUrl}/song/url?id=${songId}`,
		method: 'GET'
	});
}

//热词 search/hot/detail
export function searchHot(){
	return uni.request({
		url: `${baseUrl}/search/hot/detail`,
		method: 'GET'
	});
}

//关键词 search?keywords=少年
export function searchWord(word){
	return uni.request({
		url: `${baseUrl}/search?keywords=${word}`,
		method: 'GET'
	});
}

//提示 search/suggest?keywords=少年&type=mobile
export function searchSuggest(word){
	return uni.request({
		url: `${baseUrl}/search/suggest?keywords=${word}&type=mobile`,
		method: 'GET'
	});
}