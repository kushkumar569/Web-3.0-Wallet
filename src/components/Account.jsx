import { useState } from "react";
import nacl from "tweetnacl";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import { seedSol, seedEth } from "./Mnemonic";
import { Wallet, HDNodeWallet } from "ethers";
import axios from "axios";

function Account() {
    // for solana................
    const [accountNumber, setAccountNumber] = useState(0);
    const [solWallet, setSolWallet] = useState([]);
    const [popupMessage, setPopupMessage] = useState(null);

    async function getSolBalance(acc) {
        const apiurl = import.meta.env.VITE_SOLANA_BALANCE_API;
        try {
            const response = await axios.post(apiurl, {
                jsonrpc: "2.0",
                id: 1,
                method: "getBalance",
                params: [acc] // Correct parameter format
            });
    
            // console.log("Account Type:", typeof acc);
            console.log("API Response:", response.data);
    
            // Extract balance in lamports and convert to SOL
            const balanceLamports = response.data.result.value; // Solana returns balance in `lamports`
            const balance = balanceLamports / 1e9; // Convert to SOL
    
            // console.log("SOL Balance:", balance);
            return balance;
        } catch (error) {
            console.error("Error fetching Solana balance:", error);
            return 0; // Return 0 in case of error
        }
    }
    


    async function addSol() {
        if (!seedSol) {
            setPopupMessage("Seed is not available. Please check your Mnemonic configuration.");
            return;
        }

        const path = `m/44'/501'/${accountNumber}'/0'`;
        const derivedSeed = derivePath(path, seedSol.toString("hex")).key;
        const keyPair = nacl.sign.keyPair.fromSeed(derivedSeed);
        const solanaKeyPair = Keypair.fromSecretKey(keyPair.secretKey);
        const pkey = solanaKeyPair.publicKey.toBase58();
        const bal = await getSolBalance(pkey);
        const newAccount = {
            publicKey: pkey,
            privateKey: Buffer.from(solanaKeyPair.secretKey).toString("hex"),
            balance: bal
        };

        setSolWallet((prev) => [...prev, newAccount]);
        setAccountNumber((prev) => prev + 1);
    }
    
    


    // for etherium.............

    async function getEthBalance(acc) {
        const apiurl = import.meta.env.VITE_ETHERIUM_BALANCE_API;
        try {
            const response = await axios.post(apiurl, {
                jsonrpc: "2.0",
                id: 1,
                method: "eth_getBalance",
                params: [acc, "latest"] //  Correct parameter format
            });
            // Extracting balance (Hex to Decimal conversion)
            const balanceHex = response.data.result;
            const balance = parseInt(balanceHex, 16) / 1e18; // Convert Wei to ETH

            // console.log("ETH Balance:", balance);
            return balance;
        } catch (error) {
            return "error";
        }
    }

    const [currentIndex, setCurrentIndex] = useState(0);
    const [addresses, setAddresses] = useState([]);
    async function addEth() {
        if (!seedEth) {
            setPopupMessage("Seed is not available. Please check your Mnemonic configuration.");
            return;
        }

        const derivationPath = `m/44'/60'/${currentIndex}'/0'`;
        const hdNode = HDNodeWallet.fromSeed(seedEth);
        const child = hdNode.derivePath(derivationPath);
        const privateKey = child.privateKey;
        const wallet = new Wallet(privateKey);
        const bal = await getEthBalance(wallet.address);
        const temp = { publicKey: wallet.address, privateKey: wallet.privateKey, balance: bal }
        // console.log(bal);
        // console.log(temp);


        setCurrentIndex(currentIndex + 1);
        setAddresses([...addresses, temp]);
    }


    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-900 p-6 text-white">
            {popupMessage && (
                <div className="fixed top-5 right-5 bg-red-600 text-white p-4 rounded shadow-lg">
                    {popupMessage}
                    <button className="ml-4 bg-white text-red-600 px-2 py-1 rounded" onClick={() => setPopupMessage(null)}>Close</button>
                </div>
            )}
            <div className="w-full max-w-4xl bg-gray-800 rounded-xl shadow-lg p-6">
                <h1 className="text-3xl font-bold text-center mb-6">Crypto Wallet Manager</h1>
                <div className="grid grid-cols-2 gap-8">
                    <div className="flex flex-col items-center p-4 bg-gray-700 rounded-lg shadow">
                        <button className="w-full bg-blue-600 hover:bg-blue-500 text-white text-lg font-semibold py-2 rounded-lg transition" onClick={addEth}>
                            Add Ethereum Account
                        </button>
                        <div className="mt-4 w-full">
                            {addresses.map((val, index) => (
                                <AddEth key={index} val={val} index={index} />
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-gray-700 rounded-lg shadow">
                        <button
                            className="w-full bg-green-600 hover:bg-green-500 text-white text-lg font-semibold py-2 rounded-lg transition"
                            onClick={addSol}
                        >
                            Add Solana Account
                        </button>
                        <div className="mt-4 w-full">
                            {solWallet.map((val, index) => (
                                <AddSol key={index} val={val} index={index} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function AddSol({ val, index }) {
    if (!val.publicKey) {
        return null;
    }

    return (
        <div className="p-4 bg-gray-600 rounded-lg shadow-md mt-2">
            <p className="text-sm"><strong className="text-zinc-800">Account:- {index + 1}</strong></p><br />
            <p className="text-sm"><strong className="text-zinc-800">Public Key:-</strong> {val.publicKey}</p><br />
            <p className="text-sm break-all"><strong className="text-zinc-800">Private Key:-</strong> {val.privateKey}</p>
            <p className="text-sm "><strong className="text-zinc-800">Current Balance:-</strong> {val.balance} Sol</p><br />
        </div>
    );
}

function AddEth({ val, index }) {
    if (!val.publicKey) {
        return null;
    }
    // console.log(val);

    return (
        <div className="p-4 bg-gray-600 rounded-lg shadow-md mt-2">
            <p className="text-sm"><strong className="text-zinc-800">Account:- {index + 1}</strong></p><br />
            <p className="text-sm"><strong className="text-zinc-800">Public Key:-</strong> {val.publicKey}</p><br />
            <p className="text-sm break-all"><strong className="text-zinc-800">Private Key:-</strong> {val.privateKey}</p>
            <p className="text-sm "><strong className="text-zinc-800">Current Balance:-</strong> {val.balance} Eth</p><br />
        </div>
    );
}

export default Account;
