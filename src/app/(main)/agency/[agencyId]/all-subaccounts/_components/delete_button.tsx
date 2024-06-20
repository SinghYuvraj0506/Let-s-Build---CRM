"use client"

import { deleteSubAccount, generateNotificationLogs, getSubAccount } from '@/lib/querries'
import { useRouter } from 'next/navigation'
import React from 'react'

type Props = {
    subaccountId:string
}

const DeleteButton = ({subaccountId}:Props) => {
    const router = useRouter()

  return (
    <div onClick={async ()=>{
        let response = await getSubAccount(subaccountId)
        await generateNotificationLogs(
            `Deleted a subaccount | ${response?.name}`,
            undefined,
            subaccountId,
          )
          await deleteSubAccount(subaccountId)
          router.refresh()
    }}>
        Delete Sub Account
    </div>
  )
}

export default DeleteButton