import React from "react";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-alchemy";
import { MiniChart } from "./MiniChart";

interface TokenBalance {
  contractAddress: string;
  tokenBalance: string | null;
  name: string | null;
  symbol: string | null;
  logo: string | null;
  decimals: number | null;
}

interface TokenBalancesProps {
  address: string;
  tokenBalances: TokenBalance[];
  isLoadingTokens: boolean;
  onRefreshBalances: () => void;
}

// Generate a realistic price change percentage based on trend
const generatePriceChange = (trend: 'up' | 'down' | 'neutral') => {
  if (trend === 'neutral') return (Math.random() * 0.2 - 0.1).toFixed(2);
  if (trend === 'up') return (0.1 + Math.random() * 4.9).toFixed(2);
  return (-0.1 - Math.random() * 4.9).toFixed(2);
};

// Helper function to generate gradient color based on address
const getGradientColor = (address: string) => {
  // Generate a deterministic color based on the address
  const hash = address.toLowerCase().substring(2, 10); // Use part of the address
  const hue = parseInt(hash, 16) % 360; // Convert to a hue value (0-359)
  return `hsl(${hue}, 80%, 65%)`; // Return HSL color with fixed saturation and lightness
};

export const TokenBalances: React.FC<TokenBalancesProps> = ({ 
  address, 
  tokenBalances, 
  isLoadingTokens, 
  onRefreshBalances 
}) => {
  // For demo purposes, we're just using the function to refresh the token balances
  // In a real implementation, this would connect to a deposit service
  const handleDeposit = () => {
    // In a real implementation, this would initiate a deposit transaction
    // For now, just refresh the token balances after a short delay to simulate a deposit
    setTimeout(onRefreshBalances, 2000);
  };

  if (isLoadingTokens) {
    return (
      <div className="flex justify-center py-10">
        <span className="loading loading-spinner loading-lg text-[#363FF9]"></span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tokenBalances.map((token, index) => {
        // Randomly assign a trend for each token
        const trends: Array<'up' | 'down'> = ['up', 'down'];
        const randomTrend = trends[Math.floor(Math.random() * trends.length)];
        const priceChange = generatePriceChange(randomTrend);
        const isPositive = parseFloat(priceChange) > 0;
        
        return (
          <div key={index} className="flex items-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4 text-3xl">
              {token.logo ? (
                <img src={token.logo} alt={token.name || "Unknown Token"} className="w-8 h-8 rounded-full" />
              ) : (
                <div className="w-8 h-8 rounded-full" style={{ background: getGradientColor(token.contractAddress) }}></div>
              )}
            </div>
            <div className="flex-grow">
              <div className="flex items-center justify-between">
                <p className="font-bold text-gray-800 text-sm">{token.name || "Unknown Token"}</p>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                }`}>
                  {isPositive ? '↑' : '↓'} 
                  {isPositive ? '+' : ''}
                  {priceChange}%
                </span>
              </div>
              <div className="flex items-center">
                <p className="text-gray-600 font-medium text-sm">
                  {token.tokenBalance && token.decimals
                    ? Math.ceil(parseInt(token.tokenBalance) / Math.pow(10, token.decimals))
                    : "0"}{" "}
                  {token.symbol}
                </p>
              </div>
            </div>
            <div className="flex-shrink-0 ml-2">
              <MiniChart trend={randomTrend} />
            </div>
          </div>
        );
      })}
      
      {tokenBalances.length === 0 && (
        <div className="text-center py-10 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="mb-6 text-gray-600">You currently have no funds in your wallet</p>
          <div className="flex justify-center">
            <button 
              className="px-8 py-3 bg-[#363FF9] hover:bg-[#2C35DF] text-white font-medium rounded-full transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center space-x-2" 
              onClick={handleDeposit}
            >
              <span>Deposit Funds</span>
            </button>
          </div>
        </div>
      )}
      
      {tokenBalances.length > 0 && (
        <div className="flex flex-col space-y-4 mt-8">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex justify-center">
              <button 
                className="px-6 py-3 bg-[#363FF9] hover:bg-[#2C35DF] text-white font-medium rounded-full transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center space-x-2" 
                onClick={handleDeposit}
              >
                <span>Deposit More Funds</span>
              </button>
            </div>
            
            {/* Information about sending money */}
            <div className="px-6 py-4 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-xl text-center">
              <p className="font-medium mb-1">Send Money</p>
              <p className="text-sm">Use the Send tab to transfer money to other verified members</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 