import { ModeToggle } from '@/components/global/modeToggle'
import { UserButton } from '@clerk/nextjs'
import { User } from '@clerk/nextjs/server'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type Props =  {
  user: User | null
}

const Navigation = ({user}:Props) => {
  return (
    <div className='w-full py-5 px-20 flex items-center justify-between bg-transparent relative top-0 border-b-2'>
        
        <section className='flex items-center gap-1'>
        <Image 
        src={'/assets/plura-logo.svg'} 
        width={40}
        height={40}
        alt='logo'
        />

        <span className='text-xl font-bold'>Let&apos;s Build</span>

        </section>

        <section className='flex items-center gap-5 font-lg font-medium'>
            <Link href="#">Home</Link>
            <Link href="#">About</Link>
            <Link href="#">Features</Link>
            <Link href="#">Pricing</Link>
            <Link href="#">Blog</Link>
        </section>


        <section className='flex items-center gap-5'>
            <Link href="/agency" className='bg-primary text-white p-2 px-4 hover:bg-primary/80 rounded-md'>Get a Demo</Link>
            <UserButton/>
            <ModeToggle/>
        </section>

    </div>
  )
}

export default Navigation