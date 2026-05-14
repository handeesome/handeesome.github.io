import { LoaderCircle } from "lucide-react";

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
