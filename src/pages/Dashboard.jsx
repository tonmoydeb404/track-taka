import React, { useMemo } from "react";
import { Helmet } from "react-helmet";
import { BsPlus } from "react-icons/bs";
import { Link } from "react-router-dom";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import DateFilter from "../common/components/DateFilter";
import Stats from "../common/components/Stats";
import { useTransection } from "../common/contexts/transectionContext";
import useDateFilter from "../common/hooks/useDateFilter";
import categories from "../data/categories.json";
import { categoryData, dateData } from "../utilities/chartData";

const Dashboard = () => {
  const { transections } = useTransection();
  const { filterDate, filterType, filteredData, setFilterDate, setFilterType } =
    useDateFilter(transections);

  // generate graph data for analytics
  const graphData = useMemo(
    () => ({
      chart: dateData(filteredData, filterType, filterDate),
      categoryChart: categoryData(
        Object.values(categories),
        filteredData,
        filterType,
        filterDate
      ),
    }),
    [filteredData]
  );

  return (
    <>
      <Helmet>
        <title>Dashboard - Track Taka</title>
      </Helmet>

      {/* page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-10">
        <h2 className="text-2xl font-semibold">Dashboard</h2>

        {/* <!-- header actions --> */}
        <div className="flex items-center gap-2">
          <DateFilter
            filterDate={filterDate}
            filterType={filterType}
            onFilterDateChange={setFilterDate}
            onFilterTypeChange={setFilterType}
          />

          <Link to={"/transections/create"} className="btn btn-success ">
            <BsPlus />
            Add New
          </Link>
        </div>
      </div>

      <Stats transections={filteredData} />

      <div className="grid grid-cols-12 mt-5 gap-5">
        <div className="col-span-12 ">
          <span className="uppercase tracking-wider font-medium text-sm inline-block mb-1">
            statistics
          </span>
          <div className="bg-white border border-gray-200  dark:bg-slate-800 dark:border-slate-700 rounded pt-4">
            <ResponsiveContainer width={"99%"} minHeight={300}>
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
                <XAxis dataKey={"option"} fontSize={12} textAnchor="middle" />
                <YAxis dataKey={"max"} fontSize={12} width={40} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-12">
          <span className="uppercase tracking-wider font-medium text-sm inline-block mb-1">
            transection on categories
          </span>
          <div className=" bg-white border border-gray-200  dark:bg-slate-800 dark:border-slate-700 rounded pt-4">
            <ResponsiveContainer width={"99%"} minHeight={300}>
              <BarChart data={graphData.categoryChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" fontSize={12} textAnchor="middle" />
                <YAxis fontSize={12} width={40} />
                <Tooltip
                  cursor={{ fillOpacity: 0.3 }}
                  contentStyle={{ color: "black" }}
                />
                <Bar dataKey="income" fill="#22c55eaa" />
                <Bar dataKey="expense" fill="#EF4444aa" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

// TODO: make charts modular and fix recent transection
