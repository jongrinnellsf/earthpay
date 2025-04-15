import React, { useState } from "react";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-alchemy";
import { BlockieAvatar } from "~~/components/scaffold-alchemy/BlockieAvatar";

interface RecipientBalance {
  address: string;
  totalBalance: number;
}

interface CommunityProps {
  address: string;
  holders: string[];
  tokenBalances: any[];
  isLoadingRecipientBalances: boolean;
  recipientBalances: RecipientBalance[];
  fetchAllHoldersBalances: (holders: string[]) => void;
}

export const Community: React.FC<CommunityProps> = ({
  address,
  holders,
  tokenBalances,
  isLoadingRecipientBalances,
  recipientBalances,
  fetchAllHoldersBalances
}) => {
  const [selectedRecipient, setSelectedRecipient] = useState<string>("");
  const [transferAmount, setTransferAmount] = useState<string>("1");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { writeContractAsync: transferTokens, isPending: isTransferTokensPending } = useScaffoldWriteContract({
    contractName: "EarthToken",
  });

  // Handle transferring tokens
  const handleTransferTokens = async () => {
    if (!address || !selectedRecipient || !transferAmount) return;
    
    setErrorMessage("");
    
    try {
      // Convert amount to wei (18 decimals)
      const amount = BigInt(parseFloat(transferAmount) * 10**18);
      
      await transferTokens({
        functionName: "transferToEarthPassHolder",
        args: [selectedRecipient as `0x${string}`, amount],
      });
      
      // Reset form after successful transfer
      setTransferAmount("1");
      setSelectedRecipient("");
      
      // Refresh balances after transfer (assuming this function is passed from parent)
      setTimeout(() => {
        fetchAllHoldersBalances(holders);
      }, 2000);
    } catch (error) {
      console.error("Error transferring tokens:", error);
      setErrorMessage("Failed to transfer tokens. Please try again.");
    }
  };

  const hasTokens = tokenBalances.some(token => token.tokenBalance && parseInt(token.tokenBalance) > 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Community</h2>
        <button 
          className="px-3 py-1 bg-indigo-100 hover:bg-indigo-200 text-[#363FF9] rounded-full text-sm flex items-center"
          onClick={() => fetchAllHoldersBalances(holders)}
          disabled={isLoadingRecipientBalances}
        >
          {isLoadingRecipientBalances ? (
            <>
              <span className="loading loading-spinner loading-xs mr-1"></span>
              <span>Updating...</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh Balances</span>
            </>
          )}
        </button>
      </div>
      
      {/* Error message */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-xl mb-8 text-center">
          <p className="text-red-600">{errorMessage}</p>
        </div>
      )}
      
      {/* Transfer Tokens Section */}
      {hasTokens ? (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100 mb-8">
          <h3 className="font-bold text-lg mb-2 text-gray-700">Pay</h3>
          <p className="text-gray-600 mb-6 text-sm">Send tokens to other NFT holders</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select a recipient to pay
              </label>
              <div className="grid grid-cols-1 gap-2">
                {holders
                  .filter(holder => address && holder.toLowerCase() !== address.toLowerCase())
                  .sort((a, b) => {
                    const balanceA = recipientBalances.find(rb => rb.address.toLowerCase() === a.toLowerCase())?.totalBalance || 0;
                    const balanceB = recipientBalances.find(rb => rb.address.toLowerCase() === b.toLowerCase())?.totalBalance || 0;
                    return balanceB - balanceA; // Sort from highest to lowest
                  })
                  .map((holder, index) => {
                    // Find balance for this holder
                    const holderBalance = recipientBalances.find(
                      rb => rb.address.toLowerCase() === holder.toLowerCase()
                    );
                    
                    return (
                      <button
                        key={index}
                        className={`flex items-center p-3 rounded-lg border transition-all ${
                          selectedRecipient === holder 
                            ? 'bg-indigo-50 border-indigo-300 shadow-sm ring-2 ring-indigo-200' 
                            : 'bg-white border-gray-100 hover:bg-indigo-50 hover:border-indigo-200'
                        }`}
                        onClick={() => {
                          setSelectedRecipient(holder);
                          // Set default amount to 1 when selecting a recipient
                          if (transferAmount === "0" || transferAmount === "") {
                            setTransferAmount("1");
                          }
                        }}
                      >
                        <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3">
                          <BlockieAvatar address={holder} size={32} />
                        </div>
                        <div className="font-mono text-sm text-gray-700">
                          {holder.substring(0, 6)}...{holder.substring(holder.length - 4)}
                        </div>
                        <div className="ml-auto flex items-center">
                          {isLoadingRecipientBalances ? (
                            <span className="loading loading-spinner loading-xs text-[#363FF9]"></span>
                          ) : (
                            <div className="flex flex-col items-end">
                              <div className="flex items-center">
                                {holderBalance && holderBalance.totalBalance > 50 && (
                                  <span className="mr-1 text-amber-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                    </svg>
                                  </span>
                                )}
                                <span 
                                  className="text-xs font-medium px-2 py-0.5 bg-gradient-to-r from-indigo-100 to-indigo-50 text-indigo-800 rounded-full"
                                >
                                  {holderBalance ? Math.ceil(holderBalance.totalBalance) : '0'} tokens
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>
            
            {/* Only show amount selection if a recipient is selected */}
            {selectedRecipient ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount to pay
                </label>
                
                {/* Preset amount buttons */}
                <div className="grid grid-cols-4 gap-2 mb-3">
                  <button
                    className={`px-4 py-2 rounded-lg border transition-all ${
                      transferAmount === "1" 
                        ? 'bg-indigo-100 border-indigo-300 text-[#363FF9] font-medium' 
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-indigo-50'
                    }`}
                    onClick={() => setTransferAmount("1")}
                    type="button"
                  >
                    1 Token
                  </button>
                  <button
                    className={`px-4 py-2 rounded-lg border transition-all ${
                      transferAmount === "5" 
                        ? 'bg-indigo-100 border-indigo-300 text-[#363FF9] font-medium' 
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-indigo-50'
                    }`}
                    onClick={() => setTransferAmount("5")}
                    type="button"
                  >
                    5 Tokens
                  </button>
                  <button
                    className={`px-4 py-2 rounded-lg border transition-all ${
                      transferAmount === "10" 
                        ? 'bg-indigo-100 border-indigo-300 text-[#363FF9] font-medium' 
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-indigo-50'
                    }`}
                    onClick={() => setTransferAmount("10")}
                    type="button"
                  >
                    10 Tokens
                  </button>
                  <button
                    className={`px-4 py-2 rounded-lg border transition-all ${
                      !["1", "5", "10"].includes(transferAmount) 
                        ? 'bg-indigo-100 border-indigo-300 text-[#363FF9] font-medium' 
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-indigo-50'
                    }`}
                    onClick={() => {
                      if (["1", "5", "10"].includes(transferAmount)) {
                        setTransferAmount("0");
                      }
                    }}
                    type="button"
                  >
                    Custom
                  </button>
                </div>
                
                {/* Custom amount input - only shown when custom is selected */}
                {!["1", "5", "10"].includes(transferAmount) && (
                  <input 
                    type="text" 
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                    value={transferAmount === "0" ? "" : transferAmount}
                    onChange={(e) => {
                      const value = e.target.value === "" ? 0 : Math.floor(parseFloat(e.target.value));
                      if (isNaN(value)) {
                        setTransferAmount("");
                      } else if (value > 100) {
                        setTransferAmount("100");
                      } else {
                        setTransferAmount(value === 0 ? "" : value.toString());
                      }
                    }}
                    placeholder="Enter amount (max 100)"
                    style={{ appearance: "textfield" }}
                  />
                )}
                
                {/* Show max amount note */}
                <p className="text-xs text-gray-500 mt-1">Maximum: 100 tokens</p>
              </div>
            ) : (
              <div className="bg-blue-50 p-3 rounded-lg text-center mt-2">
                <p className="text-blue-700 text-sm">👆 Please select a recipient above to continue</p>
              </div>
            )}
            
            {/* Only show send button if a recipient is selected */}
            {selectedRecipient && (
              <button 
                className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-full transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center space-x-2 mt-4" 
                onClick={handleTransferTokens}
                disabled={isTransferTokensPending || !selectedRecipient || parseFloat(transferAmount) <= 0}
              >
                {isTransferTokensPending ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    <span>Processing payment...</span>
                  </>
                ) : (
                  "Pay Now"
                )}
              </button>
            )}
            
            <div className="text-xs text-gray-500 mt-2 text-center">
              <p>You can only transfer balances that you've minted with this app</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl mb-8 text-center">
          <p className="text-yellow-700 mb-2 font-medium">You need to mint first</p>
          <p className="text-yellow-600 text-sm mb-4">Go to the Balances tab to mint before you can transfer</p>
        </div>
      )}
    </div>
  );
}; 