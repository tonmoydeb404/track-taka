import React, { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import StatCard from "../../common/components/StatCard";
import DB from "../../demo-db.json";
import { chartData, pieData } from "../../utilities/chartData";

const Analytics = () => {
  const graphData = useMemo(
    () => ({
      chart: chartData(DB.transections),
      pie: pieData(DB.transections),
    }),
    [DB.transections]
  );

  console.log(graphData);

  return (
    <>
      {/* page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold">Analytics</h2>

        {/* <!-- header actions --> */}
        <div className="flex items-center gap-2">
          <select name="dateFilter" id="dateFilter" className="select">
            <option value="THIS_MONTH">This month</option>
            <option value="LAST_MONTH">Last month</option>
            <option value="ALL">All time</option>
          </select>
        </div>
      </div>

      {/* <!-- analytics cards start --> */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 mt-10">
        <StatCard type="savings" title="savings" amount="$9999" icon="wallet" />

        <StatCard
          type="income"
          title="income"
          amount="$9999"
          icon="graph-up-arrow"
        />

        <StatCard
          type="expense"
          title="expense"
          amount="$9999"
          icon="graph-down-arrow"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-5 mt-10">
        {/* <!-- analytics graph chart start --> */}
        <div className="lg:col-span-2 bg-white border border-gray-200 p-4 min-h-[200px] dark:bg-slate-800 dark:border-slate-700 ">
          <ResponsiveContainer height={300}>
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

        {/* <!-- analytics pie chart start --> */}
        <div className="col-span-1 bg-white border border-gray-200 p-4 min-h-[200px] dark:bg-slate-800 dark:border-slate-700 ">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={graphData.pie}
                dataKey="amount"
                cx="50%"
                cy="50%"
                fill="#8884d8"
                nameKey={"name"}
              />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

export default Analytics;
