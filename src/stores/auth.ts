import type { Session, User } from '@supabase/supabase-js'
import LogRocket from 'logrocket'
import NProgress from 'nprogress'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { supabase } from '~/modules/supabase'

export const useAuthStore = defineStore('auth', () => {
  const authActive = ref(false)
  const loading = ref(false)
  const userSession = ref(null as Session | null)

  const isAuthed = computed(() => !!userSession.value)
  const user = computed(() => userSession.value?.user || {} as User)
  const userMetadata = computed(() => user.value?.user_metadata || {})

  const initAuth = async() => {
    if (authActive.value)
      return true

    userSession.value = supabase.auth.session()

    supabase.auth.onAuthStateChange((event, session) => {
      NProgress.done()

      userSession.value = session

      LogRocket.track(`auth: ${event}`)

      if (session?.user) {
        const user = session.user
        const { email, name } = {
          email: '',
          name: '',
          ...session.user?.user_metadata,
        }

        LogRocket.identify(user.id, {
          email,
          name,
        })
      }
    })

    authActive.value = true

    return true
  }

  onBeforeMount(() => {
    initAuth()
  })

  const signIn = async() => {
    LogRocket.track('begin: sign_in')

    NProgress.start()
    loading.value = true
    const options = import.meta.env.DEV ? { redirectTo: origin } : {}

    const { user } = await supabase.auth.signIn({ provider: 'google' }, options)

    loading.value = false
    return user
  }

  const signOut = async() => {
    NProgress.start()
    loading.value = true
    LogRocket.track('begin: sign_out')

    const res = await supabase.auth.signOut()

    loading.value = false
    return res
  }

  return {
    initAuth,
    isAuthed,
    loading,
    signIn,
    signOut,
    userMetadata,
    user,
    userSession,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
