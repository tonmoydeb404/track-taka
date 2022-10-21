import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import MonthFilter from "../../common/components/MonthFilter";
import StatCard from "../../common/components/StatCard";
import { useTransection } from "../../common/contexts/TransectionContext";
import { chartData, pieData } from "../../utilities/chartData";

const Analytics = () => {
  const { filteredTransections: transectionList } = useTransection();

  // total incomes
  const incomes = transectionList.reduce((prev, current) => {
    if (current.type == "income") {
      return prev + current.amount;
    }
    return prev;
  }, 0);

  // total expenses
  const expenses = transectionList.reduce((prev, current) => {
    if (current.type == "expense") {
      return prev + current.amount;
    }
    return prev;
  }, 0);

  // generate graph data for analytics
  const graphData = useMemo(
    () => ({
      chart: chartData(transectionList),
      pie: pieData(transectionList),
    }),
    [transectionList]
  );

  return (
    <>
      {/* page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold">Analytics</h2>

        {/* <!-- header actions --> */}
        <div className="flex items-center gap-2">
          <MonthFilter className="w-auto" />

          <Link to={"/transections/create"} className="btn btn-success ">
            <i className="bi bi-plus"></i>
            Add New
          </Link>
        </div>
      </div>

      {/* <!-- analytics cards start --> */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 mt-10">
        <StatCard
          type="savings"
          title="savings"
          amount={incomes - expenses}
          icon="wallet"
        />

        <StatCard
          type="income"
          title="income"
          amount={incomes}
          icon="graph-up-arrow"
        />

        <StatCard
          type="expense"
          title="expense"
          amount={expenses}
          icon="graph-down-arrow"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-5 mt-10">
        {/* <!-- analytics graph chart start --> */}
        <div className="lg:col-span-3 bg-white border border-gray-200 p-4 min-h-[400px] dark:bg-slate-800 dark:border-slate-700 ">
          <ResponsiveContainer height={400}>
            <AreaChart data={graphData.chart} className="w-full">
              <Tooltip />
              <Area
                type={"monotone"}
                dataKey="expense"
                stroke="#f00"
                fill="#f00"
              />
              <Area
                type={"monotone"}
                dataKey="income"
                stroke="#8884d8"
                fill="#8884d8"
              />
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey={"date"} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

export default Analytics;
