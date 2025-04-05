# 🌎 EarthPay

EarthPay is a simple, secure payment application that allows verified users with EarthPass NFTs to send money anywhere in the world for free. It's a DEMO app, defaulting to use Base L2, but can use any chain supported by ScaffoldAlchemy, which this project is entirely built off of!

## Features

- **Secure Payments**: Only verified EarthPass NFT holders can send and receive payments
- **Zero Fees**: Send money globally without transaction fees
- **Modern UI**: Clean, intuitive interface with visual representations of transactions
- **Transaction History**: View your recent payment activity
- **Simple Verification**: Get verified easily with an EarthPass NFT
- **Custom Token Creation**: Each user deploys their own ERC-20 token with personalized name and symbol

## Technology Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Blockchain**: Solidity smart contracts (ERC-20 token & ERC-721 NFT)
- **Authentication**: Account Kit by Alchemy
- **Network**: Deployed on Base Sepolia testnet

## Getting Started

### Prerequisites

Before you begin, you need to install:

- [Node.js (v22.0+)](https://nodejs.org/en/download/)
- [Yarn](https://classic.yarnpkg.com/en/docs/install/)
- [Git](https://git-scm.com/downloads)

### Installation

1. Clone the repository

```bash
git clone https://github.com/jongrinnellsf/earthpay.git
cd earthpay
```

2. Install dependencies

```bash
yarn install
```

3. Deploy your custom ERC-20 token contract to Base Sepolia testnet

```bash
yarn deploy
```

You'll be prompted to enter a name and symbol for your token. This creates your personalized token that you can mint and send to other users.

4. Start the application

```bash
yarn start
```

5. Open your browser and visit: `http://localhost:56900`

## How to Use

1. **Connect Wallet**: Use the Connect button in the upper right corner
2. **Get Verified**: Mint an EarthPass NFT to access payment features
3. **Deploy Your Token**: Run `yarn deploy` and create your custom token with name and symbol
4. **Deposit Funds**: Add tokens to your account
5. **Send Money**: Select a recipient (another EarthPass holder) and amount to send

## Smart Contracts

- **EarthToken**: A customizable ERC-20 token deployed by each user with their chosen name and symbol
- **EarthPass NFT**: An ERC-721 NFT that serves as verification for users

## For Developers

### Important Note on Deployment

When pushing to GitHub or sharing this code, make sure to keep the `deployedContracts.ts` file empty:

```typescript
const deployedContracts = {} as const;

export default deployedContracts satisfies GenericContractsDeclaration;
```

This ensures that each user who clones the repository will be prompted to deploy their own token contract rather than using someone else's existing deployment.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Unafiliated, personal side project

This project is a personal side project, unaffiliated with any specific company, domain, or licenses. It is open, and freely available. 

## Acknowledgments

- Built with 🌎 Scaffold-Alchemy
- Created by jkg.eth
