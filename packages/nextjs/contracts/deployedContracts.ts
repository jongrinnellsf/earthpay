/**
 * This file is autogenerated by Scaffold-Alchemy.
 * You should not edit it manually or your changes might be overwritten.
 */
import { GenericContractsDeclaration } from "~~/utils/scaffold-alchemy/contract";

const deployedContracts = {
  84532: {
    Counter: {
      address: "0x54d29797cea11122adef89e233629039fdfbf0b8",
      abi: [
        {
          type: "constructor",
          stateMutability: "nonpayable",
          inputs: [
            {
              name: "_x",
              type: "uint256",
              baseType: "uint256",
              components: null,
              arrayLength: null,
              arrayChildren: null,
            },
          ],
        },
        {
          type: "function",
          name: "decrement",
          stateMutability: "nonpayable",
          inputs: [],
          outputs: [],
        },
        {
          type: "function",
          name: "increment",
          stateMutability: "nonpayable",
          inputs: [],
          outputs: [],
        },
        {
          type: "function",
          name: "x",
          stateMutability: "view",
          inputs: [],
          outputs: [
            {
              name: "",
              type: "uint256",
              baseType: "uint256",
              components: null,
              arrayLength: null,
              arrayChildren: null,
            },
          ],
        },
      ],
      inheritedFunctions: {},
    }
  },
} as const;

export default deployedContracts satisfies GenericContractsDeclaration;
