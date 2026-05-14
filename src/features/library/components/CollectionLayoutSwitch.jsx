const layoutOptions = [
  { value: "grid", label: "🏁 Grid View" },
  { value: "detailed", label: "📖 Detailed View" },
  { value: "table", label: "📋 Table View" },
];

const CollectionLayoutSwitch = ({ layout, onChange }) => (
  <div className="row mb-3">
    <div className="col-12">
      <div className="d-flex justify-content-center">
        <div className="btn-group" role="group" aria-label="Layout options">
          {layoutOptions.map((option) => (
            <button
              key={option.value}
              className={`btn ${
                layout === option.value ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => onChange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default CollectionLayoutSwitch;
