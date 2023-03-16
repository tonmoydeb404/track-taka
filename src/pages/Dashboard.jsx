import React, { useMemo } from "react";
import { BsPlus } from "react-icons/bs";
import { Link } from "react-router-dom";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import DateFilter from "../common/components/DateFilter";
import Stats from "../common/components/Stats";
import TransectionTable from "../common/components/TransectionTable";
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
        <div className="col-span-12 pt-2 md:pt-4 pr-2 md:pr-4 bg-white border border-gray-200  dark:bg-slate-800 dark:border-slate-700 rounded">
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

        <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-white border border-gray-200  dark:bg-slate-800 dark:border-slate-700 rounded">
          <ResponsiveContainer width={"100%"} minHeight={400}>
            <RadarChart
              outerRadius={100}
              width={730}
              height={250}
              data={graphData.categoryChart}
            >
              <Tooltip contentStyle={{ color: "black" }} />
              <PolarGrid />
              <PolarAngleAxis dataKey="category" fontSize={12} />
              <PolarRadiusAxis fontSize={12} angle={30} domain={[0, 10000]} />
              <Radar
                name="Income"
                dataKey="income"
                stroke="#22c55e"
                fill="#22c55eaa"
                fillOpacity={0.6}
              />
              <Radar
                name="Expense"
                dataKey="expense"
                stroke="#EF4444"
                fill="#EF4444aa"
                fillOpacity={0.6}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="col-span-12 md:col-span-6 lg:col-span-8 bg-white border border-gray-200  dark:bg-slate-800 dark:border-slate-700 rounded ">
          <TransectionTable data={filteredData} />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
