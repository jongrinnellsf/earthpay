"use client";

import { useEffect, useState } from "react";
import { useAccount } from "@account-kit/react";
import type { NextPage } from "next";
import { Alchemy, Network } from "alchemy-sdk";
import { Address, Balance } from "~~/components/scaffold-alchemy";
import { useDeployedContractInfo, useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-alchemy";
import { EarthPassNFT, TokenBalances, SendModal } from "~~/components/earthpass";
import { Globe } from "~~/components/ui/globe";
import { parseEther } from "viem";
import { notification } from "~~/utils/scaffold-alchemy";
import "~~/types/contractTypes";

// Add type assertion for contract name to fix errors with dynamically deployed contracts
type DynamicContractName = "EarthToken" | "Counter" | "ExternalEarthPassNFT";

// Define the external contract address
const EXTERNAL_EARTHPASS_NFT_ADDRESS = "0x94ff63e2967e23ca39af55d57bf2d6654f71ed86";

export const DEFAULT_ALCHEMY_API_KEY = "Aau4vg0U-46T4ZI857caO7otLxX3RVSo";

// Initialize Alchemy SDK
const alchemy = new Alchemy({
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || DEFAULT_ALCHEMY_API_KEY, 
  network: Network.BASE_SEPOLIA,
});

interface TokenBalance {
  contractAddress: string;
  tokenBalance: string | null;
  name: string | null;
  symbol: string | null;
  logo: string | null;
  decimals: number | null;
}

interface RecentActivity {
  id: string;
  type: 'receive' | 'send';
  amount: string;
  from: string;
  to: string;
  timestamp: number;
}

interface RecipientOption {
  name: string;
  address: string;
}

const Home: NextPage = () => {
  const { address } = useAccount({
    type: "LightAccount",
  });
  const [hasNFT, setHasNFT] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("home");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState("0.10");
  const [selectedRecipient, setSelectedRecipient] = useState<RecipientOption | null>(null);
  
  // Get contract logs for the connected wallet
  const [walletLogs, setWalletLogs] = useState<any[]>([]);
  
  // Use the useContractLogs hook safely
  useEffect(() => {
    if (address) {
      // This is just a placeholder - we'll store the logs if needed later
      // Just to avoid calling the hook conditionally which causes React errors
      setWalletLogs([]);
    }
  }, [address]);
  
  // Mock recent activity data
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'receive',
      amount: '0.01',
      from: 'cilantro',
      to: address || '',
      timestamp: Date.now() - 166 * 24 * 60 * 60 * 1000 // 166 days ago
    },
    {
      id: '2',
      type: 'send',
      amount: '0.01',
      from: address || '',
      to: 'cilantro',
      timestamp: Date.now() - 166 * 24 * 60 * 60 * 1000 // 166 days ago
    }
  ]);

  // State for verified recipients (EarthPass holders)
  const [verifiedRecipients, setVerifiedRecipients] = useState<RecipientOption[]>([]);
  const [isLoadingRecipients, setIsLoadingRecipients] = useState(false);

  // Read all EarthPass holders from contract
  const { data: allEarthPassHolders, refetch: refetchEarthPassHolders } = useScaffoldReadContract({
    contractName: "ExternalEarthPassNFT",
    functionName: "getAllHolders",
    args: undefined,
    query: {
      enabled: Boolean(address) && hasNFT,
    },
  });

  // Function to refresh recipients list
  const handleRefreshRecipients = async () => {
    if (refetchEarthPassHolders) {
      setIsLoadingRecipients(true);
      try {
        await refetchEarthPassHolders();
      } catch (error) {
        console.error("Error refreshing recipients:", error);
      } finally {
        setTimeout(() => {
          setIsLoadingRecipients(false);
        }, 1000);
      }
    }
  };

  // When holders list changes, update recipient options
  useEffect(() => {
    if (allEarthPassHolders && address) {
      setIsLoadingRecipients(true);
      
      // Filter out the current user and create RecipientOption objects
      const holderOptions: RecipientOption[] = allEarthPassHolders
        .filter((holder: string) => holder.toLowerCase() !== address.toLowerCase())
        .map((holder: string) => {
          // Format the holder address for display
          const shortenedAddress = `${holder.substring(0, 6)}...${holder.substring(holder.length - 4)}`;
          return {
            name: shortenedAddress,
            address: holder
          };
        });

      setVerifiedRecipients(holderOptions);
      setIsLoadingRecipients(false);
    }
  }, [allEarthPassHolders, address]);

  // Read NFT ownership status
  const { data: hasEarthPassData, isLoading: isLoadingNFTStatus, refetch: refetchNFTStatus } = useScaffoldReadContract({
    contractName: "ExternalEarthPassNFT",
    functionName: "hasEarthPass",
    args: address ? [address as `0x${string}`] : [undefined],
    query: {
      enabled: !!address
    }
  });

  // Update state when contract data changes
  useEffect(() => {
    if (hasEarthPassData !== undefined) {
      setHasNFT(!!hasEarthPassData);
    }
  }, [hasEarthPassData]);

  // Update loading state
  useEffect(() => {
    setIsLoading(isLoadingNFTStatus);
  }, [isLoadingNFTStatus]);

  // Create a refresh handler for the EarthPassNFT component
  const handleRefreshNFTStatus = async () => {
    if (refetchNFTStatus) {
      setIsLoading(true);
      try {
        await refetchNFTStatus();
      } catch (error) {
        console.error("Error refreshing NFT status:", error);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    }
  };

  // Check if EarthToken is deployed
  const { data: tokenContractData } = useDeployedContractInfo({
    contractName: "EarthToken" as DynamicContractName,
  });

  // Read token balance
  const { data: tokenBalance, isLoading: isLoadingTokenBalance, refetch: refetchTokenBalance } = useScaffoldReadContract({
    contractName: "EarthToken" as DynamicContractName,
    functionName: "balanceOf" as any,
    args: [address!] as any,
    query: {
      enabled: Boolean(address) && Boolean(tokenContractData?.address),
    },
  });

  // Read token name
  const { data: tokenName } = useScaffoldReadContract({
    contractName: "EarthToken" as DynamicContractName,
    functionName: "name" as any,
    query: {
      enabled: Boolean(tokenContractData?.address),
    },
  });

  // Read token symbol
  const { data: tokenSymbol } = useScaffoldReadContract({
    contractName: "EarthToken" as DynamicContractName,
    functionName: "symbol" as any,
    query: {
      enabled: Boolean(tokenContractData?.address),
    },
  });

  // Handle refresh token balance
  const handleRefreshTokenBalance = async () => {
    if (refetchTokenBalance && tokenContractData?.address) {
      try {
        await refetchTokenBalance();
      } catch (error) {
        console.error("Error refreshing token balance:", error);
      }
    }
  };

  // Mint tokens state
  const [isMinting, setIsMinting] = useState(false);

  // Write contract functions
  const { writeContractAsync: mintTokens, isPending: isMintPending } = useScaffoldWriteContract({
    contractName: "EarthToken" as DynamicContractName,
  });
  
  // Write contract functions for sending tokens
  const { writeContractAsync: sendTokens, isPending: isSendPending } = useScaffoldWriteContract({
    contractName: "EarthToken" as DynamicContractName,
  });

  // Handle mint tokens function (renamed for clarity)
  const handleMintTokens = async () => {
    if (!address || !tokenContractData?.address) {
      notification.error(
        <span>The EarthToken contract has not been deployed yet. Please run 'yarn deploy' first to create your custom token.</span>
      );
      return;
    }

    setIsMinting(true);
    try {
      await mintTokens({
        functionName: "mint" as any,
        args: [parseEther("10")] as any,
      });
      
      // Add minting to recent activity
      const newActivity = {
        id: Date.now().toString(),
        type: 'receive' as const,
        amount: "10",
        from: "Deposit",
        to: address || '',
        timestamp: Date.now()
      };
      
      setRecentActivity(prev => [newActivity, ...prev]);
      
      notification.success(
        <span>Successfully deposited 10 {tokenName || "tokens"}!</span>
      );
    } catch (error) {
      console.error("Error minting tokens:", error);
      notification.error(
        <span>Failed to deposit funds. Please check if you own an EarthPass NFT.</span>
      );
    } finally {
      setIsMinting(false);
    }
  };

  // Get token balance in a readable format
  const getTokenBalance = () => {
    if (!tokenContractData?.address) return "0.00";
    if (!tokenBalance) return "0.00";
    
    // Convert from Wei (tokenBalance is in Wei format)
    const balance = Number(tokenBalance) / 10**18;
    return balance.toFixed(2);
  };

  // Modify the getTotalBalance function to use tokenBalance
  const getTotalBalance = () => {
    // Return token balance instead of Alchemy fetched balance
    return getTokenBalance();
  };

  // Handle send transaction
  const handleSend = async () => {
    if (!selectedRecipient) return;
    
    // Check if EarthToken contract is deployed
    if (!tokenContractData?.address) {
      notification.error(
        <span>The token contract has not been deployed yet. Please run 'yarn deploy' to create your custom token.</span>
      );
      return;
    }

    try {
      // Convert dollar amount to tokens (1:1 ratio for simplicity)
      const tokenAmount = parseEther(selectedAmount);
      
      // Call the contract's transfer function
      await sendTokens({
        functionName: "transferToEarthPassHolder" as any,
        args: [selectedRecipient.address, tokenAmount] as any,
      });
      
      // Add to recent activity
      const newActivity = {
        id: Date.now().toString(),
        type: 'send' as const,
        amount: selectedAmount,
        from: address || '',
        to: selectedRecipient.name,
        timestamp: Date.now()
      };
      
      setRecentActivity(prev => [newActivity, ...prev]);
      
      // Close modal and reset selection
      setIsModalOpen(false);
      setSelectedRecipient(null);
      
      // Refresh token balance
      if (refetchTokenBalance) {
        await refetchTokenBalance();
      }
      
      notification.success(
        <span>Successfully sent {selectedAmount} {tokenName || "tokens"} to {selectedRecipient.name}!</span>
      );
    } catch (error) {
      console.error("Error sending tokens:", error);
      notification.error(
        <span>Failed to send tokens. Make sure the recipient has an EarthPass NFT.</span>
      );
      throw error; // Rethrow to be caught by the modal
    }
  };

  return (
    <>
      {/* Background with gradient and decorative elements */}
      <div className="fixed inset-0 bg-white -z-10" />
      <div className="fixed top-20 right-20 w-64 h-64 rounded-full bg-[#363FF9] opacity-10 blur-3xl -z-10" />
      <div className="fixed bottom-20 left-20 w-80 h-80 rounded-full bg-[#8B5CF6] opacity-10 blur-3xl -z-10" />
      
      <div className="min-h-screen">
        <main className="px-5 pb-20">
          {/* Verification Badge for header - shown when user has NFT */}
          {address && hasNFT && (
            <div className="my-6 max-w-xl mx-auto bg-indigo-50 border border-indigo-200 rounded-full px-6 py-2.5 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-indigo-600 font-medium text-sm">Verified EarthPass Member</span>
            </div>
          )}
        
          <div className="max-w-6xl mx-auto">
            {/* Hero section with Globe for non-logged in users */}
            {!address ? (
              <div className="relative overflow-visible h-screen">
                <div className="relative h-screen">
                  {/* Globe positioned to be fully visible */}
                  <div className="absolute inset-0 flex items-center justify-center w-full">
                    <Globe className="z-0" />
                  </div>
                  
                  {/* Hero Text positioned in the center of the globe */}
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center">
                    <div className="max-w-2xl p-10">
                      <h1 className="text-7xl font-bold mb-4 text-[#363FF9]">
                        EarthPay
                      </h1>
                      <h2 className="text-4xl font-bold mb-4">
                        <span className="text-gray-800">Payments </span>
                        <span className="text-[#363FF9]">Made</span>{" "}
                        <span className="text-[#363FF9]">Simple</span>
                      </h2>
                      <p className="text-xl text-gray-700 mx-auto max-w-lg">
                        A demo app. Send money anywhere in the world for free to verified EarthPass members.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* For logged-in users, just add some top spacing */
              <div className="h-4"></div>
            )}
            
            {/* Error message */}
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-xl mb-8 text-center max-w-2xl mx-auto">
                <p className="text-red-600">{errorMessage}</p>
              </div>
            )}
            
            {/* App content - Only show for logged in users */}
            {address && (
              <div className="max-w-xl mx-auto">
                <div className="space-y-6">
                  {/* Navigation Tabs */}
                  <div className="bg-white rounded-full shadow-sm p-1 flex justify-center">
                    <button 
                      className={`flex-1 flex items-center justify-center gap-2 px-6 py-2 rounded-full text-center text-lg font-medium transition-all ${activeTab === 'home' ? 'bg-gradient-to-r from-[#363FF9] to-[#5498FF] text-white shadow-md' : 'text-gray-600 hover:bg-indigo-50'}`}
                      onClick={() => setActiveTab('home')}
                    >
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.07926 0.222253C7.31275 -0.007434 7.6873 -0.007434 7.92079 0.222253L14.6708 6.86227C14.907 7.09465 14.9101 7.47453 14.6778 7.71076C14.4454 7.947 14.0655 7.95012 13.8293 7.71773L13 6.90201V12.5C13 12.7761 12.7762 13 12.5 13H2.50002C2.22388 13 2.00002 12.7761 2.00002 12.5V6.90201L1.17079 7.71773C0.934558 7.95012 0.554672 7.947 0.32229 7.71076C0.0899079 7.47453 0.0930283 7.09465 0.32926 6.86227L7.07926 0.222253ZM7.50002 1.49163L12 5.91831V12H10V8.49999C10 8.22385 9.77617 7.99999 9.50002 7.99999H6.50002C6.22388 7.99999 6.00002 8.22385 6.00002 8.49999V12H3.00002V5.91831L7.50002 1.49163ZM7.00002 12H9.00002V8.99999H7.00002V12Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
                      </svg>
                      Home
                    </button>
                    <button 
                      className={`flex-1 flex items-center justify-center gap-2 px-6 py-2 rounded-full text-center text-lg font-medium transition-all ${activeTab === 'send' ? 'bg-gradient-to-r from-[#363FF9] to-[#5498FF] text-white shadow-md' : 'text-gray-600 hover:bg-indigo-50'}`}
                      onClick={() => setActiveTab('send')}
                    >
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.20308 1.04312C1.00481 0.954998 0.772341 1.0048 0.627577 1.16641C0.482813 1.32802 0.458794 1.56455 0.568117 1.75196L3.92115 7.50002L0.568117 13.2481C0.458794 13.4355 0.482813 13.672 0.627577 13.8336C0.772341 13.9952 1.00481 14.045 1.20308 13.9569L14.7031 7.95693C14.8836 7.87668 15 7.69762 15 7.50002C15 7.30243 14.8836 7.12337 14.7031 7.04312L1.20308 1.04312ZM4.84553 7.10002L2.21234 2.586L13.2689 7.50002L2.21234 12.414L4.84552 7.90002H9C9.22092 7.90002 9.4 7.72094 9.4 7.50002C9.4 7.27911 9.22092 7.10002 9 7.10002H4.84553Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
                      </svg>
                      Send
                    </button>
                  </div>
                  
                  {/* Home Tab Content */}
                  {activeTab === 'home' && (
                    <div className="space-y-6">
                      {/* If user doesn't have NFT, show get verified button */}
                      {!hasNFT ? (
                        <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 text-center">
                          <h2 className="text-2xl font-bold mb-4 text-gray-800">Get Started</h2>
                          <p className="mb-6 text-gray-600">
                            You need to get verified with an EarthPass NFT to access our deposit and payment features.
                          </p>
                          <EarthPassNFT 
                            address={address}
                            hasNFT={hasNFT}
                            isLoading={isLoading}
                            onRefresh={handleRefreshNFTStatus}
                          />
                        </div>
                      ) : (
                        <>
                          {/* Balance Card */}
                          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                            <p className="text-xl text-gray-600 mb-1">Your balance</p>
                            <p className="text-6xl font-semibold text-gray-800 mb-8">${getTotalBalance()}</p>
                            
                            {/* Action Buttons */}
                            <div className="flex justify-between gap-4">
                              <button 
                                className="flex-1 flex flex-col items-center justify-center p-4 bg-[#363FF9] text-white rounded-full shadow-lg disabled:opacity-50"
                                onClick={handleMintTokens}
                                disabled={isMinting || !hasNFT || !tokenContractData?.address}
                              >
                                {isMinting ? (
                                  <div className="flex flex-col items-center justify-center">
                                    <svg className="animate-spin w-8 h-8 mb-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span className="text-xl">Depositing...</span>
                                  </div>
                                ) : (
                                  <>
                                    <svg width="24" height="24" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
                                    </svg>
                                    <span className="mt-3 text-xl">Deposit Funds</span>
                                  </>
                                )}
                              </button>
                              
                      <button 
                                className="flex-1 flex flex-col items-center justify-center p-4 bg-[#363FF9] text-white rounded-full shadow-lg"
                                onClick={() => setActiveTab('send')}
                              >
                                <svg width="24" height="24" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M1.20308 1.04312C1.00481 0.954998 0.772341 1.0048 0.627577 1.16641C0.482813 1.32802 0.458794 1.56455 0.568117 1.75196L3.92115 7.50002L0.568117 13.2481C0.458794 13.4355 0.482813 13.672 0.627577 13.8336C0.772341 13.9952 1.00481 14.045 1.20308 13.9569L14.7031 7.95693C14.8836 7.87668 15 7.69762 15 7.50002C15 7.30243 14.8836 7.12337 14.7031 7.04312L1.20308 1.04312ZM4.84553 7.10002L2.21234 2.586L13.2689 7.50002L2.21234 12.414L4.84552 7.90002H9C9.22092 7.90002 9.4 7.72094 9.4 7.50002C9.4 7.27911 9.22092 7.10002 9 7.10002H4.84553Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
                                </svg>
                                <span className="mt-3 text-xl">Send</span>
                      </button>
                            </div>
                            
                            {!tokenContractData?.address && (
                              <div className="mt-4 text-center text-sm text-indigo-800 bg-indigo-50 p-6 rounded-lg border border-indigo-200">
                                <div className="flex items-center justify-center mb-3">
                                  <span className="text-xl text-indigo-600 mr-2">✨</span>
                                  <strong className="text-lg">Setup Your Personal Token</strong>
                                </div>
                                <p className="mb-3">To get started, you'll need to create your own custom token. It only takes a minute and lets you send money to anyone in your community!</p>
                                <div 
                                  className="bg-white p-3 rounded-xl border border-indigo-100 font-mono text-center my-4 shadow-sm cursor-pointer hover:bg-indigo-50 transition-colors flex items-center justify-center"
                                  onClick={() => {
                                    navigator.clipboard.writeText('yarn deploy');
                                    // You could add a toast notification here
                                  }}
                                >
                                  yarn deploy
                                </div>
                                <p className="text-indigo-700">Simply run this command in your terminal and follow the prompts to name your token.</p>
                              </div>
                            )}
                          </div>
                          
                          {/* Recent Activity Section */}
                          {/* Commented out for now */}
                          {/*
                          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                            <h2 className="text-2xl text-gray-700 mb-6">Recent activity</h2>
                            
                            
                            {hasNFT && tokenContractData?.address && (
                              <div className="bg-white p-4 rounded-xl mb-6 border border-gray-200 shadow-sm">
                                <div className="flex justify-between items-center mb-3">
                                  <h3 className="text-lg font-semibold text-gray-800">Token Balance</h3>
                                  <button 
                                    onClick={handleRefreshTokenBalance}
                                    className="text-gray-500 hover:text-gray-700"
                                    disabled={isLoadingTokenBalance}
                                  >
                                    <svg 
                                      className={`h-5 w-5 ${isLoadingTokenBalance ? 'animate-spin' : ''}`} 
                                      xmlns="http://www.w3.org/2000/svg" 
                                      fill="none" 
                                      viewBox="0 0 24 24"
                                    >
                                      {isLoadingTokenBalance ? (
                                        <>
                                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </>
                                      ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                      )}
                          </svg>
                                  </button>
                                </div>
                                
                                <div className="flex items-center p-3 rounded-lg bg-indigo-50 border border-indigo-100">
                                  <div className="flex-shrink-0 mr-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#363FF9] to-[#5498FF] flex items-center justify-center">
                                    </div>
                                  </div>
                                  <div className="flex-grow">
                                    <div className="font-medium text-gray-800">{tokenName || "Community Tokens"}</div>
                                    <div className="flex justify-between items-center">
                                      <span className="text-xs text-gray-500">{tokenSymbol || "TOKEN"}</span>
                                      <span className="text-sm text-indigo-600 font-medium">
                                        {getTokenBalance()}
                                      </span>
                                    </div>
                        </div>
                      </div>
                      
                                <div className="mt-3 text-center">
                                  <button 
                                    className="text-indigo-600 text-sm font-medium hover:text-indigo-700"
                                    onClick={() => setActiveTab('deposit')}
                                  >
                                    Deposit More {tokenName ? tokenName : "Tokens"}
                                  </button>
                                </div>
                              </div>
                            )}
                            
                            <div className="space-y-4">
                              {recentActivity.map(activity => (
                                <div key={activity.id} className="flex items-center justify-between py-3 border-b border-gray-100">
                                  <div className="flex items-center">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                                      activity.type === 'receive' 
                                        ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white' 
                                        : 'bg-gradient-to-br from-[#363FF9] to-[#5498FF] text-white'
                                    }`}>
                                      <span className="text-xl">{activity.type === 'receive' ? '↓' : '↑'}</span>
                                    </div>
                                    <div>
                                      <p className="font-medium">
                                        {activity.type === 'receive' ? 'From' : 'To'} {activity.type === 'receive' ? activity.from : activity.to}
                                      </p>
                                      <p className="text-gray-500 text-sm">
                                        {new Date(activity.timestamp).toLocaleDateString()}
                                      </p>
                                    </div>
                                  </div>
                                  <p className={`font-semibold ${activity.type === 'receive' ? 'text-green-600' : 'text-[#363FF9]'}`}>
                                    {activity.type === 'receive' ? '+' : '-'} ${activity.amount}
                                  </p>
                                </div>
                              ))}
                              
                              {recentActivity.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                  No activity to display yet
                                </div>
                              )}
                            </div>
                          </div>
                          */}
                        </>
                      )}
                    </div>
                  )}
                  
                  {/* Send Tab Content */}
                  {activeTab === 'send' && (
                    <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100">
                      <h2 className="text-2xl font-bold mb-4 text-gray-800">Send Money</h2>
                      
                      {!hasNFT ? (
                        <>
                          <p className="mb-6 text-gray-600">
                            You need to get verified with an EarthPass NFT first.
                          </p>
                          <EarthPassNFT 
                          address={address}
                            hasNFT={hasNFT}
                            isLoading={isLoading}
                            onRefresh={handleRefreshNFTStatus}
                          />
                        </>
                      ) : Number(getTokenBalance()) <= 0 ? (
                        <div className="py-8 text-center">
                          <div className="text-indigo-600 text-3xl mb-4">💸</div>
                          <h3 className="text-xl font-medium mb-4">Insufficient Balance</h3>
                          <p className="text-gray-600 mb-6">
                            You need to deposit funds before you can send tokens to others.
                          </p>
                          <button 
                            className="px-8 py-3 bg-[#363FF9] hover:bg-[#2C35DF] text-white font-medium rounded-full transition-all shadow-lg"
                            onClick={() => setActiveTab('deposit')}
                          >
                            Deposit Funds
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <p className="text-gray-600 mb-6">
                            Send money to other verified users in your community.
                          </p>
                          
                          {/* Recipient Selection */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <label htmlFor="recipient" className="text-sm font-medium text-gray-700">
                                Select Recipient
                              </label>
                              <div className="flex items-center space-x-2">
                                {isLoadingRecipients && (
                                  <span className="text-xs text-gray-500 flex items-center">
                                    <svg className="animate-spin h-3 w-3 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Loading
                                  </span>
                                )}
                                <button 
                                  onClick={handleRefreshRecipients}
                                  disabled={isLoadingRecipients}
                                  className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
                                  title="Refresh recipients list"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                            <select
                              id="recipient"
                              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              value={selectedRecipient?.address || ""}
                              onChange={(e) => {
                                const selected = verifiedRecipients.find(r => r.address === e.target.value);
                                setSelectedRecipient(selected || null);
                              }}
                              disabled={isLoadingRecipients || verifiedRecipients.length === 0}
                            >
                              <option value="" disabled>
                                {verifiedRecipients.length === 0 
                                  ? "No verified recipients available" 
                                  : "Choose a recipient"}
                              </option>
                              {verifiedRecipients.map(recipient => (
                                <option key={recipient.address} value={recipient.address}>
                                  {recipient.name}
                                </option>
                              ))}
                            </select>
                            {verifiedRecipients.length === 0 && !isLoadingRecipients && (
                              <p className="text-xs text-indigo-600 mt-1">
                                No other verified EarthPass holders found. Invite friends to join!
                              </p>
                      )}
                    </div>
                          
                          {/* Amount Input */}
                          <div className="space-y-2">
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                              Amount (USD)
                            </label>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 text-lg">$</span>
                              <input
                                type="number"
                                id="amount"
                                className="w-full p-3 pl-8 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="0.00"
                                value={selectedAmount}
                                onChange={(e) => setSelectedAmount(e.target.value)}
                                step="0.01"
                                min="0.01"
                              />
                            </div>
                          </div>
                          
                          {/* Secure Token Transfer Note */}
                          <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                            <p className="text-indigo-700 text-sm flex items-start">
                              <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>
                                You're sending secure ERC-20 tokens that can only be transferred between verified members of your community.
                              </span>
                            </p>
                          </div>
                          
                          {/* Send Button */}
                          <div className="mt-8">
                            <button
                              className="w-full py-3 px-4 bg-[#363FF9] text-white text-lg font-medium rounded-full hover:bg-[#2C35DF] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                              onClick={() => {
                                if (selectedRecipient && parseFloat(selectedAmount) > 0) {
                                  setIsModalOpen(true);
                                }
                              }}
                              disabled={!selectedRecipient || parseFloat(selectedAmount) <= 0}
                            >
                              Continue to Send
                            </button>
                          </div>
                          
                          {/* Maximum Balance Note */}
                          <p className="text-sm text-gray-500 text-center">
                            Available balance: ${getTotalBalance()}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Deposit Tab Content (renamed from Mint Tokens) */}
                  {activeTab === 'deposit' && (
                    <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 text-center">
                      <h2 className="text-2xl font-bold mb-4 text-gray-800">Deposit Funds</h2>
                      
                      {!hasNFT ? (
                        <>
                          <p className="mb-6 text-gray-600">
                            You need to get verified with an EarthPass NFT first.
                          </p>
                        <EarthPassNFT 
                          address={address}
                          hasNFT={hasNFT}
                          isLoading={isLoading}
                            onRefresh={handleRefreshNFTStatus}
                          />
                        </>
                      ) : !tokenContractData?.address ? (
                        <div className="py-8 text-center">
                          <div className="text-indigo-600 text-4xl mb-4">✨</div>
                          <h3 className="text-xl font-medium mb-4 text-indigo-900">Create Your Token</h3>
                          <p className="text-gray-700 mb-5">
                            You're almost there! Just set up your custom token to start making deposits.
                          </p>
                          <div 
                            className="bg-indigo-50 p-4 rounded-xl text-center text-sm font-mono mb-5 border border-indigo-100 mx-auto max-w-xs shadow-sm cursor-pointer hover:bg-indigo-100 transition-colors flex items-center justify-center"
                            onClick={() => {
                              navigator.clipboard.writeText('yarn deploy');
                              // You could add a toast notification here
                            }}
                          >
                            yarn deploy
                          </div>
                          <p className="text-indigo-700 text-sm">
                            Run this command to create your personal token. It only takes a minute!
                          </p>
                        </div>
                      ) : (
                        <div className="py-8">
                          <div className="text-[#363FF9] text-6xl mb-6">{getTokenBalance()}</div>
                          <p className="text-gray-600 mb-6">Current {tokenName || "Token"} Balance</p>
                          
                          <button
                            className="w-full py-3 px-4 bg-[#363FF9] text-white text-lg font-medium rounded-full hover:bg-[#2C35DF] disabled:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            onClick={handleMintTokens}
                            disabled={isMinting}
                          >
                            {isMinting ? (
                              <div className="flex items-center justify-center">
                                <svg className="animate-spin w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Depositing...
                              </div>
                            ) : (
                              <div className="flex items-center justify-center gap-2">
                                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
                                </svg>
                                Deposit 10 {tokenSymbol || "Tokens"}
                              </div>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Send Modal */}
          {selectedRecipient && (
            <SendModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              recipient={selectedRecipient}
              amount={selectedAmount}
              onSend={handleSend}
            />
          )}
        </main>
      </div>
    </>
  );
};

export default Home;
