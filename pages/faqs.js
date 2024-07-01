import Head from "next/head";
import { Metaplex } from "@metaplex-foundation/js";
import Ticket from "@/components/ticket";
import FechedFaqs from "@/components/fetchedFaqs";


export default function Faqs() {

    return (
        <div className="w-full h-full">
            <Head>
                <title>Frequently Asked Questions</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="flex items-center justify-center w-full h-full overflow-hidden">
                <FechedFaqs/>
            </div>
        </div>
    );
}
