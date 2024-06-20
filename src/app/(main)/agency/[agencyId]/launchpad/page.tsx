import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/lib/db";
import { Card } from "@tremor/react";
import { CheckCircleIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
  params: {
    agencyId:string
  },
  searchParams:{code:string}
}

const page = async ({params}:Props) => {

  const agencyDetails = await db.agency.findUnique({
    where:{id:params.agencyId}
  })

  if(!agencyDetails) return null

  const allDetailsExist =
    agencyDetails.address &&
    agencyDetails.address &&
    agencyDetails.agencyLogo &&
    agencyDetails.city &&
    agencyDetails.companyEmail &&
    agencyDetails.companyPhone &&
    agencyDetails.country &&
    agencyDetails.name &&
    agencyDetails.state &&
    agencyDetails.zipCode

  return (
    <div>
      <div className="w-full h-full max-w-[800px]">
        <Card className="border-none p-0 md:p-1">
          <CardHeader>
            <CardTitle>Let&apos;s get Started</CardTitle>
            <CardDescription>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between border w-full p-4 rounded-lg">
              <div className="flex flex-col gap-2">
                <Image
                  src="/appstore.png"
                  alt="Appstore"
                  height={80}
                  width={80}
                  className="rounded-md object-contain"
                />

                <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. At, fugit.</p>
              </div>

              <Button>Start</Button>
            </div>
            <div className="flex items-center justify-between border w-full p-4 rounded-lg">
              <div className="flex flex-col gap-2">
                <Image
                  src="/stripelogo.png"
                  alt="Appstore"
                  height={80}
                  width={80}
                  className="rounded-md object-contain"
                />

                <p>Connect your stripe account</p>
              </div>

              <Button>Start</Button>
            </div>
            <div className="flex items-center justify-between border w-full p-4 rounded-lg">
              <div className="flex flex-col gap-2">
                <Image
                  src={agencyDetails?.agencyLogo}
                  alt="Appstore"
                  height={80}
                  width={80}
                  className="rounded-md object-contain"
                />

                <p>Fill you business details</p>
              </div>

              {allDetailsExist ? <CheckCircleIcon size={50} className="text-primary p-2 flex-shrink-0"/> : <Link href={`/agency/${params.agencyId}/settings`} className="p-2 bg-primary rounded-md px-4 text-sm">Start</Link>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default page;
