import React from 'react'
import Image from 'next/image'

export default function Loading() {
    return (
        <div className='h-full w-full flex flex-col  justify-center items-center'>
            <Image
                src="/adaptiFlex.svg"
                alt="Logo"
                height={80}
                width={80}
                priority
                className='w-auto h-auto'
            />
        </div>
    )
}
