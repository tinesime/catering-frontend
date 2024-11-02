import {createStore} from 'vuex'

export default createStore({
    state: {
        isAuthenticated: !!localStorage.getItem('token'),
        token: localStorage.getItem('token') || '',
        user: JSON.parse(localStorage.getItem('user')) || null,
    },
    mutations: {
        async login(state, {token, user}) {
            state.isAuthenticated = true
            state.token = token
            state.user = user
            localStorage.setItem('token', token)
            localStorage.setItem('user', JSON.stringify(user))
        },
        async logout(state) {
            state.isAuthenticated = false
            state.token = ''
            state.user = null
            localStorage.removeItem('token')
            localStorage.removeItem('user')
        },
    },
    actions: {
        async login({commit}, {token, user}) {
            await commit('login', {token, user})
        },
        async logout({commit}) {
            await commit('logout')
        },
    },
    getters: {
        isAuthenticated: state => state.isAuthenticated,
        token: state => state.token,
        user: state => state.user,
    },
})