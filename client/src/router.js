import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Logout from './views/Logout.vue'
import Register from './views/Register.vue'
import Users from './views/Users.vue'
import Profile from './views/Profile.vue'
import Privacy from './views/Privacy.vue'
import PasswordReset from './views/PasswordReset.vue'
import PageNotFound from './views/PageNotFound.vue'


//Import Store
import store from './store';


//Import UserService to login user from router
import UserService from '@/services/UserService'

Vue.use(Router)

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [{
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/Login',
      name: 'Login',
      component: Login,
      beforeEnter: (to, from, next) => {
        console.log(!store.state.user);
        if (!store.state.user) {
          next();
        }else{
          next({
            path: '/',
            name: 'home'
          });
        }
      }
    },
    {
      path: '/Register',
      name: 'Register',
      component: Register
    },
    {
      path: '/Users',
      name: 'Users',
      component: Users
    },
    {
      path: '/Profile',
      name: 'Profile',
      component: Profile
    },
    {
      path: '/Logout',
      name: 'Logout',
      component: Logout
    },
    {
      path: '/Privacy',
      name: 'Privacy',
      component: Privacy
    },
    {
      path: '/PasswordReset',
      name: 'PasswordReset',
      component: PasswordReset
    },


    //404 page
    {
      path: '*',
      name: '404',
      component: PageNotFound
    },
  ]
})


router.beforeEach((to, from, next) => {
  function isLoggedIn(){
    let token = getCookie('token');
    let user =store.state.user
    if(!user && token){
      store.commit('ADD_USER', {user: 'asdasd'})
      UserService.signIn({
        token: token
      }).then(response => {
        if (response.data.error) {
          store.commit('SIGN_OUT')
        } else {
          store.commit('ADD_USER', {username: response.data.username})
        }
    })
    }
  }
  isLoggedIn();
  next();
});


export default router