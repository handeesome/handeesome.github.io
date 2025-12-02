import styles from "./Square.module.css";

const Square = ({
  value,
  row,
  col,
  selected,
  onSelect,
  editable,
  onChange,
}) => (
  <div
    className={`${styles.cell} ${
      row % 3 === 0 ? `${styles["top-bold"]}` : ""
    } ${col % 3 === 0 ? `${styles["left-bold"]}` : ""} ${
      row === 8 ? `${styles["bottom-bold"]}` : ""
    } ${col === 8 ? `${styles["right-bold"]}` : ""} 
    `}>
    {editable ? (
      <input
        className={`${styles.input} ${
          selected ? `${styles.selected}` : "bg-transparent"
        }`}
        type="text"
        maxLength={1}
        value={value ?? ""}
        onClick={onSelect}
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
