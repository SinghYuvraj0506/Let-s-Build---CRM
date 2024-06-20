import AgencyDetails from '@/components/forms/agency-details'
import UserDetails from '@/components/forms/user-details'
import { db } from '@/lib/db'
import { getUserAuthDetails } from '@/lib/querries'
import React from 'react'

type Props = {
  params:{
    agencyId:string
  }
}

const page = async ({params}:Props) => {

  const userDetails = await getUserAuthDetails()

  if(!userDetails){
    return null
  }

  const agencyDetails = await db.agency.findUnique({
    where:{id:params?.agencyId},
    include:{
      SubAccount:true
    }
  })

  if(!agencyDetails) return null

  return (
    <div className='flex flex-col gap-4'>
      <AgencyDetails data={agencyDetails}/>
      <UserDetails id={userDetails?.id} type='agency' userData={userDetails}/>
    </div>
  )
}

export default page