import "@/styles/globals.css";
import { SolanaWalletProvider } from "@/contexts/solana-wallet-context";
import NavHeader from "@/components/nav-header";
import { ToastContainer , Filp, Flip} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App({ Component, pageProps }) {
  return (
    <SolanaWalletProvider>
      <div className="w-full h-screen overflow-x-hidden relative">
        <div class="area">
          <ul class="circles">
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
        </div>
                  {/* pages */}
                  <div className="w-full h-full md:overflow-hidden">
                      {/* Header */}
          <NavHeader/>
          <div className="h-full w-full -mt-10">
          <Component {...pageProps}/>
          </div>
          </div>
        <ToastContainer
      position="bottom-right"
      transition={Flip}
      />
      </div>
    </SolanaWalletProvider>
  );
}
