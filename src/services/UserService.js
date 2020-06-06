import Api from '@/services/Api'

export default {
  Register (data) {
    return Api().post('register', data)
  },
  signIn(data){
    return Api().post('signIn', data)
  },
  isAuth(data){
    return Api().post('isAuth', data)
  },
  getUsers(data){
    return Api().post('getUsers', data)
  },
  getUser(data){
    return Api().post('getUser', data)
  },
  updateUser(data){
    return Api().post('updateUser', data)
  },
  updateUserStatus(data){
    return Api().post('updateUserStatus', data)
  },
  passwordReset(data){
    return Api().post('passwordReset', data)
  },
  changePassword(data){
    return Api().post('changePassword', data)
  }
}