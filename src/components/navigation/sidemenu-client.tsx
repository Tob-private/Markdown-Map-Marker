'use client'

import React, { useState } from 'react'
import styles from './sidemenu-client.module.css'
import SidemenuItems from './sidemenu-items'

interface MenuItem {
  key: string | number
  label: string
  href?: string
  children?: MenuItem[]
}

export default function SidemenuClient({
  menuItems
}: {
  menuItems: MenuItem[]
}) {
  const [asideIsOpen, setAsideIsOpen] = useState<boolean>(false)

  const toggleSidebar = () => setAsideIsOpen((prev) => !prev)

  return (
    <>
      {asideIsOpen && (
        <aside className={styles.sidebar}>
          <h1>Markdown Map Marker App</h1>
          <SidemenuItems menuItems={menuItems} />
        </aside>
      )}
      <button onClick={toggleSidebar} className={styles.sidemenu_trigger}>
        {asideIsOpen ? 'Close Menu' : 'Open Menu'}
      </button>
    </>
  )
}
