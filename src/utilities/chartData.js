export const chartData = (data = []) => {
  const dates = [];
  data.forEach((item) => {
    if (!dates.includes(item.date)) {
      dates.push(item.date);
    }
  });

  const cData = dates.map((date) => {
    return data.reduce(
      (prev, curr) => {
        if (curr.date == date) {
          return {
            ...prev,
            [curr.type]: prev[curr.type] + curr.amount,
          };
        } else {
          return prev;
        }
      },
      { date: date, income: 0, expense: 0 }
    );
  });

  return cData;
};

export const pieData = (data = []) => {
  return ["income", "expense"].map((type) => {
    return data.reduce(
      (prev, curr) => {
        if (curr.type == type) {
          return {
            ...prev,
            amount: prev.amount + curr.amount,
          };
        } else {
          return prev;
        }
      },
      { name: type, amount: 0 }
    );
  });
};
