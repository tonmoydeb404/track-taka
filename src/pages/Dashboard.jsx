import React, { useMemo } from "react";
import { BsPlus } from "react-icons/bs";
import { Link } from "react-router-dom";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import MonthFilter from "../common/components/MonthFilter";
import StatCards from "../common/components/StatCards";
import { useTransection } from "../common/contexts/transectionContext";
import { chartData, pieData } from "../utilities/chartData";

const Dashboard = () => {
  const { transections } = useTransection();

  // generate graph data for analytics
  const graphData = useMemo(
    () => ({
      chart: chartData(transections),
      pie: pieData(transections),
    }),
    [transections]
  );

  return (
    <>
      {/* page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold">Dashboard</h2>

        {/* <!-- header actions --> */}
        <div className="flex items-center gap-2">
          <MonthFilter className="w-auto" />

          <Link to={"/transections/create"} className="btn btn-success ">
            <BsPlus />
            Add New
          </Link>
        </div>
      </div>

      {/* <!-- analytics cards start --> */}
      <StatCards />

      <div className="grid lg:grid-cols-3 gap-5 mt-10">
        {/* <!-- analytics graph chart start --> */}
        <div className="lg:col-span-3 bg-white border border-gray-200 p-4 min-h-[400px] dark:bg-slate-800 dark:border-slate-700 ">
          <ResponsiveContainer height={400} width={"100%"}>
            <AreaChart data={graphData.chart} className="w-full">
              <Tooltip contentStyle={{ color: "black" }} />
              <Area
                type={"monotone"}
                dataKey="expense"
                stroke="#EF4444"
                fill="#EF4444aa"
              />
              <Area
                type={"monotone"}
                dataKey="income"
                stroke="#22c55e"
                fill="#22c55eaa"
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

export default Dashboard;
