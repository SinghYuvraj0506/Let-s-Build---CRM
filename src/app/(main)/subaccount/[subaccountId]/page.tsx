import React from 'react'

type Props = {
    params:{
        subaccountId:string
    }
}

const page = ({params}:Props) => {
  return (
    <div>{params?.subaccountId}</div>
  )
}

export default page