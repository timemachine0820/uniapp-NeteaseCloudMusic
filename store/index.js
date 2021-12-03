import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		topListIds: [],
		nextId: ''
	},
	mutations: {
		INIT_TOPLISTIDS(state, payload) {
			state.topListIds = payload
		},
		NEXT_ID(state, payload) {
			state.topListIds.forEach((val, index) => {
				if (val.id == payload) {
					state.nextId = state.topListIds[index + 1].id
				}
			})
		}
	}
})
