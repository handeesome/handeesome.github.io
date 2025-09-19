import { useNavigate } from "react-router-dom";

const GoBackBtn = ({ defaultDest, text }) => {
  const navigate = useNavigate();

  return (
    <button
      className="btn btn-outline-info"
      onClick={() => {
        if (window.history.length > 1) {
          navigate(-1);
        } else {
          navigate(defaultDest);
        }
      }}>
      ← {text}
    </button>
  );
};

export default GoBackBtn;
