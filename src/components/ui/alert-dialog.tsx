export const Alert = ({
  isOpen,
  onClose,
  title,
  message,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        isOpen ? "visible" : "invisible"
      }`}
    >
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative p-6 bg-white rounded-lg shadow-lg">
        <div className="mb-4">
          <h3 className="text-lg font-bold">{title}</h3>
          <p className="text-gray-600">{message}</p>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600"
            onClick={onClose}
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  );
};
