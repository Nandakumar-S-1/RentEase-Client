import { Edit, Eye, EyeOff, Trash2 } from "lucide-react";

interface PropertyCardActionsProps {
  status: string;
  handleEdit: (e: React.MouseEvent) => void;
  setIsRelistModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsUnlistModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PropertyCardActions: React.FC<PropertyCardActionsProps> = ({
  status,
  handleEdit,
  setIsRelistModalOpen,
  setIsUnlistModalOpen,
  setIsDeleteModalOpen,
}) => {
  return (
    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-50">
      <button
        onClick={handleEdit}
        className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
        title="Edit Property"
      >
        <Edit size={18} />
      </button>
      {status === "UNLISTED" ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsRelistModalOpen(true);
          }}
          className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-xl transition-all"
          title="List Property"
        >
          <Eye size={18} />
        </button>
      ) : (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsUnlistModalOpen(true);
          }}
          className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all"
          title="Unlist Property"
        >
          <EyeOff size={18} />
        </button>
      )}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsDeleteModalOpen(true);
        }}
        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
        title="Delete Property"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};
