import { useEffect } from 'react';
import useAppStore from '../../stores/appStore';

export default function Modal() {
  const { modal, setModal } = useAppStore();
  const closeModal = () => {
    setModal({ show: false });
  };

  const handleOkClick = () => {
    if (modal.onClick) {
      modal.onClick();
      closeModal(); // Close the modal after executing modal.onClick
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && modal && typeof modal.onClick === 'function') {
      handleOkClick();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [modal]);

  if (!modal) {
    return null;
  }

  return (
    <div className={`fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity ${modal.show ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className={`px-6 py-4 bg-white text-gray-800 rounded-lg shadow`}>
          <h2 className="text-2xl font-semibold mb-4" id="modal-headline">
            {modal.title}
          </h2>
          <div className="mb-4">
            {modal.children}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className={`py-2 px-4 rounded mr-2 bg-gray-500 text-white hover:bg-gray-700`}
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleOkClick}
              className={`py-2 px-4 rounded font-medium bg-blue-500 text-white hover:bg-blue-700`}
            >
              Ok
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}