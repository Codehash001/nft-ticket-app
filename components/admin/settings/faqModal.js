// components/Modal.js

export default function Modal({ children, onClose }) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm text-primary">
        <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 transform transition-all duration-300">
          <button 
            className="absolute top-4 right-4 text-gray-700 hover:text-gray-900"
            onClick={onClose}
          >
            Close
          </button>
          {children}
        </div>
      </div>
    );
  }
  