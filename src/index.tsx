import * as React from "react";
import { render } from "react-dom";
import Dropdown from "../components/Dropdown";
import "./styles.css";

const data = [
  { value: "One" },
  { value: "Two" },
  { value: "Three" },
  { value: "Four" },
  { value: "Five" }
];

function selectedItem(val) {
  console.log(val);
}
function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <Dropdown onChange={selectedItem} options={data} />
    </div>
  );
}

const rootElement = document.getElementById("root");
render(<App />, rootElement);
