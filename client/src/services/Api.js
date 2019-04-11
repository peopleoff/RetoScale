import axios from 'axios'

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

export default () => {
  const connection = axios.create({
    baseURL: process.env.VUE_APP_API
  });

  connection.interceptors.request.use(function(config) {
    const token = getCookie('token');
    if(token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, function(err) {
    return Promise.reject(err);
});

  return connection
}
