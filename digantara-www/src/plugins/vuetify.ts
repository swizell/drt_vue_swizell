import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi, } from 'vuetify/iconsets/mdi'
import "@mdi/font/css/materialdesignicons.css";

export const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
  theme: {
    defaultTheme: 'customLight',
    themes: {
      customLight: {
        dark: false,
        colors: {
          surface: '#ffffff',
          primary: '#1976d2',
          secondary: '#424242',
          background: '#f5f5f5',
          hover: '#f0f0f0',
        },
        variables: {
          'overlay-hover': '#f0f0f0',
        }
      },
    },
  },
})
