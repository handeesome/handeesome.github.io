import { AlertTriangle, LoaderCircle } from "lucide-react";
import { FIRESTORE_FIELD_VALUE_LIMIT_BYTES } from "../utils/imageStorage";

export const getModalSubmitErrorMessage = (error, itemLabel = "item") => {
  const message = error?.message || "";
  const text = `${error?.code || ""} ${message}`.toLowerCase();

  if (
    text.includes("coverbase64") &&
    (text.includes(`${FIRESTORE_FIELD_VALUE_LIMIT_BYTES}`) ||
      text.includes("longer than"))
  ) {
    return `This cover image is too large to save here. Please use a smaller image under 1 MB and try again.`;
  }

  if (text.includes("permission")) {
    return `You do not have permission to save this ${itemLabel}. Please sign in again or check that you are editing the right library.`;
  }

  if (text.includes("network") || text.includes("offline")) {
    return `Could not save this ${itemLabel} because the network looks unavailable. Please reconnect and try again.`;
  }

  return `Could not save this ${itemLabel}. Please try again.`;
};

export const ModalTitle = ({ icon: Icon, children }) => (
  <span className="book-form-title">
    {Icon && <Icon size={20} />}
    {children}
  </span>
);

export const FormSection = ({ icon: Icon, title, count, className = "", children }) => (
  <section className={`book-form-section ${className}`.trim()}>
    <div className="book-form-section-header">
      {Icon && <Icon size={18} />}
      <span>{title}</span>
      {count !== undefined && count !== null && (
        <span className="book-form-section-count">{count}</span>
      )}
    </div>
    {children}
  </section>
);

export const ModalSubmitErrorAlert = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <div className="book-form-submit-error" role="alert">
      <AlertTriangle size={20} />
      <div className="book-form-submit-error-copy">
        <strong>Save failed</strong>
        <span>{message}</span>
      </div>
      <button
        type="button"
        className="btn-close book-form-submit-error-close"
        onClick={onDismiss}
        aria-label="Dismiss error"
      />
    </div>
  );
};

export const ModalFooterActions = ({
  cancelLabel = "Cancel",
  submitLabel,
  loadingLabel = "Saving...",
  submitIcon: SubmitIcon,
  isLoading = false,
  onCancel,
  formId,
}) => (
  <div className="book-form-footer">
    <button
      type="button"
      className="btn btn-outline-secondary"
      onClick={onCancel}
      disabled={isLoading}>
      {cancelLabel}
    </button>
    <button
      type="submit"
      form={formId}
      className="btn btn-primary d-inline-flex align-items-center gap-2"
      disabled={isLoading}>
      {isLoading ? (
        <>
          <LoaderCircle size={16} className="book-form-spin" />
          {loadingLabel}
        </>
      ) : (
        <>
          {SubmitIcon && <SubmitIcon size={16} />}
          {submitLabel}
        </>
      )}
    </button>
  </div>
);

export const ModalSubmittingOverlay = ({ label = "Saving..." }) => (
  <div className="book-form-submitting-overlay">
    <div className="text-center">
      <LoaderCircle size={28} className="book-form-spin mb-3" />
      <div>{label}</div>
    </div>
  </div>
);
