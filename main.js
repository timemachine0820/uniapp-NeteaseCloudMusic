import App from './App'
import musicHead from './components/musicHead/musicHead.vue';//引入组件
import store from 'store/index.js'

// 全局组件
Vue.component("musicHead",musicHead);

Vue.filter('formatCount',function(value){
	if(value>=10000&&value<=100000000){
		value/=1000
		return value.toFixed(1)+'万'
	}else if(value>=100000000){
		value/=100000000
		return value.toFixed(1)+'亿'
	}else{
		return value
	}
})

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App,
	store
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif