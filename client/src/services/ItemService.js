import Api from '@/services/Api'

export default {
  addItem (data) {
    return Api().post('addItem', data)
  },
  updateItem (data) {
    console.log(data);
    return Api().post('updateItem', data)
  },
  getItems(data){
    return Api().get('getItems', data)
  },
  getLastUpdated(){
    return Api().get('getLastUpdated')
  },
  deleteItem(data){
    return Api().post('deleteItem', data)
  }
}