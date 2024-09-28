"use client";
import React, { useState, useContext } from "react";
import ContractInput from "../components/ContractInput";
import { Vortex } from "../components/ui/vortex";
import { WalletContext } from "@/context/wallet";
import { useRouter } from "next/navigation";
import { analyzeContractWithGemini } from "../../lib/ai_prompt"; // Import your analyze function

function Page() {
  const { isConnected, userAddress } = useContext(WalletContext);
  const router = useRouter();

  if (!isConnected) {
    router.push("/");
  }

  const truncateAddress = (address: string | null): string => {
    return address ? `${address.slice(0, 8)}...` : "";
  };

  const [contract, setContract] = useState("");
  const [auditResult, setAuditResult] = useState(null); // State to hold audit results
  const [loading, setLoading] = useState(false); // Loading state

  const analyze = async () => {
    setLoading(true); // Set loading to true before the API call
    const result = await analyzeContractWithGemini(contract); 
    console.log(result);
    // Call the analyze function
    setLoading(false); // Set loading to false after the API call

    if (result) {
      setAuditResult(result); 
      // Save the result if successful
    } else {
      console.error("Failed to analyze the contract.");
    }
  };

  return (
    <>
      <div className="w-full h-screen overflow-hidden">
        <Vortex
          backgroundColor="black"
          rangeY={800}
          particleCount={500}
          baseHue={120}
          className="flex items-center flex-col justify-center px-2 py-4 w-full h-full"
        >
          <h2 className="text-white text-2xl md:text-6xl font-bold text-center">
            Audit Your Contract Here
          </h2>
          <p className="text-white text-sm md:text-2xl max-w-xl mt-6 text-center">
            Welcome <span className="bg-white text-black rounded-2xl p-1">{truncateAddress(userAddress)}</span> You can paste your Solidity Contract here for audit.
          </p>
          <div className="mt-10 w-full flex justify-center">
            <ContractInput
              className="w-full max-w-xl h-16 px-4 text-lg"
              contract={contract}
              setContract={setContract}
              analyze={analyze}
            />
          </div>

          {loading && <p className="text-white">Analyzing contract...</p>} {/* Loading message */}

          {auditResult && (
            <div className="mt-10 text-white">
              <h3 className="text-lg font-bold">Audit Report:</h3>
              <p>{auditResult.auditReport}</p>
              <h4 className="font-semibold">Metrics:</h4>
              <ul>
                {auditResult.metrics.map((metric) => (
                  <li key={metric.metric}>
                    {metric.metric}: {metric.score}
                  </li>
                ))}
              </ul>
              <h4 className="font-semibold">Suggestions:</h4>
              <p>{auditResult.suggestions}</p>
            </div>
          )}
        </Vortex>
      </div>
    </>
  );
}

export default Page;
