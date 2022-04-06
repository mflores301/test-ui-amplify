import LogRocket from 'logrocket'
import type { UserModule } from '~/types'

export const install: UserModule = () => {
  LogRocket.init(import.meta.env.VITE_LOGROCKET_PROJECT as string | undefined || 'hifmbc/rialtic-dev')
}
