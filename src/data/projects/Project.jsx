import HelloWorld from "./HelloWorld";
import PageHeader from "../../components/header/PageHeader";
import Board from "../../components/Board";
const Project = () => {
  return (
    <div>
      <PageHeader />
      <Board>
        <HelloWorld />
      </Board>
    </div>
  );
};

export default Project;
