"use client";
// @refresh reset
import { AddressInfoDropdown } from "./AddressInfoDropdown";
import { AddressQRCodeModal } from "./AddressQRCodeModal";
import { useAuthModal, useUser } from "@account-kit/react";
import { Address } from "viem";
import { useClient } from "~~/hooks/scaffold-alchemy/useClient";
import scaffoldConfig from "~~/scaffold.config";
import { getBlockExplorerAddressLink } from "~~/utils/scaffold-alchemy";
export const ConnectButton = () => {
  const { openAuthModal } = useAuthModal();
  const { address } = useClient();
  const user = useUser();
  const connected = !!address;
  if (!connected) {
    return (
      <button 
        className="px-6 py-2 bg-gradient-to-r from-[#363FF9] to-[#5498FF] text-white font-medium rounded-full hover:shadow-lg hover:from-[#2C35DF] hover:to-[#4287FF] transition-all duration-300 transform hover:-translate-y-0.5" 
        onClick={openAuthModal} 
        type="button"
      >
        Login
      </button>
    );
  }
  if (!address) {
    return <></>;
  }
  const blockExplorerAddressLink = getBlockExplorerAddressLink(scaffoldConfig.targetNetworks[0], address);
  const displayName = user?.email || "";
  return (
    <>
      <AddressInfoDropdown
        address={address as Address}
        displayName={displayName}
        blockExplorerAddressLink={blockExplorerAddressLink}
      />
      <AddressQRCodeModal address={address as Address} modalId="qrcode-modal" />
    </>
  );
};


