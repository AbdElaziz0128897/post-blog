import Vuex from 'vuex'
import axios from 'axios'
import cookie from 'js-cookie'
const createStore = () => {
    return new Vuex.Store({
        state:{
            loadedPosts : [],
            token: null
        },
        mutations:{
            setPosts(state, posts) {
                state.loadedPosts = posts
            },
            addPost(state, post) {
                state.loadedPosts.push(post);
            },
            editPost(state, editedPost) {
                const postIndex = state.loadedPosts.findIndex(
                    post => post.id === editedPost.id);
                    state.loadedPosts[postIndex] = editedPost
            },
            setToken(state, token) {
                state.token = token
            },
            clearToken(state) {
                state.token = null
            }
        },
        actions:{
            nuxtServerInit(vuexContext, context) {
                return axios.get('https://nuxt-blog-b51de.firebaseio.com/posts.json')
                .then(res => {
                    const postArray = []
                    for(const key in res.data ) {
                        postArray.push({...res.data[key], id:key })
                    }
                    vuexContext.commit('setPosts', postArray)
                })
                .catch(e => context.error(e))
            },
            addPost(vuexContext, post) {
                const createdPost = {
                    ...post,
                    updatedDate: new Date()
                }
                return axios
                .post('https://nuxt-blog-b51de.firebaseio.com/posts.json?auth=' + vuexContext.state.token , createdPost)
                .then(result => {
                    vuexContext.commit('addPost', {...createdPost, id:result.data.name})
                })
                .catch(e => console.log(e))
            },
            editPost(vuexContext, editedPost) {
                axios.put('https://nuxt-blog-b51de.firebaseio.com/posts/' + 
                    editedPost.id +
                    '.json?auth=' + vuexContext.state.token, editedPost)
                    .then(res => {
                        vuexContext.commit('editPost', editedPost)
                    })
                    .catch(e => console.log(e))
            },
            setPosts(vuexContext, posts) {
                vuexContext.commit('setPosts', posts) 
            },
            authenticatedUser(vuexContext, authData) {
                let authUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCGSS5HXLGlU3F42VFDXy74sr2zz1890vg'
                if(!authData.isLogin) {
                authUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCGSS5HXLGlU3F42VFDXy74sr2zz1890vg'
                }
                return axios.post(authUrl,
                {
                    email: authData.email,
                    password: authData.password,
                    returnSecureToken: true
                }).then( result => {
                    vuexContext.commit('setToken', result.data.idToken )
                    localStorage.setItem('token', result.data.idToken)
                    localStorage.setItem(
                        'tokenExpiration',
                         new Date().getTime() + result.data.expiresIn * 1000)
                    cookie.set('jwt', result.data.idToken)
                    cookie.set('expirationDate',
                    new Date().getTime() + result.data.expiresIn * 1000)
                    
                })
                .catch(e => console.log(e))
            },
            setLogoutTimer(vuexContext, duration) {
                setTimeout(() => {
                    vuexContext.commit('clearToken')
                }, duration);
            },
            initAuth(vuexContext, context) {
                let token;
                let expirationDate;
                if(req) {
                    if(!context.req.header.cookie) {
                        return;
                    }
                    const jwtCookie = context.req.header.cookie
                    .split(';')
                    .find( c => c.trim().startWith("jwt="));
                    if(!jwtCookie) {
                        return;
                    }
                     token = jwtCookie.split('=')[1];
                     ExpirationDate = context.req.header.cookie
                    .split(';')
                    .find( c => c.trim().startWith("ExpirationDate="))
                    .split("=")[1];
                } else {
                     token = localStorage.getItem('token');
                     expirationDate = localStorage.getItem('tokenExpiration')
                    if( new Date().getTime() > +expirationDate || !token ) {
                        return;
                    }
                }
                vuexContext.commit('setToken', token)
            }
        },
        getters:{
            loadedPosts(state) {
                return state.loadedPosts
            },
            isAuthenticated(state) {
                state.token != null
            }
        }
    })
}

export default createStore
































