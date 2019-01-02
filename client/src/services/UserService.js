import Api from '@/services/Api'

export default {
  Register (data) {
    return Api().post('register', data)
  },
  signIn(data){
    return Api().post('signIn', data)
  },
  getUsers(){
    return Api().get('getUsers')
  },
  getUser(data){
    return Api().post('getUser', data)
  },
  updateUser(data){
    return Api().post('updateUser', data)
  },
  updateUserStatus(data){
    return Api().post('updateUserStatus', data)
  }
}