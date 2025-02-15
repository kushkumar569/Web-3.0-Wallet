import { useState } from 'react';
import * as bip39 from 'bip39';

let seedSol = ""; // Define a global variable to store the seed of solana
let seedEth = "";

function Mnemonic() {
    const [isGenerated, setIsGenerated] = useState(false);
    const [mnemonicWords, setMnemonicWords] = useState([]);

    async function generate() {
        const mnemonic = bip39.generateMnemonic();
        seedEth = await bip39.mnemonicToSeed(mnemonic);
        const temp = await bip39.mnemonicToSeedSync(mnemonic);

        seedSol = temp.toString('hex'); // Store seed globally
        setMnemonicWords(mnemonic.split(" "));
        setIsGenerated(true);
    }

    return (
        <>
        <div className='flex justify-center p-10'>
            {!isGenerated && <button onClick={generate} className="p-2 bg-blue-500 text-white rounded text-xl">
                Generate Wallet
            </button>}
            {isGenerated && <ShowMnemonic array={mnemonicWords} />}
        </div>
        </>
    );
}

function ShowMnemonic({ array }) {
    return (
        <div className="flex flex-wrap justify-center gap-2 h-1/4 w-4/5 bg-slate-500 text-black-200 p-4 rounded-2xl shadow-lg">
            {array.map((val, index) => (
                <EachMnemonic key={index} mne={val} />
            ))}
        </div>
    );
}

function EachMnemonic({ mne }) {
    return (
        <div className="p-4 border border-black-200 text-gray-800 bg-gray-400 rounded font-semibold font-serif text-2xl text-center h-15 w-1/5">
            {mne}
        </div>
    );
}

// Export both Mnemonic and seed
export default Mnemonic;
export { seedSol,seedEth };
