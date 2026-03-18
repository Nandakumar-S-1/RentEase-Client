type EmptyStateProps = {
  message: string;
};

export const EmptyState = ({ message }: EmptyStateProps) => {
  return (
    <div className="p-4 text-center text-gray-400">
      <p>{message}</p>
    </div>
  );
};