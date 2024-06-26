import React, { useState, useEffect, useMemo } from "react";

function gigFormatter(packages) {
  return packages.map((pack) => pack + "GB");
}

function amounts(dictionary, packages) {
  return packages.map((pack) => dictionary[parseInt(pack)]);
}

const AT = () => {
  const initialAgentPrices = useMemo(
    () => ({
      1: 5,
      2: 7,
      3: 10,
      4: 12.5,
      5: 16,
      6: 18.5,
      7: 22,
      8: 24.5,
      9: 27.3,
      10: 31,
      11: 33.5,
      12: 35.8,
      13: 39,
      14: 32,
      15: 45,
      16: 48,
      17: 51,
      18: 54,
      19: 57,
      20: 60,
      21: 5 + 62,
      22: 7 + 62,
      23: 10 + 62,
      24: 12.5 + 62,
      25: 75,
      26: 5 + 77,
      27: 7 + 77,
      28: 10 + 77,
      29: 12.5 + 77,
      30: 89,
      31: 5 + 90,
      32: 7 + 90,
      33: 10 + 90,
      34: 12.5 + 90,
      35: 95.7,
      36: 5 + 117,
      37: 7 + 117,
      38: 10 + 117,
      39: 12.5 + 117,
      40: 120,
      41: 5 + 115,
      42: 7 + 115,
      43: 10 + 115,
      44: 12.5 + 115,
      45: 135.8,
      46: 5 + 146,
      47: 7 + 146,
      48: 10 + 146,
      49: 12.5 + 146,
      50: 150,
      60: 190,
      100: 300,
    }),
    []
  );

  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState("");
  const [tableContent, setTableContent] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    let values = inputValue.split("+").map((value) => value.trim());
    let packs = gigFormatter(values);
    let prices = amounts(initialAgentPrices, values);
    const formattedTable = tabularFormat(packs, prices);
    setTableContent(formattedTable);
  }, [inputValue, initialAgentPrices]);

  const handleInputChange = (event) => {
    const inputValue = event.target.value;

    const validInputRegex = /^[0-9+\s]*$/;

    if (validInputRegex.test(inputValue)) {
      setInputValue(inputValue);
      setInputError("");
    } else {
      setInputError("Input must contain only numbers, spaces, and +");
    }
  };

  const tabularFormat = (packages, prices) => {
    return (
      <div>
        <h4 className="sales-header">
          <span>Packs</span>
          <span>Prices</span>
        </h4>
        {packages.map((pack, index) => {
          const packLen = pack.length;
          const priceLen = String(prices[index]).length;
          const indexLen = String(index + 1).length;
          const totalLen = 20;
          const dotsLen = totalLen - (packLen + priceLen + indexLen + 5); // 5 is the number of additional characters including dots, spaces, and indexes

          let dots = "";
          for (let i = 0; i < dotsLen; i++) {
            dots += ".";
          }

          return (
            <p key={index}>
              {index + 1}. {pack} {dots} {prices[index]}
            </p>
          );
        })}
        <p className="totalAmt">
          Total: GH&#8373;
          {prices.reduce((acc, cur) => acc + cur, 0).toFixed(2)}
        </p>
        <p>Orders placed on {new Date().toLocaleDateString("en-GB")}</p>
      </div>
    );
  };

  const handleCopyToClipboard = () => {
    if (inputValue) {
      let values = inputValue.split("+").map((value) => value.trim());
      let packs = gigFormatter(values);
      let prices = amounts(initialAgentPrices, values);
      const plainTextLines = plainTextFormat(packs, prices);

      const plainText = plainTextLines.join("\n");

      navigator.clipboard
        .writeText(plainText)
        .then(() => {
          setIsCopied(true);
          setTimeout(() => {
            setIsCopied(false);
          }, 1500);
        })
        .catch((err) => console.error("Failed to copy:", err));
    }
  };

  function plainTextFormat(packages, prices) {
    let output = [];
    output.push("\n*PACKS*\t\t*PRICES*");
    for (let i = 0; i < packages.length; i++) {
      let pack = packages[i];
      let price = prices[i];
      let packLen = pack.length;
      let priceLen = price.toString().length;
      let middleLen =
        30 - (packLen + 1 + (priceLen + 1) + (i.toString().length + 2));
      let line = `${i + 1}. ${pack}`;
      for (let j = 0; j < middleLen; j++) {
        line += ".";
      }
      line += ` ${price}`;
      output.push(line);
    }
    let total = prices.reduce((acc, curr) => acc + curr, 0);
    output.push(`\n*Total: GH₵${total}*`);
    let today = new Date().toLocaleDateString();
    output.push(`\n*Orders placed on ${today}*`);
    return output;
  }

  return (
    <div className="main-container">
      <h4 className="sub-header">AT</h4>
      <div className="form">
        <div className="input-sales">
          <label htmlFor="day_sales">
            Enter your sales packages separated with +
          </label>
          <input
            type="text"
            name="sales"
            id="day_sales"
            placeholder="10 + 7 + 9 + 6 + 5"
            value={inputValue}
            onChange={handleInputChange}
          />
          {inputError && <p>{inputError}</p>}
        </div>
      </div>
      <div className="packs-container form">
        {tableContent}
        {!isCopied && (
          <button className="copy" onClick={handleCopyToClipboard}>
            Copy
          </button>
        )}
        {isCopied && <p>copied!</p>}
      </div>
    </div>
  );
};

export default AT;
