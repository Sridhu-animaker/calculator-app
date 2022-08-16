import React, { useState } from "react";
import Wrapper from "./components/Wrapper";
import ButtonBox from "./components/ButtonBox";
import Button from "./components/Button";
import Screen from "./components/Screen";
const { ipcRenderer } = window.require("electron");

function App() {
  const [calc, setcalc] = useState({ sign: "", num: 0, result: 0 });
  const btnValues = [
    ["+-", "%", "AC"],
    [7, 8, 9, "/"],
    [4, 5, 6, "x"],
    [1, 2, 3, "-"],
    [0, ".", "+", "="],
  ];

  const numClickHandler = (e) => {
    e.preventDefault();
    const value = e.target.innerHTML;
    ipcRenderer.send("click:num", { value, calc });
    ipcRenderer.on("num:clicked", (event, obj) => {
      setcalc({ ...obj.calc });
    });
  };

  const decimalClickHandler = (e) => {
    e.preventDefault();
    const value = e.target.innerHTML;
    ipcRenderer.send("click:decimal", { value, calc });
    ipcRenderer.on("decimal:clicked", (event, obj) => {
      setcalc({ ...obj.calc });
    });
  };

  const operatorClickHandler = (e) => {
    e.preventDefault();
    const value = e.target.innerHTML;
    ipcRenderer.send("click:operator", { value, calc });
    ipcRenderer.on("operator:clicked", (event, obj) => {
      setcalc({ ...obj.calc });
    });
  };

  const equalsClickHandler = () => {
    if (calc.num && calc.sign) {
      ipcRenderer.send("click:equals", calc);
      ipcRenderer.on("equals:clicked", (event, calcObj) => {
        setcalc({ ...calcObj });
      });
    }
  };

  const percentClickHandler = () => {
    ipcRenderer.send("click:percent", calc);
    ipcRenderer.on("percent:clicked", (event, calcObj) => {
      setcalc({ ...calcObj });
    });
  };

  const invertClickHandler = () => {
    ipcRenderer.send("click:invert", calc);
    ipcRenderer.on("invert:clicked", (event, calcObj) => {
      setcalc({ ...calcObj });
    });
  };

  const resultClickHandler = () => {
    ipcRenderer.send("click:reset", calc);
    ipcRenderer.on("reset:clicked", (event, calcObj) => {
      setcalc({ ...calcObj });
    });
  };

  return (
    <Wrapper>
      <Screen value={calc.num ? calc.num : calc.result} />
      <ButtonBox>
        {btnValues.flat().map((btn, i) => {
          return (
            <Button
              key={i}
              className={btn === "=" ? "equals" : btn === "AC" ? "delete" : ""}
              value={btn}
              onClick={
                btn === "AC"
                  ? resultClickHandler
                  : btn === "+-"
                  ? invertClickHandler
                  : btn === "%"
                  ? percentClickHandler
                  : btn === "="
                  ? equalsClickHandler
                  : btn === "/" || btn === "x" || btn === "-" || btn === "+"
                  ? operatorClickHandler
                  : btn === "."
                  ? decimalClickHandler
                  : numClickHandler
              }
            />
          );
        })}
      </ButtonBox>
    </Wrapper>
  );
}

export default App;
