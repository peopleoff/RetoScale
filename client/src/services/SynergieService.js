import Api from '@/services/Api'

export default {
  getSynergies() {
    return Api().get('getSynergies', )
  },
  updateSynergies(data) {
    return Api().post('updateSynergies', data)
  },
}