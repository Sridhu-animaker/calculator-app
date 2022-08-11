import React, { useState } from "react";
import Wrapper from "./components/Wrapper";
import ButtonBox from "./components/ButtonBox";
import Button from "./components/Button";
import Screen from "./components/Screen";

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
    setcalc({
      ...calc,
      num:
        calc.num === 0 && value === "0"
          ? "0"
          : calc.num % 1 === 0
          ? Number(calc.num + value)
          : calc.num + value,
      result: !calc.sign ? 0 : calc.result,
    });
  };

  const decimalClickHandler = (e) => {
    e.preventDefault();
    const value = e.target.innerHTML;
    setcalc({
      ...calc,
      num: !calc.num.toString().includes(".") ? calc.num + value : calc.num, //to avoid multiple decimal point
    });
  };

  const operatorClickHandler = (e) => {
    e.preventDefault();
    const value = e.target.innerHTML;
    setcalc({
      ...calc,
      result: !calc.result && calc.num ? calc.num : calc.result,
      sign: value,
      num: 0, //to result number while calculating
    });
  };

  const equalsClickHandler = () => {
    if (calc.num && calc.sign) {
      // Function to perform calculation
      const calculateFunction = (a, b, operator) => {
        return operator === "+"
          ? a + b
          : operator === "-"
          ? a - b
          : operator === "/"
          ? a / b
          : a * b;
      };

      setcalc({
        ...calc,
        result:
          calc.num === "0" && calc.sign === "/"
            ? "can't divide with 0"
            : calculateFunction(
                Number(calc.result),
                Number(calc.num),
                calc.sign
              ),
        num: 0,
        sign: "",
      });
    }
  };

  const percentClickHandler = () => {
    let num = calc.num ? parseFloat(calc.num) : 0;
    let result = calc.result ? parseFloat(calc.result) : 0;
    setcalc({
      ...calc,
      num: (num /= Math.pow(100, 1)),
      result: (result /= Math.pow(100, 1)),
    });
  };

  const invertClickHandler = () => {
    setcalc({
      ...calc,
      num: calc.num ? calc.num * -1 : 0,
      result: calc.result ? calc.result * -1 : 0,
      sign: "",
    });
  };

  const resultClickHandler = () => {
    setcalc({
      ...calc,
      num: 0,
      sign: "",
      result: 0,
    });
  };

  return (
    <Wrapper>
      <Screen value={calc.num ? calc.num : calc.result} />
      <ButtonBox>
        {btnValues.flat().map((btn, i) => {
          return (
            <Button
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
