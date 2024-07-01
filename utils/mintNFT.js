// utils/mintNFT.js
import metaplex from './metaplex';

export const mintNFT = async (name, uri) => {
    try {
        const { nft } = await metaplex.nfts().create({
            uri: uri,
            name: name,
            sellerFeeBasisPoints: 500, // 5% seller fee
        }).run();

        return nft;
    } catch (error) {
        console.error('Error minting NFT:', error);
        throw error;
    }
};
