// components/ui/Modal.jsx
import React, { useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md", // sm, md, lg, xl
  showCloseButton = true,
  footer = null,
  className = "",
  bodyClassName = "",
  maxHeight = null,
  preventBackdropClose = false,
}) => {
  const { theme } = useTheme();

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !preventBackdropClose) {
      onClose();
    }
  };

  const getSizeClass = () => {
    const sizeMap = {
      sm: "modal-sm",
      md: "",
      lg: "modal-lg",
      xl: "modal-xl",
    };
    return sizeMap[size] || "";
  };

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const bgDark = theme === "dark" ? "bg-dark text-light" : "";
  const closeButtonClass = theme === "dark" ? "btn-close-white" : "";

  return (
    <div
      className="modal d-block"
      style={{
        backgroundColor: "rgba(0,0,0,0.5)",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 1050,
      }}
      onClick={handleBackdropClick}>
      <div className={`modal-dialog modal-dialog-centered ${getSizeClass()}`}>
        <div className={`modal-content ${bgDark} ${className}`}>
          {(title || showCloseButton) && (
            <div className="modal-header">
              {title && <h5 className="modal-title">{title}</h5>}
              {showCloseButton && (
                <button
                  type="button"
                  className={`btn-close ${closeButtonClass}`}
                  onClick={onClose}
                  aria-label="Close"
                />
              )}
            </div>
          )}

          <div
            className={`modal-body ${bodyClassName}`}
            style={maxHeight ? { maxHeight, overflowY: "auto" } : {}}>
            {children}
          </div>

          {footer && <div className="modal-footer">{footer}</div>}
        </div>
      </div>
    </div>
  );
};

export default Modal;
