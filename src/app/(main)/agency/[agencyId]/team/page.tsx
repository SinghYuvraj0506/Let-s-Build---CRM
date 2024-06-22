import { db } from '@/lib/db'
import React from 'react'
import {DataTable} from './data-table'
import { columns } from './columns'

type Props = {
  params:{
    agencyId:string
  }
}

const page = async ({params}:Props) => {

  const allTeamUsers = await db.user.findMany({
    where:{
      agencyId:params?.agencyId
    },
    include:{
      Agency:{
        include:{
          SubAccount:true
        }
      },
      Permissions:{
        include:{
          SubAccount:true
        }
      }
    }
  })

  if(!allTeamUsers) return null

  const agency = await db.agency.findUnique({
    where:{id:params?.agencyId},
    include:{
      SubAccount:true
    }
  })


  if(!agency) return null


  return (
    <DataTable columns={columns} data={allTeamUsers} actionButtonText={"Add new user"} filterValue='name'/>
  )
}

export default page