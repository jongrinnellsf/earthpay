# 🌎 EarthPay

EarthPay is a simple, secure payment application that allows verified users with EarthPass NFTs to send money anywhere in the world for free. It's a DEMO app, defaulting to use Base L2, but can use any chain supported by ScaffoldAlchemy, which this project is entirely built off of!

## Features

- **Secure Payments**: Only verified EarthPass NFT holders can send and receive payments
- **Zero Fees**: Send money globally without transaction fees
- **Modern UI**: Clean, intuitive interface with visual representations of transactions
- **Transaction History**: View your recent payment activity
- **Simple Verification**: Get verified easily with an EarthPass NFT

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

3. Deploy the smart contracts to Base Sepolia testnet

```bash
yarn deploy
```

This deploys the EarthToken contract which powers the payment functionality.

4. Start the application

```bash
yarn start
```

5. Open your browser and visit: `http://localhost:56900`

## How to Use

1. **Connect Wallet**: Use the Connect button in the upper right corner
2. **Get Verified**: Mint an EarthPass NFT to access payment features
3. **Deposit Funds**: Add tokens to your account
4. **Send Money**: Select a recipient (another EarthPass holder) and amount to send

## Smart Contracts

- **EarthToken**: An ERC-20 token that can only be transferred between EarthPass holders
- **EarthPass NFT**: An ERC-721 NFT that serves as verification for users

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Unafiliated, personal side project

This project is a personal side project, unaffiliated with any specific company, domain, or licenses. It is open, and freely available. 

## Acknowledgments

- Built with 🌎 Scaffold-Alchemy
- Created by jkg.eth
