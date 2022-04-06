import { createPinia } from 'pinia'
import { useAuthStore } from '~/stores/auth'
import type { UserModule } from '~/types'

// Setup Pinia
// https://pinia.esm.dev/
export const install: UserModule = ({ app, router }) => {
  const pinia = createPinia()
  app.use(pinia)

  router.beforeEach(async(to) => {
    if (to.meta.requiresAuth) {
      const auth = useAuthStore()
      await auth.initAuth()
      if (!auth.isAuthed)
        return '/'
    }
  })
}
