import Loading from '@/components/global/loading'
import React from 'react'

const loading = () => {
  return (
    <div className='h-full w-full flex items-center justify-center'>
        <Loading></Loading>
    </div>
  )
}

export default loading