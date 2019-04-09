import axios from 'axios'
function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

let token = getCookie('token');

export default () => {
  return axios.create({
    baseURL: process.env.VUE_APP_API,
    headers: {
      Authorization: "Bearer " + token
    }
  })
}