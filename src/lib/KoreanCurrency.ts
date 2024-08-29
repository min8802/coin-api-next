export const getKoreanCurrency = (number: number): string => {
    const koreanUnits = ["경", "조", "억", "만", ""];
    const unit = 10000;
  
    let result = "";
  
    const decimalPart =
      number > 1
        ? (number % 1).toFixed(2).substring(1)
        : (number % 1).toFixed(6).substring(1);
    number = Math.floor(number);
  
    while (number > 0) {
      const mod = number % unit;
      number = Math.floor(number / unit);
  
      if (mod === 0) {
        koreanUnits.pop();
      } else {
        result = `${mod}${koreanUnits.pop()}${result}`;
      }
    }
  
    if (decimalPart === ".00") {
      return result;
    }
  
    if (!result) {
      return `0${decimalPart}`;
    }
  
    return `${result}${decimalPart}`;
  };