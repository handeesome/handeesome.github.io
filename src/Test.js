import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";

const ParentComponent = () => {
  return (
    <div>
      <h1>Parent Component</h1>
      <Outlet /> {/* This is where child routes will be rendered */}
    </div>
  );
};

const ChildComponent1 = () => {
  return <h2>Child Component 1</h2>;
};

const ChildComponent2 = () => {
  return <h2>Child Component 2</h2>;
};

const Test = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ParentComponent />}>
          <Route path="child1" element={<ChildComponent1 />} />
          <Route path="child2" element={<ChildComponent2 />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default Test;
