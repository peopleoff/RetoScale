import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Synergies from './views/Synergies.vue'
import Logout from './views/Logout.vue'
import Register from './views/Register.vue'
import Users from './views/Users.vue'
import Profile from './views/Profile.vue'
import Privacy from './views/Privacy.vue'
import PasswordReset from './views/PasswordReset.vue'
import Reset from './views/Reset.vue'
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

function setError(message) {
  store.commit('ADD_ERROR', {
    error: true,
    color: 'error',
    message: message
  })
}


function isAuth(to, from, next) {
  let token = getCookie('token');
  UserService.isAuth({
    token: token
  }).then(response => {
    if (response.data.error) {
      setError(response.data.message);
      next({
        path: '/'
      })
    } else {
      next();
    }
  })
}

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/home',
      name: 'home',
      component: Home
    },
  {
      path: '/synergies',
      name: 'Synergies',
      component: Synergies
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
      path: '/Register',
      name: 'Register',
      component: Register
    },
    {
      path: '/Reset/:token',
      name: 'Reset',
      component: Reset
    },
    {
      path: '/Login',
      name: 'Login',
      component: Login,
      beforeEnter: (to, from, next) => {
        if (!store.state.user) {
          next();
        } else {
          next({
            path: '/',
            name: 'home'
          });
        }
      }
    },
    {
      path: '/PasswordReset',
      name: 'PasswordReset',
      component: PasswordReset
    },
    //Protected Routes
    {
      path: '/Users',
      name: 'Users',
      component: Users,
      beforeEnter: (to, from, next) => {
        isAuth(to, from, next);
      }
    },
    {
      path: '/Profile',
      name: 'Profile',
      component: Profile,
      beforeEnter: (to, from, next) => {
        isAuth(to, from, next);
      }
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

  function tokenLogin() {

    let token = getCookie('token');
    let user = store.state.user

    //If no user & token is in cookies sign user in.
    if (!user && token) {
      store.commit('ADD_USER', {
        user: 'asdadasd'
      })
      UserService.signIn({
        token: token
      }).then(response => {
        if (response.data.error) {
          setError('Error signing in')
          store.commit('SIGN_OUT')
        } else {
          store.commit('ADD_USER', {
            username: response.data.username
          })
        }
      })
    }
  }

  tokenLogin();
  next();
});


export default router