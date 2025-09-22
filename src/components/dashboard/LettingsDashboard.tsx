"use client";

import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

/* ---------------------------------- KPIs ---------------------------------- */

const lettingsKpis = [
  {
    id: 1,
    title: "Active Tenancies",
    value: "312",
    change: "+1.8%",
    dir: "up",
    compare: "vs last month",
  },
  {
    id: 2,
    title: "Vacant Units",
    value: "27",
    change: "-6.9%",
    dir: "down",
    compare: "vs last month",
  },
  {
    id: 3,
    title: "Rent Collected (MTD)",
    value: "$212,540",
    change: "+3.2%",
    dir: "up",
    compare: "vs last month",
  },
  {
    id: 4,
    title: "Arrears (MTD)",
    value: "$18,420",
    change: "-1.4%",
    dir: "down",
    compare: "vs last month",
  },
];

/* ---------------------------- Charts (Apex) ---------------------------- */

const rentChartOptions: ApexOptions = {
  legend: { show: false, position: "top", horizontalAlign: "left" },
  colors: ["#465FFF", "#9CB9FF"],
  chart: {
    fontFamily: "Outfit, sans-serif",
    height: 220,
    type: "area",
    toolbar: { show: false },
  },
  fill: { type: "gradient", gradient: { opacityFrom: 0.55, opacityTo: 0 } },
  responsive: [{ breakpoint: 480, options: { chart: { height: 220 } } }],
  stroke: { curve: "straight", width: [2, 2] },
  markers: { size: 0 },
  grid: { xaxis: { lines: { show: false } }, yaxis: { lines: { show: true } } },
  dataLabels: { enabled: false },
  tooltip: { x: { format: "MMM" } },
  xaxis: {
    type: "category",
    categories: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    axisBorder: { show: false },
    axisTicks: { show: false },
    tooltip: { enabled: false },
  },
  yaxis: { title: { text: undefined } },
};

const rentChartSeries = [
  {
    name: "Collected",
    data: [180, 195, 210, 220, 240, 235, 245, 255, 265, 270, 280, 290],
  },
  {
    name: "Expected",
    data: [200, 210, 220, 230, 245, 250, 255, 265, 275, 285, 295, 305],
  },
];

const occupancyOptions: ApexOptions = {
  colors: ["#465FFF"],
  chart: {
    fontFamily: "Outfit, sans-serif",
    type: "radialBar",
    height: 360,
    sparkline: { enabled: true },
  },
  plotOptions: {
    radialBar: {
      startAngle: -85,
      endAngle: 85,
      hollow: { size: "80%" },
      track: { background: "#E4E7EC", strokeWidth: "100%", margin: 5 },
      dataLabels: {
        name: { show: false },
        value: {
          fontSize: "36px",
          fontWeight: "600",
          offsetY: -25,
          color: "#1D2939",
          formatter: (val) => `${val}%`,
        },
      },
    },
  },
  fill: { type: "solid", colors: ["#465FFF"] },
  stroke: { lineCap: "round" },
  labels: ["Occupancy"],
};

const occupancySeries = [92];

const maintenanceOptions: ApexOptions = {
  colors: ["#3641f5", "#7592ff", "#dde9ff"],
  labels: ["Open", "In Progress", "Resolved"],
  chart: {
    fontFamily: "Outfit, sans-serif",
    type: "donut",
    width: 280,
    height: 280,
  },
  stroke: { show: false },
  plotOptions: {
    pie: {
      donut: {
        size: "65%",
        labels: {
          show: true,
          name: {
            show: true,
            offsetY: 0,
            color: "#1D2939",
            fontSize: "12px",
            fontWeight: "normal",
            formatter: () => "Tickets",
          },
          value: {
            show: true,
            offsetY: 10,
            color: "#667085",
            fontSize: "14px",
            formatter: () => "Total 215",
          },
          total: {
            show: true,
            label: "Total",
            color: "#000",
            fontSize: "20px",
            fontWeight: "bold",
          },
        },
      },
    },
  },
  states: {
    hover: { filter: { type: "none" } },
    active: {
      allowMultipleDataPointsSelection: false,
      filter: { type: "darken" },
    },
  },
  dataLabels: { enabled: false },
  tooltip: { enabled: false },
  legend: { show: false },
  responsive: [
    { breakpoint: 640, options: { chart: { width: 280, height: 280 } } },
    { breakpoint: 2600, options: { chart: { width: 240, height: 240 } } },
  ],
};

const maintenanceSeries = [120, 65, 30];

/* -------------------------- Recent Activity --------------------------- */

type ActivityRow = {
  id: string;
  party: { name: string; email: string };
  activity: "Application" | "Move-in" | "Rent Payment" | "Maintenance";
  amount?: string;
  date: string;
  status: "Approved" | "Pending" | "Overdue" | "Open";
  deletable?: boolean;
};

const activityRows: ActivityRow[] = [
  {
    id: "TEN-2341",
    party: { name: "Alex Turner", email: "alex@example.com" },
    activity: "Application",
    amount: "—",
    date: "2024-06-18",
    status: "Pending",
    deletable: true,
  },
  {
    id: "PAY-8832",
    party: { name: "Priya Shah", email: "priya@example.com" },
    activity: "Rent Payment",
    amount: "$1,450.00",
    date: "2024-06-17",
    status: "Approved",
  },
  {
    id: "WKT-7731",
    party: { name: "John Smith", email: "john@example.com" },
    activity: "Maintenance",
    amount: "—",
    date: "2024-06-16",
    status: "Open",
    deletable: true,
  },
  {
    id: "MOV-4421",
    party: { name: "Emily Chen", email: "emily@example.com" },
    activity: "Move-in",
    amount: "—",
    date: "2024-06-15",
    status: "Approved",
  },
];

/* -------------------------- Component Sections ------------------------- */

function KpiCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-4">
      {lettingsKpis.map((kpi) => (
        <div
          key={kpi.id}
          className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6"
        >
          <h4 className="text-title-sm font-bold text-gray-800 dark:text-white/90">
            {kpi.value}
          </h4>
          <div className="mt-4 flex items-end justify-between sm:mt-5">
            <p className="text-theme-sm text-gray-700 dark:text-gray-400">
              {kpi.title}
            </p>
            <div className="flex items-center gap-1">
              <span
                className={[
                  "rounded-full px-2 py-0.5 text-theme-xs font-medium",
                  kpi.dir === "up"
                    ? "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500"
                    : kpi.dir === "down"
                    ? "bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500"
                    : "bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-warning-500",
                ].join(" ")}
              >
                {kpi.change}
              </span>
              <span className="text-theme-xs text-gray-500 dark:text-gray-400">
                {kpi.compare}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function RentCollectedChart() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="mb-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Rent Collected vs Expected
          </h3>
          <p className="text-theme-sm mt-1 text-gray-500 dark:text-gray-400">
            Monthly trend
          </p>
        </div>
      </div>

      <div className="custom-scrollbar max-w-full overflow-x-auto">
        <div className="-ml-4 min-w-[650px] pl-2 xl:min-w-full">
          <ReactApexChart
            options={rentChartOptions}
            series={rentChartSeries}
            type="area"
            height={220}
          />
        </div>
      </div>
    </div>
  );
}

function OccupancyRadial() {
  const [isOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Occupancy Rate
          </h3>
          <p className="text-theme-sm mt-1 text-gray-500 dark:text-gray-400">
            This month
          </p>
        </div>
        {/* actions dropdown placeholder to match style */}
        {isOpen && (
          <div className="w-40 p-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900" />
        )}
      </div>

      <div className="relative">
        <ReactApexChart
          options={occupancyOptions}
          series={occupancySeries}
          type="radialBar"
          height={360}
        />
        <span className="absolute left-1/2 top-[60%] -translate-x-1/2 -translate-y-[60%] text-xs font-normal text-gray-500 dark:text-gray-400">
          Current Occupancy
        </span>
      </div>

      {/* Two simple progress rows to mirror your sample */}
      <div className="mt-6 space-y-5 border-t border-gary-200 pt-6 dark:border-gray-800">
        <div>
          <p className="mb-2 text-theme-sm text-gray-500 dark:text-gray-400">
            Residential
          </p>
          <div className="flex items-center justify-between">
            <p className="text-base font-semibold text-gray-800 dark:text-white/90">
              92%
            </p>
            <div className="flex w-full max-w-[140px] items-center gap-3">
              <div className="relative block h-2 w-full max-w-[100px] rounded-sm bg-gray-200 dark:bg-gray-800">
                <div className="absolute left-0 top-0 h-full w-[92%] rounded-sm bg-brand-500" />
              </div>
              <p className="text-theme-sm font-medium text-gray-700 dark:text-gray-400">
                92%
              </p>
            </div>
          </div>
        </div>

        <div>
          <p className="mb-2 text-theme-sm text-gray-500 dark:text-gray-400">
            HMO/Shared
          </p>
          <div className="flex items-center justify-between">
            <p className="text-base font-semibold text-gray-800 dark:text-white/90">
              88%
            </p>
            <div className="flex w-full max-w-[140px] items-center gap-3">
              <div className="relative block h-2 w-full max-w-[100px] rounded-sm bg-gray-200 dark:bg-gray-800">
                <div className="absolute left-0 top-0 h-full w-[88%] rounded-sm bg-brand-500" />
              </div>
              <p className="text-theme-sm font-medium text-gray-700 dark:text-gray-400">
                88%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MaintenanceDonut() {
  const [isOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Maintenance by Status
        </h3>
        {isOpen && (
          <div className="w-40 p-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900" />
        )}
      </div>

      <div className="flex flex-col items-center gap-8 xl:flex-row">
        <div className="min-w-[240px]" id="chartDarkStyle">
          <ReactApexChart
            options={maintenanceOptions}
            series={maintenanceSeries}
            type="donut"
            height={280}
          />
        </div>

        <div className="flex flex-col items-start gap-6 sm:flex-row xl:flex-col">
          {[
            { label: "Open", value: "120", pct: "56%" },
            { label: "In Progress", value: "65", pct: "30%" },
            { label: "Resolved", value: "30", pct: "14%" },
          ].map((s) => (
            <div key={s.label} className="flex items-start gap-2.5">
              <div className="mt-1.5 h-2 w-2 rounded-full bg-brand-500" />
              <div>
                <h5 className="mb-1 text-theme-sm font-medium text-gray-800 dark:text-white/90">
                  {s.label}
                </h5>
                <div className="flex items-center gap-2">
                  <p className="text-theme-sm font-medium text-gray-700 dark:text-gray-400">
                    {s.pct}
                  </p>
                  <div className="h-1 w-1 rounded-full bg-gray-400" />
                  <p className="text-theme-sm text-gray-500 dark:text-gray-400">
                    {s.value} Tickets
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function UpcomingSchedule() {
  const [checked, setChecked] = useState<Record<string, boolean>>({
    viewing_1: false,
    movein_1: false,
    inspection_1: false,
  });
  const toggle = (k: string) => setChecked((p) => ({ ...p, [k]: !p[k] }));

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Upcoming Schedule
        </h3>
      </div>

      <div className="custom-scrollbar max-w-full overflow-x-auto">
        <div className="min-w-[500px] xl:min-w-full">
          <div className="flex flex-col gap-2">
            {[
              {
                id: "viewing_1",
                date: "Wed, 11 Jan",
                time: "09:20 AM",
                title: "Viewing – 12 High St (2BR)",
              },
              {
                id: "movein_1",
                date: "Fri, 15 Feb",
                time: "10:35 AM",
                title: "Move-in – 44 Queen’s Rd",
              },
              {
                id: "inspection_1",
                date: "Thu, 18 Mar",
                time: "1:15 PM",
                title: "Inspection – 9 Park Ave",
              },
            ].map((i) => (
              <div
                key={i.id}
                className="flex cursor-pointer items-center gap-9 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-white/[0.03]"
              >
                <div className="flex items-start gap-3">
                  <input
                    className="h-5 w-5 rounded-md border-gray-300 dark:border-gray-700"
                    type="checkbox"
                    checked={checked[i.id]}
                    onChange={() => toggle(i.id)}
                  />
                  <div>
                    <span className="mb-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
                      {i.date}
                    </span>
                    <span className="text-theme-sm font-medium text-gray-700 dark:text-gray-400">
                      {i.time}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="mb-1 block text-theme-sm font-medium text-gray-700 dark:text-gray-400">
                    {i.title}
                  </span>
                  <span className="text-theme-xs text-gray-500 dark:text-gray-400">
                    Reminder 30 mins earlier
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function RecentActivityTable() {
  const [selected, setSelected] = useState<string[]>([]);
  const toggleRow = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  const allChecked = useMemo(
    () => selected.length === activityRows.length,
    [selected.length]
  );
  const toggleAll = () =>
    setSelected((prev) => (prev.length ? [] : activityRows.map((r) => r.id)));

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white pt-4 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-4 flex flex-col gap-4 px-6 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Recent Activity
        </h3>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            Filter
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            See all
          </button>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[680px] 2xl:min-w-[808px]">
          <table className="w-full text-left">
            <thead className="border-y border-gray-100 bg-gray-50 px-6 py-3 dark:border-gray-800 dark:bg-gray-900">
              <tr>
                <th className="px-4 py-3.5 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={allChecked}
                      onChange={toggleAll}
                    />
                    <span className="text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                      Ref
                    </span>
                  </div>
                </th>
                <th className="px-6 py-3.5 text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                  Party
                </th>
                <th className="px-6 py-3.5 text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                  Activity
                </th>
                <th className="px-6 py-3.5 text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                  Amount
                </th>
                <th className="px-6 py-3.5 text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                  Date
                </th>
                <th className="px-6 py-3.5 text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                  Status
                </th>
                <th className="px-6 py-3.5 text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {activityRows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-gray-100 dark:border-gray-800"
                >
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selected.includes(row.id)}
                        onChange={() => toggleRow(row.id)}
                      />
                      <span className="block text-theme-sm font-medium text-gray-700 dark:text-gray-400">
                        {row.id}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 font-medium text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
                        {row.party.name
                          .split(" ")
                          .slice(0, 2)
                          .map((s) => s[0])
                          .join("")
                          .toUpperCase()}
                      </div>
                      <div>
                        <span className="mb-0.5 block text-theme-sm font-medium text-gray-700 dark:text-gray-400">
                          {row.party.name}
                        </span>
                        <span className="text-theme-sm text-gray-500 dark:text-gray-400">
                          {row.party.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    <p className="text-theme-sm text-gray-700 dark:text-gray-400">
                      {row.activity}
                    </p>
                  </td>
                  <td className="px-6 py-3.5">
                    <p className="text-theme-sm text-gray-700 dark:text-gray-400">
                      {row.amount ?? "—"}
                    </p>
                  </td>
                  <td className="px-6 py-3.5">
                    <p className="text-theme-sm text-gray-700 dark:text-gray-400">
                      {row.date}
                    </p>
                  </td>
                  <td className="px-6 py-3.5">
                    <span
                      className={[
                        "rounded-full px-2 py-0.5 text-theme-xs font-medium",
                        row.status === "Approved"
                          ? "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500"
                          : row.status === "Pending"
                          ? "bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-warning-500"
                          : row.status === "Open"
                          ? "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-500"
                          : "bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500",
                      ].join(" ")}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5">
                    {row.deletable && (
                      <button className="text-gray-700 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-500">
                        {/* Trash icon placeholder */}
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M9 3h6m-9 4h12m-10 0v12m6-12v12M5 7l1 14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-14"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* --------------------------- Main Dashboard ---------------------------- */

export default function LettingsDashboard() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12">
        <KpiCards />
      </div>

      <div className="col-span-12 xl:col-span-8">
        <RentCollectedChart />
      </div>

      <div className="col-span-12 xl:col-span-4">
        <OccupancyRadial />
      </div>

      <div className="col-span-12 xl:col-span-6">
        <MaintenanceDonut />
      </div>

      <div className="col-span-12 xl:col-span-6">
        <UpcomingSchedule />
      </div>

      <div className="col-span-12">
        <RecentActivityTable />
      </div>
    </div>
  );
}
