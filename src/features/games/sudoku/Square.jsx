import styles from "./Square.module.css";

const Square = ({
  value,
  row,
  col,
  answer,
  selected,
  highlightBlock,
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
    ${highlightBlock ? styles["block-highlight"] : ""}
    ${selected ? styles.selected : ""}
    ${editable ? styles.editable : ""}
    `}>
    {editable ? (
      <div
        tabIndex={0}
        className={`${styles.input} ${
          selected ? `${styles.selected}` : "bg-transparent"
        } ${
          value ? (answer === value ? styles.correct : styles.incorrect) : ""
        }`}
        onClick={(e) => {
          onSelect();
          e.currentTarget.focus();
        }}
        onKeyDown={(e) => {
          if (e.key >= "1" && e.key <= "9") {
            onChange(Number(e.key));
            e.preventDefault();
          }
          if (e.key === "Backspace" || e.key === "Delete") {
            onChange("");
            e.preventDefault();
          }
        }}>
        {value ?? ""}
      </div>
    ) : (
      value
    )}
  </div>
);

export default Square;
