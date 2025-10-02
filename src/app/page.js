"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Head from "next/head";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/restaurants");
  }, [router]);

  return (
    <>
      <Head>

        <link
          href="https://fonts.googleapis.com/css2?family=Siem+Reap&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div style={{ fontFamily: "'Siem Reap', sans-serif" }}>
        សូមស្វាគមន៍ (Welcome)  
      </div>
    </>
  );
}
