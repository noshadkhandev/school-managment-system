import { X } from "lucide-react";
const Modal = ({
  isOpen,
  onClose,
  title = "Modal",
  children,
  footer,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="custom-modal-overlay"
      onClick={onClose}
    >
      <div
        className="custom-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="custom-modal-header">
          <h2>{title}</h2>

          <button
            className="custom-modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="custom-modal-body">
          {children}
        </div>

        {footer && (
          <div className="custom-modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;