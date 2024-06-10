import Image from "next/image";

export default function Home() {
  return (
    <main>
      <div className="h-full">
      <header className="text-center w-full p-20 box-border flex flex-col gap-6 items-center justify-center">
        <h1 className="text-5xl font-bold">A CRM dashboard for engineering teams</h1>
        <p className="text-xl">Lorem ipsum dolor sit amet consectetur. vallis orci ultrices non.<br/> Lorem ipsum dolor sit, amet consectetur adipisicing elit. Beatae, recusandae.</p>
        <div className="flex items-center gap-6">
          <button className="bg-primary hover:bg-primary/80 text-white font-bold py-2 px-4 rounded-md">Get a demo</button>
          <button className="bg-[#060B27] hover:bg-[#060b272c] text-white font-bold py-2 px-4 rounded-md border border-[#eeeeee9c]">View pricing</button>
        </div>

        <Image src={'/assets/preview.png'}  alt="banner-image" height={1200} width={1200} className="rounded-tl-2xl rounded-tr-2xl border-2 border-muted mt-6"/>

      </header>
      {/* Continue with the rest of your components */}
    </div>
    </main>
  );
}
