import { ContractName as ScaffoldContractName } from "~~/utils/scaffold-alchemy/contract";

// Declare module for our custom contracts
declare module "~~/utils/scaffold-alchemy/contract" {
  // Augment the ContractName type 
  export type ContractName = ScaffoldContractName | "EarthToken" | "ExternalEarthPassNFT";
  
  // Type for EarthToken functions
  export interface EarthTokenFunctions {
    balanceOf: (account: string) => bigint;
    mint: (amount: bigint) => void;
    transferToEarthPassHolder: (to: string, amount: bigint) => void;
  }
  
  // Type for ExternalEarthPassNFT functions
  export interface ExternalEarthPassNFTFunctions {
    hasEarthPass: (user: string) => boolean;
    getAllHolders: () => string[];
    mintEarthPass: () => void;
  }

  // Add custom contract types
  export interface ContractFunctions {
    "EarthToken": EarthTokenFunctions;
    "ExternalEarthPassNFT": ExternalEarthPassNFTFunctions;
  }
} 