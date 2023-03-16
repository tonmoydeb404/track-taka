const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const dates = Array.from({ length: 30 }, (_, i) => i + 1);

export const dateData = (data = [], filter, target = null) => {
  const filterDate = new Date(target);
  let cData = [];
  const filteredData = data.filter((item) => {
    const date = new Date(item.date);
    switch (filter) {
      case "MONTH":
        if (
          date.getMonth() !== filterDate.getMonth() ||
          date.getFullYear() !== filterDate.getFullYear()
        ) {
          return false;
        }
        break;
      case "YEAR":
        if (date.getFullYear() !== filterDate.getFullYear()) {
          return false;
        }
        break;
      default:
        return false;
    }

    return true;
  });

  switch (filter) {
    case "MONTH": {
      cData = dates.map((date) => {
        const cObj = filteredData.reduce(
          (prev, curr) => {
            if (new Date(curr.date).getDate() === date) {
              return {
                ...prev,
                [curr.type]: prev[curr.type] + curr.amount,
              };
            } else {
              return prev;
            }
          },
          { option: date, income: 0, expense: 0 }
        );

        cObj.max = cObj.income > cObj.expense ? cObj.income : cObj.expense;

        return cObj;
      });
      break;
    }
    case "YEAR": {
      cData = months.map((month) => {
        const cObj = filteredData.reduce(
          (prev, curr) => {
            if (months[new Date(curr.date).getMonth()] === month) {
              return {
                ...prev,
                [curr.type]: prev[curr.type] + curr.amount,
              };
            } else {
              return prev;
            }
          },
          { option: month.slice(0, 3), income: 0, expense: 0 }
        );

        cObj.max = cObj.income > cObj.expense ? cObj.income : cObj.expense;

        return cObj;
      });
      break;
    }
    default: {
      const dateOptions = [];
      data.forEach((item) => {
        if (!dateOptions.includes(item.date)) {
          dateOptions.push(item.date);
        }
      });

      cData = dateOptions
        .sort((a, b) => {
          return new Date(a) - new Date(b);
        })
        .map((date) => {
          const cObj = data.reduce(
            (prev, curr) => {
              if (curr.date === date) {
                return {
                  ...prev,
                  [curr.type]: prev[curr.type] + curr.amount,
                };
              } else {
                return prev;
              }
            },
            { option: date, income: 0, expense: 0 }
          );

          cObj.max = cObj.income > cObj.expense ? cObj.income : cObj.expense;

          return cObj;
        });

      break;
    }
  }

  return cData;
};

export const categoryData = (
  categories = [],
  data = [],
  filter,
  target = null
) => {
  const filterDate = new Date(target);
  const filteredData = data.filter((item) => {
    const date = new Date(item.date);
    switch (filter) {
      case "MONTH":
        if (
          date.getMonth() !== filterDate.getMonth() ||
          date.getFullYear() !== filterDate.getFullYear()
        ) {
          return false;
        }
        break;
      case "YEAR":
        if (date.getFullYear() !== filterDate.getFullYear()) {
          return false;
        }
        break;
      default:
        return TrustedHTML;
    }

    return true;
  });

  return categories.map((category) => {
    return filteredData.reduce(
      (prev, curr) => {
        if (curr.category === category.value) {
          return {
            ...prev,
            [curr.type]: prev[curr.type] + curr.amount,
          };
        } else {
          return prev;
        }
      },
      { category: category.label, income: 0, expense: 0 }
    );
  });
};

// TODO: Refactor this code
