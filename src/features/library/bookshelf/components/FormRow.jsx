import { useTheme } from "../../../../contexts/ThemeContext";

const FormRow = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  options,
  customComponent,
  hideInput = false,
  invalid = false,
  validationMessage = "",
  inputClassName = "",
  containerClassName = "",
  ...rest
}) => {
  const { theme } = useTheme();
  const darkBg = theme === "dark" ? "bg-dark text-light" : "";
  const fieldClassName = `${type === "select" ? "form-select" : "form-control"} ${darkBg} ${
    invalid ? "is-invalid" : ""
  } ${inputClassName}`.trim();

  return (
    <div className={`row g-3 align-items-center mb-2 ${containerClassName}`}>
      {label && (
        <div className="col-md-auto">
          <label className="form-label mb-0">{label}</label>
        </div>
      )}
      <div className="col-auto d-flex gap-2">
        {!hideInput && (
          <>
            {type === "select" ? (
              <select
                className={fieldClassName}
                value={value}
                onChange={onChange}
                aria-invalid={invalid}
                {...rest}>
                {options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={type}
                className={fieldClassName}
                placeholder={placeholder || label}
                value={value}
                onChange={onChange}
                aria-invalid={invalid}
                {...rest}
              />
            )}
            {validationMessage && (
              <div className="invalid-feedback d-block">
                {validationMessage}
              </div>
            )}
          </>
        )}
        {customComponent && customComponent}
      </div>
    </div>
  );
};

export default FormRow;
