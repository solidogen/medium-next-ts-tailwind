import Link from 'next/link'
import React from 'react'

function Header() {
  return (
    <header>
      <div>
        <Link href="/">
          <img
            className="w-44 cursor-pointer object-contain"
            src="https://links.papareact.com/yvf"
            alt=""
          />
        </Link>
      </div>
      <div className="hidden md:inline-flex items-center space-x-5">
        <h3>About</h3>
        <h3>Contact</h3>
        <h3>Follow</h3>
      </div>
    </header>
  )
}

export default Header
