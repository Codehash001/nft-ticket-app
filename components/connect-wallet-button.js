// components/WalletConnectButton.js
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const WalletConnectButton = () => {
    const { publicKey } = useWallet();

    return (
        <div className='w-full'>
            <WalletMultiButton />
            {/* {publicKey && <p>Connected as: {publicKey.toString()}</p>} */}
        </div>
    );
};

export default WalletConnectButton;
