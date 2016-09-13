var powerBtnOff = false;
var newNumber = true;
var stmtArray = [];
var numOfMultiplyAndDivide = 0;
var newFormula = true;
var displayLimit = 13;

$(document).ready(function() {
  powerCalculator();
  $(".btn").click(function(){
    var value = $(this).attr("value");
    processCalculatorButton(value);
  });   
});

function clearStmtArray() {
    stmtArray = [];
    numOfMultiplyAndDivide = 0;  
    newFormula = true;
}

function getFormulaText() {
  var result = "";
  stmtArray.forEach(function (val) {
    result += val;
  });
  
  return result;
}

function powerCalculator() {
  if (powerBtnOff) {
    setResultText("0");
    powerBtnOff = false;
    newNumber = true;
    clearStmtArray();
  } else {
    $("#result").html("");
    powerBtnOff = true;    
  }
  
  $("#formula").html("");
}

function appendDigit(value) {
  if (powerBtnOff)
    return;
  
  var current = $("#result").html();
  if (current === "0" && value != ".")
    current = "";
  
  if (newNumber || newFormula) {
    setResultText(value);
    if (newNumber)
      newNumber = false;
    if (newFormula) {
      newFormula = false;
      $("#formula").html(getFormulaText());
    }
  } else {
    setResultText(current + value);
  }
}

function clearEntry() {
  if (powerBtnOff)
    return;

  if (newFormula)
    resetDisplay();
  else
    setResultText("0");
}

function resetDisplay() {
  if (powerBtnOff)
    return;
  
  setResultText("0");
  $("#formula").html("");
  newNumber = true;
  clearStmtArray();
}

function hasError(number) {
  if (number == 0 && stmtArray[stmtArray.length-1] === "/") {
    $("#result").addClass("error");
    $("#result").html("Cannot divide by zero");

    return true;
  }
  
  return false;
}

function setResultText(val) {
  var overLimit = false;
  var strVal = val.toString();
  var strArr = strVal.split(".");
  if (strArr[0].length > displayLimit)
    overLimit = true;
  else if (strVal.length > displayLimit) {
    strVal = strVal.substr(0, displayLimit);
    if (strVal.indexOf(".") == (displayLimit - 1))
      strVal = strVal.substr(0, displayLimit-1);
  }
    
  if (overLimit) {
    $("#result").addClass("error");
    $("#result").html("Over display limit");
    $("#formula").html("");
    newNumber = true;
    clearStmtArray();
  } else {
    $("#result").removeClass("error");
    $("#result").html(strVal);  
  }
}

function addToStmtArray(operator) {
  if (powerBtnOff)
    return;
  
  if (!newNumber) {
    newNumber = true;
    var number = Number($("#result").html());
    if (hasError(number)) 
      return;
    
    stmtArray.push(number);
    stmtArray.push(operator);
    $("#formula").html(getFormulaText());
  } else {
    stmtArray.pop();
    stmtArray.push(operator);
    $("#formula").html(getFormulaText());
  }
  
  if (operator === "*" || operator === "/")
    numOfMultiplyAndDivide++;
}

function evaluateMultiplyAndDivide() {
  for (var i = 0; i < numOfMultiplyAndDivide; i++) {
    for (var j = 1; j < stmtArray.length - 1; j+=2) {
      var num1 = stmtArray[j-1];
      var num2 = stmtArray[j+1];
      var newNum;
      if (stmtArray[j] === "*") {
        newNum = num1 * num2;
        stmtArray.splice(j-1, 3, newNum);
        break;
      } else if (stmtArray[j] === "/") {
        newNum = num1 / num2;
        stmtArray.splice(j-1, 3, newNum);
        break;
      }
    }
  }
}

function evaluateAddAndSubtract() {
  while (stmtArray.length > 1) {
      var num1 = stmtArray[0];
      var num2 = stmtArray[2];
      var newNum;
      if (stmtArray[1] === "+") {
        newNum = num1 + num2;
      } else if (stmtArray[1] === "-") {
        newNum = num1 - num2;
      }
      stmtArray.splice(0, 3, newNum);    
  } 
}

function calculateResult() {
  if (powerBtnOff || stmtArray.length == 0)
    return;
  
  if (newNumber) {
    stmtArray.pop();
  } else {
    var number = Number($("#result").html());
    if (hasError(number)) {
      newFormula = true;
      return;      
    } else
      stmtArray.push(number);
  }
  var formula = getFormulaText();
  
  evaluateMultiplyAndDivide();
  evaluateAddAndSubtract();
  
  setResultText(stmtArray[0]);
  
  if (stmtArray.length > 0)
    $("#formula").html(formula + "=" + stmtArray[0]);
  clearStmtArray();
}

function processCalculatorButton(btnValue) {
  switch (btnValue) {
    case "off":
      powerCalculator();
      break;
    case "ce":
      clearEntry();
      break;
    case "c":
      resetDisplay();
      break;
    case "0":
    case "1":
    case "2": 
    case "3": 
    case "4": 
    case "5": 
    case "6": 
    case "7": 
    case "8": 
    case "9": 
    case ".": 
      appendDigit(btnValue);
      break;
    case "/":    
    case "*":
    case "-":
    case "+":
      addToStmtArray(btnValue);
      break;
    case "=":
      calculateResult();
      break;      
    default:
      break;
  }
}