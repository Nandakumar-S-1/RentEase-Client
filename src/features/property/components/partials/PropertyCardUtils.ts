import { PropertyStatus } from "../../../../types/constants/property.constant";

export const getStatusColor = (status: string) => {
  switch (status.toUpperCase()) {
    case PropertyStatus.ACTIVE:
    case "APPROVED":
    case "AVAILABLE":
      return "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400";
    case "RENTED":
      return "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400";
    case PropertyStatus.UNLISTED:
      return "bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400";
    case PropertyStatus.PENDING_APPROVAL:
    case PropertyStatus.PENDING:
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400";
    case PropertyStatus.REJECTED:
      return "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400";
    default:
      return "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400";
  }
};

export const getStatusLabel = (status: string) => {
  if (status === PropertyStatus.ACTIVE || status === "APPROVED")
    return "Listed";
  if (status === PropertyStatus.PENDING_APPROVAL) return "Verification Pending";
  return status.charAt(0) + status.slice(1).toLowerCase();
};
