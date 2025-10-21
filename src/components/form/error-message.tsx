import { Ban } from 'lucide-react'
import styles from './error-message.module.css'

export default function ErrorMessage({ error }: { error: string }) {
  return (
    <div className={styles.error_message}>
      <Ban width={20} />
      {error}
    </div>
  )
}
