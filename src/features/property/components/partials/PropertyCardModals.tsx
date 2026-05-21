import React from "react";
import { Modal } from "../../../../components/common";

interface PropertyCardModalsProps {
  isUnlistModalOpen: boolean;
  setIsUnlistModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleUnlist: () => void;
  isRelistModalOpen: boolean;
  setIsRelistModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleRelist: () => void;
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleDelete: () => void;
  isWishlistConfirmModalOpen: boolean;
  setIsWishlistConfirmModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleWishlistConfirm: () => void;
}

export const PropertyCardModals: React.FC<PropertyCardModalsProps> = ({
  isUnlistModalOpen,
  setIsUnlistModalOpen,
  handleUnlist,
  isRelistModalOpen,
  setIsRelistModalOpen,
  handleRelist,
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  handleDelete,
  isWishlistConfirmModalOpen,
  setIsWishlistConfirmModalOpen,
  handleWishlistConfirm,
}) => {
  return (
    <>
      <Modal
        isOpen={isUnlistModalOpen}
        onClose={() => setIsUnlistModalOpen(false)}
        onConfirm={handleUnlist}
        title="Unlist Property"
        description="Are you sure you want to unlist this property? It will no longer be visible to potential tenants."
        confirmText="Unlist"
        isDestructive={false}
      />

      <Modal
        isOpen={isRelistModalOpen}
        onClose={() => setIsRelistModalOpen(false)}
        onConfirm={handleRelist}
        title="Relist Property"
        description="Are you sure you want to list this property again? It will become visible to all potential tenants."
        confirmText="List Property"
        isDestructive={false}
      />

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Permanently"
        description="Are you sure you want to PERMANENTLY delete this property? This action cannot be undone."
        confirmText="Delete"
        isDestructive={true}
      />

      <Modal
        isOpen={isWishlistConfirmModalOpen}
        onClose={() => setIsWishlistConfirmModalOpen(false)}
        onConfirm={handleWishlistConfirm}
        title="Remove from Wishlist"
        description="Are you sure you want to remove this property from your saved list?"
        confirmText="Remove"
        isDestructive={true}
      />
    </>
  );
};
