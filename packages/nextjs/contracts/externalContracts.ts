import { GenericContractsDeclaration } from "~~/utils/scaffold-alchemy/contract";

/**
 * @example
 * const externalContracts = {
 *   1: {
 *     DAI: {
 *       address: "0x...",
 *       abi: [...],
 *     },
 *   },
 * } as const;
 */
const externalContracts = {
  84532: {
    ExternalEarthPassNFT: {
      address: "0x94ff63e2967e23ca39af55d57bf2d6654f71ed86",
      abi: [
        {
          type: "function",
          name: "mintEarthPass",
          stateMutability: "nonpayable",
          inputs: [],
          outputs: [],
        },
        {
          type: "function",
          name: "hasEarthPass",
          stateMutability: "view",
          inputs: [
            {
              name: "user",
              type: "address",
              baseType: "address",
              components: null,
              arrayLength: null,
              arrayChildren: null,
            },
          ],
          outputs: [
            {
              name: "",
              type: "bool",
              baseType: "bool",
              components: null,
              arrayLength: null,
              arrayChildren: null,
            },
          ],
        },
        {
          type: "function",
          name: "getAllHolders",
          stateMutability: "view",
          inputs: [],
          outputs: [
            {
              name: "",
              type: "address[]",
              baseType: "address",
              components: null,
              arrayLength: null,
              arrayChildren: null,
            },
          ],
        },
      ],
    },
  },
} as const;

export default externalContracts satisfies GenericContractsDeclaration;