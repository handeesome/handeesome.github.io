import styles from "./Square.module.css";

const Square = ({ value, row, col, editable, onChange }) => (
  <div className={styles.cell}>
    {editable ? (
      <input
        className={styles.input}
        type="text"
        maxLength={1}
        value={value ?? ""}
        onChange={(e) => {
          const val = e.target.value;
          if (val === "" || (val >= "1" && val <= "9")) {
            onChange(val);
          }
        }}
        onKeyDown={(e) => {
          if (value && e.key >= "1" && e.key <= "9") {
            onChange(e.key);
            e.preventDefault();
          }
        }}
      />
    ) : (
      value
    )}
  </div>
);

export default Square;
