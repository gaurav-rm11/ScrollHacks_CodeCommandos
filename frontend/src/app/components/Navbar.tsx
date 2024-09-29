"use client";

import { useContext, useState } from "react";
import Link from "next/link";
import { WalletContext } from "@/context/wallet";
import { BrowserProvider, JsonRpcSigner } from "ethers";
import { useRouter } from "next/navigation";


interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className }) => {
  const {
    isConnected,
    setIsConnected,
    userAddress,
    setUserAddress,
    signer,
    setSigner,
  } = useContext(WalletContext);

  const router = useRouter()

  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const connectWallet = async (): Promise<void> => {
    if (!window.ethereum) {
      alert("Please Install MetaMask To Continue");
      return;
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = (await provider.getSigner()) as JsonRpcSigner;
      setSigner(signer);
      const accounts = await provider.send("eth_requestAccounts", []);
      setIsConnected(true);
      setUserAddress(accounts[0]);
      alert("MetaMask Wallet Connected");
      router.push('/dashboard')
      const network = await provider.getNetwork();
      const chainID = network.chainId;
      const polygonNetworkId = "80002";

      if (chainID !== polygonNetworkId) {
        alert("Switch to Polygon network to continue");

        
      }
      
    } catch (error) {
      console.log("Connection error", error);
    }
  };

  const toggleDropdown = (): void => setIsDropdownOpen(!isDropdownOpen);

  const truncateAddress = (address: string | null): string => {
    return address ? `${address.slice(0, 8)}...` : "";
  };

  return (
    <div className={`sticky top-0 z-50 w-full bg-black  ${className}`}>
      <div className="flex justify-between items-center max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
        {/* Right Side (Wallet Connect) */}
        <div className="flex items-center space-x-4">
          {isConnected ? (
            <>
              <button
                type="button"
                className="relative rounded-full bg-white px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-neutral-50/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black font-space-mono tracking-wide"
                onClick={toggleDropdown}
              >
                {truncateAddress(userAddress)}
                <svg
                  className="w-2.5 h-2.5 ms-3 inline"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-zinc-900 divide-y divide-gray-100 rounded-lg shadow z-10 dark:bg-zinc-900 dark:divide-gray-600">
                    <ul className="py-2 text-sm text-gray-700 dark:text-slate-300">
                      <li>
                        <Link href="/leaderboard" className="block px-4 py-2 hover:bg-zinc-950 dark:hover:bg-zinc-950 dark:hover:text-white">
                          LEADERBOARD
                        </Link>
                      </li>
                      <li>
                        <Link href="/settings" className="block px-4 py-2 hover:bg-zinc-950 dark:hover:bg-zinc-950 dark:hover:text-white">
                          SETTINGS
                        </Link>
                      </li>
                      <li>
                        <Link href="/discussion" className="block px-4 py-2 hover:bg-zinc-950 dark:hover:bg-zinc-950 dark:hover:text-white">
                          DISCUSSIONS
                        </Link>
                      </li>
                    </ul>
                  </div>
                )}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={connectWallet}
              className="rounded-full bg-white px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-neutral-50/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black font-space-mono tracking-wide"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
