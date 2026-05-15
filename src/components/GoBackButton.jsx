import { useNavigate } from "react-router-dom";

const GoBackBtn = ({ defaultDest, text, preferDefaultDest = false }) => {
  const navigate = useNavigate();

  return (
    <button
      className="btn btn-outline-info"
      onClick={() => {
        if (preferDefaultDest && defaultDest) {
          navigate(defaultDest);
        } else if (window.history.length > 1) {
          navigate(-1);
        } else if (defaultDest) {
          navigate(defaultDest);
        }
      }}>
      ← {text}
    </button>
  );
};

export default GoBackBtn;
