import React from 'react'
import SideMenu from './SideMenu'
import Account from './Account'
import Cart from './Cart'
import { Link } from 'react-router-dom'
export default function Header() {

    return (
        <div className='w-full py-2 flex items-center justify-between'>
            <SideMenu source='headerParent' />

            <div className='flex gap-4'>
                <Link to="packs">Packs</Link>
                <Link to="Aliments/Fruits">Fruits</Link>
                <Link to="Aliments/Légumes">Légumes</Link>
            </div>

            <div className='flex items-center justify-between gap-4'>
                <Account />
                <Cart />
            </div>
        </div>
    )
}
