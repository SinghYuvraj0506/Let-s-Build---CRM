import { db } from '@/lib/db';
import { redirect } from 'next/navigation';

type Props = {
    params: {
      subaccountId: string;
    };
  };

  
const page = async ({params}:Props) => {
const pipelineExits = await db.pipeline.findFirst({
    where:{subAccountId:params.subaccountId}
  })

  if(!pipelineExits){
    try {
      const response = await db.pipeline.create({
        data: { name: 'First Pipeline', subAccountId: params.subaccountId },
      })
  
      return redirect(
        `/subaccount/${params.subaccountId}/pipelines/${response.id}`
      )
    } catch (error) {
      console.log(error)
    }
  }
  
  return redirect(`/subaccount/${params.subaccountId}/pipelines/${pipelineExits?.id}`)
}

export default page