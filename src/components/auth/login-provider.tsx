import { AuthProvider, OAuthSignInResult } from '@/lib/types/auth'
import { Button } from '../ui/button'
import Image from 'next/image'
import styles from './login-provider.module.css'

export default function LoginProvider({
  btnText,
  provider,
  providerIcon,
  onClickFunc
}: {
  btnText: string
  provider: AuthProvider
  providerIcon: string
  onClickFunc: () => Promise<OAuthSignInResult>
}) {
  return (
    <Button className={styles.auth_btn} onClick={onClickFunc}>
      {btnText}
      <Image
        src={providerIcon}
        height={35}
        width={35}
        alt={`A ${provider} icon`}
      />
    </Button>
  )
}
