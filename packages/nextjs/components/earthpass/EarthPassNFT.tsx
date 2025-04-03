import React from "react";
import { useUser } from "@account-kit/react";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-alchemy";

interface EarthPassNFTProps {
  address: string;
  hasNFT: boolean;
  isLoading: boolean;
  onRefresh?: () => void;
}

export const EarthPassNFT: React.FC<EarthPassNFTProps> = ({ address, hasNFT, isLoading, onRefresh }) => {
  const user = useUser();
  
  // Setup contract write function
  const { writeContractAsync: mintNFT, isPending: isMintPending } = useScaffoldWriteContract({
    contractName: "ExternalEarthPassNFT",
  });

  // Handle minting NFT
  const handleMintNFT = async () => {
    if (!address) return;
    
    try {
      // Call the mintEarthPass function on the contract
      await mintNFT({
        functionName: "mintEarthPass",
      });
      
      // The state will be updated automatically via the useScaffoldReadContract hooks
    } catch (error) {
      console.error("Error minting NFT:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <span className="loading loading-spinner loading-lg text-[#363FF9]"></span>
      </div>
    );
  }
  
  if (!hasNFT) {
    return (
      <div className="text-center">
        <button 
          className="px-8 py-3 bg-[#363FF9] hover:bg-[#2C35DF] text-white font-medium rounded-full transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center space-x-2 mx-auto mb-4" 
          onClick={handleMintNFT}
          disabled={isMintPending}
        >
          {isMintPending ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              <span>Verifying...</span>
            </>
          ) : (
            "Get Verified"
          )}
        </button>
        
        {/* Refresh button */}
        <button 
          className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-all flex items-center justify-center space-x-2 mx-auto" 
          onClick={onRefresh}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Already verified? Refresh</span>
        </button>
      </div>
    );
  }
  
  return (
    <>
      <div className="text-center">
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 p-4 rounded-xl mb-8 mt-4">
          <p className="text-indigo-600 font-bold text-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Verified EarthPass™ Member
          </p>
        </div>
        
        {/* NFT Certificate Display */}
        <div className="relative mx-auto max-w-md">
          <div className="absolute inset-0 bg-white rounded-2xl shadow-lg"></div>
          
          <div className="relative bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
            
            {/* Credit card design */}
            {address && (
              <div className="w-full aspect-[1.586/1] relative rounded-xl overflow-hidden">
                {/* Card background with gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#363FF9] via-[#5498FF] to-[#973DF9]"></div>
                
                {/* Decorative elements */}
                <div className="absolute inset-0 overflow-hidden">
                  {/* Circular decorative elements */}
                  <div className="absolute top-[-50px] right-[-20px] w-64 h-64 rounded-full bg-[#5498FF] opacity-20 blur-sm"></div>
                  <div className="absolute bottom-[-30px] left-[-20px] w-48 h-48 rounded-full bg-[#973DF9] opacity-20 blur-sm"></div>
                  
                  {/* Holographic effect */}
                  <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-gradient-to-r from-indigo-300 via-blue-300 to-purple-300 opacity-30 blur-sm"></div>
                  <div className="absolute top-12 left-12 w-16 h-16 rounded-full bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300 opacity-20 blur-sm"></div>
                  
                  {/* Security pattern */}
                  <div className="absolute inset-0">
                    {Array.from({ length: 15 }).map((_, i) => (
                      <div 
                        key={i} 
                        className="absolute text-white text-opacity-10 font-mono text-xs"
                        style={{
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                          transform: `rotate(${Math.random() * 360}deg)`,
                        }}
                      >
                        EarthPass
                      </div>
                    ))}
                  </div>
                  
                  {/* Wave pattern at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-24">
                    <svg viewBox="0 0 400 100" preserveAspectRatio="none" className="w-full h-full">
                      <path 
                        d="M0,50 C150,120 250,0 400,60 L400,100 L0,100 Z" 
                        fill="rgba(255,255,255,0.1)"
                      />
                      <path 
                        d="M0,70 C150,20 250,100 400,50 L400,100 L0,100 Z" 
                        fill="rgba(255,255,255,0.05)"
                      />
                    </svg>
                  </div>
                </div>
                
                {/* Card content */}
                <div className="absolute inset-0 flex flex-col justify-between p-6">
                  {/* Top section with logo and chip */}
                  <div className="flex justify-between items-start relative z-10">
                    <div className="text-white font-bold text-xl tracking-wider drop-shadow-md flex items-center">
                      <svg className="w-6 h-6 mr-2" viewBox="0 0 66 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M54.6199 35.8503L33.8438 0.577318C33.7432 0.403146 33.5975 0.258061 33.4215 0.156704C33.2454 0.0553471 33.0451 0.00130211 32.841 2.32362e-05C32.6368 -0.00125564 32.4359 0.0502763 32.2585 0.14942C32.0812 0.248563 31.9337 0.391811 31.8308 0.564709L25.6086 11.134C25.4048 11.48 25.2975 11.8724 25.2975 12.2719C25.2975 12.6714 25.4048 13.0639 25.6086 13.4099L39.156 36.4208C39.3599 36.7671 39.6534 37.0546 40.0068 37.2544C40.3602 37.4542 40.761 37.5591 41.1689 37.5587H53.6135C53.8172 37.5581 54.0172 37.5051 54.1935 37.405C54.3698 37.3049 54.5162 37.1612 54.618 36.9883C54.7199 36.8154 54.7737 36.6192 54.774 36.4195C54.7744 36.2198 54.7212 36.0235 54.6199 35.8503Z" fill="white"/>
                        <path d="M0.160205 54.2852L20.9363 19.0123C21.0383 18.8395 21.1848 18.696 21.3612 18.5963C21.5376 18.4965 21.7376 18.444 21.9412 18.444C22.1448 18.444 22.3449 18.4965 22.5213 18.5963C22.6977 18.696 22.8442 18.8395 22.9461 19.0123L29.1716 29.5721C29.3753 29.9186 29.4825 30.3116 29.4825 30.7116C29.4825 31.1116 29.3753 31.5046 29.1716 31.8511L15.6241 54.862C15.4209 55.2083 15.1281 55.4959 14.7752 55.6957C14.4223 55.8955 14.0219 56.0005 13.6144 56H1.1667C0.961642 56.001 0.759984 55.9488 0.582217 55.8486C0.404449 55.7484 0.256935 55.6038 0.154671 55.4296C0.0524063 55.2553 -0.000962742 55.0577 1.31472e-05 54.8567C0.000989036 54.6556 0.056254 54.4585 0.160205 54.2852Z" fill="white"/>
                        <path d="M22.9431 55.9924H64.4954C64.6992 55.9923 64.8995 55.9395 65.0759 55.8394C65.2523 55.7393 65.3987 55.5954 65.5004 55.4222C65.6021 55.249 65.6555 55.0527 65.6552 54.8529C65.6549 54.6531 65.6009 54.4568 65.4987 54.284L59.2829 43.7178C59.0789 43.3715 58.7855 43.084 58.4321 42.8842C58.0787 42.6845 57.6778 42.5795 57.2699 42.5799H30.1751C29.7671 42.5795 29.3663 42.6845 29.0129 42.8842C28.6595 43.084 28.3661 43.3715 28.1621 43.7178L21.9399 54.284C21.8377 54.4568 21.7837 54.6531 21.7834 54.8529C21.7831 55.0527 21.8365 55.249 21.9382 55.4222C22.0399 55.5954 22.1863 55.7393 22.3627 55.8394C22.5391 55.9395 22.7393 55.9923 22.9431 55.9924Z" fill="white"/>
                      </svg>
                      EarthPass™
                    </div>
                    <div className="flex flex-col items-end">
                      {/* EMV chip */}
                      <div className="w-12 h-9 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-md opacity-90 mb-1 shadow-sm relative overflow-hidden">
                        {/* Chip contacts */}
                        <div className="absolute inset-1 grid grid-cols-2 gap-1">
                          <div className="bg-yellow-600 rounded-sm"></div>
                          <div className="bg-yellow-600 rounded-sm"></div>
                          <div className="bg-yellow-600 rounded-sm"></div>
                          <div className="bg-yellow-600 rounded-sm"></div>
                          <div className="bg-yellow-600 rounded-sm"></div>
                          <div className="bg-yellow-600 rounded-sm"></div>
                        </div>
                      </div>
                      <div className="text-white text-xs font-mono opacity-90">PREMIUM</div>
                    </div>
                  </div>
                  
                  {/* Middle section with card number */}
                  <div className="relative z-10 my-4">
                    <div className="text-white font-mono text-xl tracking-widest opacity-90 drop-shadow-md flex justify-between">
                      <span>****</span>
                      <span>****</span>
                      <span>****</span>
                      <span>{address.substring(address.length - 4)}</span>
                    </div>
                    
                    {/* Card type and additional details */}
                    <div className="flex justify-between items-center mt-3">
                      <div className="text-white text-xs font-mono opacity-70">
                        ONCHAIN VERIFIED
                      </div>
                    </div>
                  </div>
                  
                  {/* Bottom section with cardholder info */}
                  <div className="mt-auto relative z-10 text-left">
                    <div className="text-white text-sm font-mono tracking-wider mb-1 opacity-90 drop-shadow-md text-left">
                      CARDHOLDER
                    </div>
                    <div className="text-white font-mono text-lg tracking-widest font-medium drop-shadow-md truncate max-w-full text-left">
                      {user?.email || `${address.substring(0, 6)}...${address.substring(address.length - 4)}`}
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <div className="text-white text-xs font-mono tracking-wider opacity-90 drop-shadow-md">
                        MEMBER SINCE {new Date().getFullYear()}
                      </div>
                      <div className="text-white text-xs font-mono tracking-wider opacity-90 drop-shadow-md">
                        VALID THRU ∞
                      </div>
                    </div>
                  </div>
                  
                  {/* Add a larger logo watermark in the background */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0 opacity-10">
                    <svg className="w-40 h-40" viewBox="0 0 66 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M54.6199 35.8503L33.8438 0.577318C33.7432 0.403146 33.5975 0.258061 33.4215 0.156704C33.2454 0.0553471 33.0451 0.00130211 32.841 2.32362e-05C32.6368 -0.00125564 32.4359 0.0502763 32.2585 0.14942C32.0812 0.248563 31.9337 0.391811 31.8308 0.564709L25.6086 11.134C25.4048 11.48 25.2975 11.8724 25.2975 12.2719C25.2975 12.6714 25.4048 13.0639 25.6086 13.4099L39.156 36.4208C39.3599 36.7671 39.6534 37.0546 40.0068 37.2544C40.3602 37.4542 40.761 37.5591 41.1689 37.5587H53.6135C53.8172 37.5581 54.0172 37.5051 54.1935 37.405C54.3698 37.3049 54.5162 37.1612 54.618 36.9883C54.7199 36.8154 54.7737 36.6192 54.774 36.4195C54.7744 36.2198 54.7212 36.0235 54.6199 35.8503Z" fill="white"/>
                      <path d="M0.160205 54.2852L20.9363 19.0123C21.0383 18.8395 21.1848 18.696 21.3612 18.5963C21.5376 18.4965 21.7376 18.444 21.9412 18.444C22.1448 18.444 22.3449 18.4965 22.5213 18.5963C22.6977 18.696 22.8442 18.8395 22.9461 19.0123L29.1716 29.5721C29.3753 29.9186 29.4825 30.3116 29.4825 30.7116C29.4825 31.1116 29.3753 31.5046 29.1716 31.8511L15.6241 54.862C15.4209 55.2083 15.1281 55.4959 14.7752 55.6957C14.4223 55.8955 14.0219 56.0005 13.6144 56H1.1667C0.961642 56.001 0.759984 55.9488 0.582217 55.8486C0.404449 55.7484 0.256935 55.6038 0.154671 55.4296C0.0524063 55.2553 -0.000962742 55.0577 1.31472e-05 54.8567C0.000989036 54.6556 0.056254 54.4585 0.160205 54.2852Z" fill="white"/>
                      <path d="M22.9431 55.9924H64.4954C64.6992 55.9923 64.8995 55.9395 65.0759 55.8394C65.2523 55.7393 65.3987 55.5954 65.5004 55.4222C65.6021 55.249 65.6555 55.0527 65.6552 54.8529C65.6549 54.6531 65.6009 54.4568 65.4987 54.284L59.2829 43.7178C59.0789 43.3715 58.7855 43.084 58.4321 42.8842C58.0787 42.6845 57.6778 42.5795 57.2699 42.5799H30.1751C29.7671 42.5795 29.3663 42.6845 29.0129 42.8842C28.6595 43.084 28.3661 43.3715 28.1621 43.7178L21.9399 54.284C21.8377 54.4568 21.7837 54.6531 21.7834 54.8529C21.7831 55.0527 21.8365 55.249 21.9382 55.4222C22.0399 55.5954 22.1863 55.7393 22.3627 55.8394C22.5391 55.9395 22.7393 55.9923 22.9431 55.9924Z" fill="white"/>
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <a 
            href={`https://sepolia.basescan.org/address/${address}#nfttransfers`}
            target="_blank"
            rel="noopener noreferrer" 
            className="inline-flex items-center text-sm font-medium text-[#363FF9] hover:text-[#2C35DF]"
          >
            View receipt
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      
        <div className="mt-8 flex justify-center space-x-4">
          <div className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 w-32">
            <p className="text-xs text-gray-500 mb-1">STATUS</p>
            <p className="font-medium text-sm text-green-600">Active</p>
          </div>
          <div className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 w-32">
            <p className="text-xs text-gray-500 mb-1">VERIFIED</p>
            <p className="font-medium text-sm text-blue-600">✓ Authentic</p>
          </div>
        </div>
      </div>
    </>
  );
}; 