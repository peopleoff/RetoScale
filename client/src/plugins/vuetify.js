import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import colors from 'vuetify/es5/util/colors'
import 'vuetify/src/stylus/app.styl'

Vue.use(Vuetify, {
  theme: {
    primary: '#4b7bec',
    primaryAction: colors.green.darken2,
    secondary: colors.grey.darken1,
    secondaryAction: colors.red,
    accent: colors.shades.black,
    error: colors.red.lighten1
  },
  iconfont: 'md',
})
