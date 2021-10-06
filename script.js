class DisplayLine {
  constructor($line) {
    this.$line = $line;
    this.isLocked = true;
  }

  write(text) {
    if (this.isLocked === false)
      this.$line.textContent = this.$line.textContent.concat(text);
  }
  delete() {
    if (this.isLocked === false)
      this.$line.textContent = this.$line.textContent.slice(0, -1);
  }
  deleteAll() {
    this.$line.textContent = "";
  }
  lock() {
    this.isLocked = true;
  }
  unlock() {
    this.isLocked = false;
  }
}

class Button {
  constructor($button, value, text) {
    this.$button = $button;
    this.value = value;
    this.text = text;
  }
}

const calculator = {
  onOff: false,
  internOperation: "",
  keypad: {
    bOff: new Button(document.getElementById("off")),
    bAc: new Button(document.getElementById("ac")),
    bDelete: new Button(document.getElementById("delete")),
    bOn: new Button(document.getElementById("on")),
    b7: new Button(document.getElementById("b7"), 7, 7),
    b8: new Button(document.getElementById("b8"), 8, 8),
    b9: new Button(document.getElementById("b9"), 9, 9),
    bDiv: new Button(document.getElementById("div"), "/", "/"),
    b4: new Button(document.getElementById("b4"), 4, 4),
    b5: new Button(document.getElementById("b5"), 5, 5),
    b6: new Button(document.getElementById("b6"), 6, 6),
    bx: new Button(document.getElementById("bx"), "*", "x"),
    b1: new Button(document.getElementById("b1"), 1, 1),
    b2: new Button(document.getElementById("b2"), 2, 2),
    b3: new Button(document.getElementById("b3"), 3, 3),
    bSubtraction: new Button(document.getElementById("subtraction"), "-", "-"),
    b0: new Button(document.getElementById("b0"), 0, 0),
    bComma: new Button(document.getElementById("comma"), ".", ","),
    bEqual: new Button(document.getElementById("equal")),
    bSum: new Button(document.getElementById("sum"), "+", "+"),
  },

  display: {
    element: document.getElementById("calculator-display"),
    operations: new DisplayLine(document.getElementById("operations")),
    result: new DisplayLine(document.getElementById("result")),
  },

  turnOn: function () {
    this.display.element.style.backgroundColor = "rgb(150, 213, 223)";
    this.onOff = true;
    this.display.operations.unlock();
    this.display.operations.deleteAll();
    this.display.result.deleteAll();
  },

  turnOff: function () {
    this.display.element.removeAttribute("style");
    this.onOff = false;
    this.display.operations.lock();
    this.display.operations.deleteAll();
    this.display.result.deleteAll();
  },

  clearAll: function () {
    if (!this.onOff) return;
    this.display.operations.unlock();
    this.display.operations.deleteAll();
    this.display.result.deleteAll();
  },

  calculate: function () {
    if (!this.onOff) return;
    if (this.display.operations.isLocked) return;
    this.internOperation = this.display.operations.$line.textContent;
    this.internOperation = this.internOperation.replace(/x/g, "*");
    this.internOperation = this.internOperation.replace(/,/g, ".");
    if (/\/\//.test(this.internOperation)) {
      this.display.operations.$line.textContent = "Sintaxis Error";
      this.display.operations.isLocked = true;
      return;
    }
    try {
      this.internOperation = eval(this.internOperation);
      this.display.result.$line.textContent = this.internOperation;
    } catch (error) {
      this.display.operations.$line.textContent = "Sintaxis Error";
    }
    this.display.operations.isLocked = true;
  },

  delete: function () {
    if (!this.onOff) return;
    this.display.operations.delete();
  },
};

//DOM events

//Writing
for (const key in calculator.keypad) {
  if (calculator.keypad[key].value !== undefined) {
    calculator.keypad[key].$button.addEventListener("click", () => {
      if (calculator.onOff && !calculator.display.operations.isLocked)
        calculator.display.operations.write(calculator.keypad[key].text);
    });
  }
}

//On
calculator.keypad.bOn.$button.onclick = function () {
  calculator.turnOn();
};

//Off
calculator.keypad.bOff.$button.onclick = function () {
  calculator.turnOff();
};

//Ac
calculator.keypad.bAc.$button.onclick = function () {
  calculator.clearAll();
};

//Calculate
calculator.keypad.bEqual.$button.onclick = function () {
  calculator.calculate();
};

//Delete
calculator.keypad.bDelete.$button.onclick = function () {
  calculator.delete();
};
