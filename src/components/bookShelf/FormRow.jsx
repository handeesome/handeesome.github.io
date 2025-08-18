import { useTheme } from "../../ThemeContext";

const FormRow = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  options,
  customComponent,
  hideInput = false,
  ...rest
}) => {
  const { theme } = useTheme();
  const darkBg = theme === "dark" ? "bg-dark text-light" : "";

  return (
    <div className="row g-3 align-items-center mb-2">
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
                className={`form-select ${darkBg}`}
                value={value}
                onChange={onChange}
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
                className={`form-control ${darkBg}`}
                placeholder={placeholder || label}
                value={value}
                onChange={onChange}
                {...rest}
              />
            )}
          </>
        )}
        {customComponent && customComponent}
      </div>
    </div>
  );
};

export default FormRow;
