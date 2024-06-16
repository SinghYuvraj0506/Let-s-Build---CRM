import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { pricingCards } from "@/lib/constants";
import clsx from "clsx";
import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <div className="h-full">
        <header className="text-center w-full p-20 box-border flex flex-col gap-6 items-center justify-center mt-10">
          <h1 className="text-5xl font-bold">
            A CRM dashboard for engineering teams
          </h1>
          <p className="text-xl">
            Lorem ipsum dolor sit amet consectetur. vallis orci ultrices non.
            <br /> Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            Beatae, recusandae.
          </p>
          <div className="flex items-center gap-6">
            <button className="bg-primary hover:bg-primary/80 text-white font-bold py-2 px-4 rounded-md">
              Get a demo
            </button>
            <button className="bg-[#060B27] text-white font-bold py-2 px-4 rounded-md border border-[#eeeeee9c]">
              View pricing
            </button>
          </div>

          <Image
            src={"/assets/preview.png"}
            alt="banner-image"
            height={1200}
            width={1200}
            className="rounded-tl-2xl rounded-tr-2xl border-2 border-muted mt-6"
          />
        </header>

        <section className="flex items-center flex-col gap-8 text-center mt-40">
          <h2 className="text-4xl font-bold">Choose what fits you right</h2>
          <p className="w-3/4 text-muted-foreground">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate
            adipisci neque molestiae non quos vero Lorem ipsum dolor sit amet
            consectetur adipisicing elit. Doloremque harum a minima sint et
            culpa dolorum, consectetur porro reprehenderit ex!.
          </p>

          <div className="flex justify-center gap-8 flex-wrap mt-6">
            {pricingCards?.map((data) => {
              return (
                <Card
                  key={`pricingcard${data?.priceId}`}
                  className={clsx("flex flex-col justify-between gap-4 w-[300px]",{"border-2 border-primary":data?.title === "Unlimited Saas"})}
                >
                  <CardHeader className="flex flex-col gap-8 items-start text-muted-foreground">
                    <div className="flex flex-col items-start">
                    <CardTitle>{data?.title}</CardTitle>
                    <CardDescription>{data?.description}</CardDescription>
                    </div>
                    <div className="dark:text-white">
                    <span className="text-4xl font-bold">
                      {data?.price}
                    </span>
                    <span className="text-muted-foreground">/m</span>
                    </div>
                  </CardHeader>

                  <CardFooter className="flex flex-col gap-6 items-start">
                    <section className="flex flex-col gap-1">
                      {data?.features?.map((feature) => {
                        return (
                          <p
                            key={`feature-${feature}`}
                            className="flex items-center gap-2"
                          >
                            <Check className="text-muted-foreground text-sm" />{" "}
                            {feature}
                          </p>
                        );
                      })}
                    </section>
                    <Link href={"#"} className={clsx('w-full text-center bg-primary p-2 rounded-md',{'bg-muted-foreground': data.title !== "Unlimited Saas"})}>Get Started</Link>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
