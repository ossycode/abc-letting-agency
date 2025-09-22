"use client";

import React, { useMemo, useState } from "react";
import { FilterRule, LandlordDto } from "@/api/sdk";
import { useDebounced } from "@/hooks/useDebounced";
import {
  deleteApiLandlordByIdMutation,
  getApiLandlordOptions,
  getApiLandlordQueryKey,
} from "@/api/sdk/@tanstack/react-query.gen";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Button from "../ui/Button";
import Link from "next/link";
import TableDropdown from "../ui/TableDropdown";
import { useRouter } from "next/navigation";
import { stopPropagation } from "@/helper";
import { useModal } from "@/hooks/useModal";
import toast from "react-hot-toast";
import WarningModal from "../ui/modal/WarningModal";

type filterOption = "any" | "yes" | "no";
const FilterDropdown: React.FC<{
  open: boolean;
  setShowFilter: (show: boolean) => void;
  onApply: (filters: FilterRule[]) => void;
}> = ({ open, onApply, setShowFilter }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [hasEmail, setHasEmail] = React.useState<filterOption>("any");
  const [hasPhone, setHasPhone] = React.useState<"any" | "yes" | "no">("any");

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setShowFilter(false);
    };
    if (open) document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [open, setShowFilter]);

  const apply = () => {
    const fs: FilterRule[] = [];
    if (hasEmail !== "any") {
      fs.push({
        field: "email",
        op: hasEmail === "yes" ? "notnull" : "isnull",
        value: "",
      });
    }
    if (hasPhone !== "any") {
      fs.push({
        field: "phone",
        op: hasPhone === "yes" ? "notnull" : "isnull",
        value: "",
      });
    }
    onApply(fs);
    setShowFilter(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        className="shadow-theme-xs flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 sm:w-auto sm:min-w-[100px] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
        onClick={() => setShowFilter(!open)}
        type="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="M14.6537 5.90414C14.6537 4.48433 13.5027 3.33331 12.0829 3.33331C10.6631 3.33331 9.51206 4.48433 9.51204 5.90415M14.6537 5.90414C14.6537 7.32398 13.5027 8.47498 12.0829 8.47498C10.663 8.47498 9.51204 7.32398 9.51204 5.90415M14.6537 5.90414L17.7087 5.90411M9.51204 5.90415L2.29199 5.90411M5.34694 14.0958C5.34694 12.676 6.49794 11.525 7.91777 11.525C9.33761 11.525 10.4886 12.676 10.4886 14.0958M5.34694 14.0958C5.34694 15.5156 6.49794 16.6666 7.91778 16.6666C9.33761 16.6666 10.4886 15.5156 10.4886 14.0958M5.34694 14.0958L2.29199 14.0958M10.4886 14.0958L17.7087 14.0958"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Filter
      </button>

      {open && (
        <div className="absolute right-0 z-10 mt-2 w-64 rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4">
            <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
              Email present
            </label>
            <select
              value={hasEmail}
              onChange={(e) => setHasEmail(e.target.value as filterOption)}
              className="h-10 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
            >
              <option value="any">Any</option>
              <option value="yes">Yes only</option>
              <option value="no">No only</option>
            </select>
          </div>

          <div className="mb-5">
            <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
              Phone present
            </label>
            <select
              value={hasPhone}
              onChange={(e) => setHasPhone(e.target.value as filterOption)}
              className="h-10 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
            >
              <option value="any">Any</option>
              <option value="yes">Yes only</option>
              <option value="no">No only</option>
            </select>
          </div>

          <button
            onClick={apply}
            className="h-10 w-full rounded-lg bg-brand-500 px-3 py-2 text-sm font-medium text-white hover:bg-brand-600"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
};

type SortKey = keyof Pick<
  LandlordDto,
  "name" | "email" | "phone" | "createdAt"
>;
function LandlordListTable() {
  // table state
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const [sortBy, setSortBy] = useState<SortKey>("name");
  const [sortDesc, setSortDesc] = useState(false);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounced(search, 400);

  const [filters, setFilters] = useState<FilterRule[] | undefined>();
  const [showFilter, setShowFilter] = useState(false);

  const [landlordToDelete, setLandlordToDelete] = useState<LandlordDto>();

  // server query (let the helper control types)
  // const { data, isLoading, isError, error } = useQuery(
  //   getApiLandlordOptions({
  //     query: {
  //       Page: page,
  //       PageSize: pageSize,
  //       SortBy: sortBy,
  //       SortDesc: sortDesc,
  //       Search: debouncedSearch || undefined,
  //       SearchFields: ["name", "email", "phone"],
  //       filters, // FilterRule[] goes straight through
  //     },
  //   })
  // );

  const listOpts = React.useMemo(
    () => ({
      query: {
        Page: page,
        PageSize: pageSize,
        SortBy: sortBy,
        SortDesc: sortDesc,
        Search: debouncedSearch || undefined,
        SearchFields: ["name", "email", "phone"],
        filters,
      },
    }),
    [page, pageSize, sortBy, sortDesc, debouncedSearch, filters]
  );

  const { data, isLoading, isError, error } = useQuery(
    getApiLandlordOptions(listOpts)
  );

  const router = useRouter();
  const items = useMemo(() => data?.items ?? [], [data?.items]);
  const total = data?.total ?? 0;
  const svrPage = data?.page ?? page;
  const svrPageSize = data?.pageSize ?? pageSize;
  const totalPages =
    data?.totalPages ?? (svrPageSize > 0 ? Math.ceil(total / svrPageSize) : 1);

  const deleteModalControl = useModal();

  const qc = useQueryClient();

  const delMutation = useMutation({
    // your hey-api helper returns a UseMutationOptions with mutationFn
    ...deleteApiLandlordByIdMutation(),

    // add/override callbacks here
    onSuccess: async () => {
      await qc.invalidateQueries({
        queryKey: getApiLandlordQueryKey(listOpts),
      });
      deleteModalControl.closeModal();
      toast.success("Landlord deleted successfully");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err: any) => {
      toast.error(err?.message ?? "Failed to delete landlord");
    },
  });

  const isDeleting = delMutation.isPending;

  const handleDelete = async () => {
    if (!landlordToDelete?.id) return;

    await delMutation.mutateAsync({
      path: { id: String(landlordToDelete.id) },
      headers: { "Idempotency-Key": crypto.randomUUID() },
    });
  };

  const toggleSort = (key: SortKey) => {
    setPage(1);
    if (sortBy !== key) {
      setSortBy(key);
      setSortDesc(false);
    } else {
      setSortDesc((d) => !d);
    }
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const shownIds = React.useMemo(
    () => items.map((l) => l.id as string),
    [items]
  );
  const isAllSelected =
    shownIds.length > 0 && shownIds.every((id) => selected.includes(id));
  const toggleAll = () => {
    setSelected((prev) =>
      isAllSelected
        ? prev.filter((id) => !shownIds.includes(id))
        : [...new Set([...prev, ...shownIds])]
    );
  };

  const go = (id: string) => router.push(`/app/landlords/${id}`);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      {/* Header */}
      <div className="flex flex-col justify-between gap-5 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center dark:border-gray-800">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Landlords
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Browse, search, and filter landlords.
          </p>
        </div>

        <div className="relative flex gap-3">
          <Button variant="outline">Export</Button>
          <Link
            href="/app/landlords/create"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-brand-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M5 10.0002H15.0006M10.0002 5V15.0006"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Add Landlord
          </Link>
        </div>
      </div>

      {/* Toolbar */}
      <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-800">
        <div className="flex gap-3 sm:justify-between">
          <div className="relative flex-1 sm:flex-auto">
            <span className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500 dark:text-gray-400">
              <svg
                className="fill-current"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M3.04199 9.37336937363C3.04199 5.87693 5.87735 3.04199 9.37533 3.04199C12.8733 3.04199 15.7087 5.87693 15.7087 9.37363C15.7087 12.8703 12.8733 15.7053 9.37533 15.7053C5.87735 15.7053 3.04199 12.8703 3.04199 9.37363ZM9.37533 1.54199C5.04926 1.54199 1.54199 5.04817 1.54199 9.37363C1.54199 13.6991 5.04926 17.2053 9.37533 17.2053C11.2676 17.2053 13.0032 16.5344 14.3572 15.4176L17.1773 18.238C17.4702 18.5309 17.945 18.5309 18.2379 18.238C18.5308 17.9451 18.5309 17.4703 18.238 17.1773L15.4182 14.3573C16.5367 13.0033 17.2087 11.2669 17.2087 9.37363C17.2087 5.04817 13.7014 1.54199 9.37533 1.54199Z"
                  fill=""
                />
              </svg>
            </span>
            <input
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              type="text"
              placeholder="Search..."
              className="shadow-sm focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pr-4 pl-11 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-none sm:w-[300px] sm:min-w-[300px] dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
            />
          </div>
          <FilterDropdown
            open={showFilter}
            setShowFilter={setShowFilter}
            onApply={(fs) => {
              setPage(1);
              setFilters(fs.length ? fs : undefined);
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:divide-gray-800 dark:border-gray-800">
              <th className="w-14 px-5 py-4 text-left">
                <label className="select-none text-sm font-medium text-gray-700 dark:text-gray-400">
                  <input
                    type="checkbox"
                    className="sr-only"
                    onChange={toggleAll}
                    checked={isAllSelected}
                  />
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded-sm border-[1.25px] ${
                      isAllSelected
                        ? "border-brand-500 bg-brand-500"
                        : "border-gray-300 bg-transparent dark:border-gray-700"
                    }`}
                  >
                    <span className={isAllSelected ? "" : "opacity-0"}>
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <path
                          d="M10 3L4.5 8.5L2 6"
                          stroke="white"
                          strokeWidth="1.6666"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </span>
                </label>
              </th>

              <HeaderSort
                label="Name"
                activeKey={sortBy}
                keyName="name"
                asc={!sortDesc}
                onSort={toggleSort}
              />
              <HeaderSort
                label="Email"
                activeKey={sortBy}
                keyName="email"
                asc={!sortDesc}
                onSort={toggleSort}
              />
              <HeaderSort
                label="Phone"
                activeKey={sortBy}
                keyName="phone"
                asc={!sortDesc}
                onSort={toggleSort}
              />
              <HeaderSort
                label="Created At"
                activeKey={sortBy}
                keyName="createdAt"
                asc={!sortDesc}
                onSort={toggleSort}
              />

              <th className="px-5 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                <span className="sr-only">Action</span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-x divide-y divide-gray-200 dark:divide-gray-800">
            {isLoading && (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-6 text-sm text-gray-500 dark:text-gray-400"
                >
                  Loading…
                </td>
              </tr>
            )}
            {isError && (
              <tr>
                <td colSpan={6} className="px-5 py-6 text-sm text-red-600">
                  {error?.message ?? "Failed to load landlords."}
                </td>
              </tr>
            )}
            {!isLoading && !isError && items.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-6 text-sm text-gray-500 dark:text-gray-400"
                >
                  No landlords found.
                </td>
              </tr>
            )}

            {items.map((landlord) => {
              const id = String(landlord.id);
              return (
                <tr
                  key={id}
                  onKeyDown={(e) =>
                    (e.key === "Enter" || e.key === " ") && go(id)
                  }
                  onClick={() => go(id)}
                  role="button"
                  tabIndex={0}
                  className="transition hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer"
                >
                  <td
                    className="w-14 px-5 py-4 whitespace-nowrap"
                    onClick={stopPropagation}
                  >
                    <label className="select-none text-sm font-medium text-gray-700 dark:text-gray-400">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={selected.includes(id)}
                        onChange={() => toggleSelect(id)}
                        onClick={stopPropagation}
                      />
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded-sm border-[1.25px] ${
                          selected.includes(id)
                            ? "border-brand-500 bg-brand-500"
                            : "border-gray-300 bg-transparent dark:border-gray-700"
                        }`}
                      >
                        <span
                          className={selected.includes(id) ? "" : "opacity-0"}
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                          >
                            <path
                              d="M10 3L4.5 8.5L2 6"
                              stroke="white"
                              strokeWidth="1.6666"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      </span>
                    </label>
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {landlord.name}
                    </span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {landlord.email ?? "—"}
                    </p>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-700 dark:text-gray-400">
                      {landlord.phone ?? "—"}
                    </p>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-700 dark:text-gray-400">
                      {landlord.createdAt
                        ? new Date(landlord.createdAt).toLocaleDateString()
                        : "—"}
                    </p>
                  </td>
                  <td
                    className="px-5 py-4 whitespace-nowrap"
                    onClick={stopPropagation}
                  >
                    <div className="relative inline-block">
                      <TableDropdown
                        dropdownButton={
                          <button className="text-gray-500 dark:text-gray-400">
                            <svg
                              className="fill-current"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M5.99902 10.245C6.96552 10.245 7.74902 11.0285 7.74902 11.995V12.005C7.74902 12.9715 6.96552 13.755 5.99902 13.755C5.03253 13.755 4.24902 12.9715 4.24902 12.005V11.995C4.24902 11.0285 5.03253 10.245 5.99902 10.245ZM17.999 10.245C18.9655 10.245 19.749 11.0285 19.749 11.995V12.005C19.749 12.9715 18.9655 13.755 17.999 13.755C17.0325 13.755 16.249 12.9715 16.249 12.005V11.995C16.249 11.0285 17.0325 10.245 17.999 10.245ZM13.749 11.995C13.749 11.0285 12.9655 10.245 11.999 10.245C11.0325 10.245 10.249 11.0285 10.249 11.995V12.005C10.249 12.9715 11.0325 13.755 11.999 13.755C12.9655 13.755 13.749 12.9715 13.749 12.005V11.995Z"
                                fill=""
                              />
                            </svg>
                          </button>
                        }
                        dropdownContent={
                          <>
                            <Link
                              href={`/app/landlords/${landlord.id}/update`}
                              className="text-xs flex w-full rounded-lg px-3 py-2 text-left font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                              onClick={stopPropagation}
                            >
                              Edit
                            </Link>
                            <button
                              onClick={(e) => {
                                stopPropagation(e);
                                setLandlordToDelete(landlord);
                                deleteModalControl.openModal();
                              }}
                              // onClick={handleDelete}
                              className="text-xs flex w-full rounded-lg px-3 py-2 text-left font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                            >
                              Delete
                            </button>
                          </>
                        }
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination */}
      <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-200 px-5 py-4 sm:flex-row dark:border-gray-800">
        <div>
          <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">
            Page{" "}
            <span className="text-gray-800 dark:text-white/90">{svrPage}</span>{" "}
            of{" "}
            <span className="text-gray-800 dark:text-white/90">
              {totalPages}
            </span>{" "}
            • <span className="text-gray-800 dark:text-white/90">{total}</span>{" "}
            total
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={svrPage <= 1}
            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white p-2 text-gray-700 shadow-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/5"
          >
            Prev
          </button>

          <ul className="hidden items-center gap-0.5 sm:flex">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <li key={n}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(n);
                  }}
                  className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium ${
                    svrPage === n
                      ? "bg-brand-500 text-white"
                      : "text-gray-700 hover:bg-brand-500 hover:text-white dark:text-gray-400 dark:hover:text-white"
                  }`}
                >
                  <span>{n}</span>
                </a>
              </li>
            ))}
          </ul>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={svrPage >= totalPages}
            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white p-2 text-gray-700 shadow-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/5"
          >
            Next
          </button>
        </div>
      </div>

      {landlordToDelete && (
        <WarningModal
          open={deleteModalControl.isOpen}
          title="Delete Landlord"
          message={`Are you sure you want to delete this landlord? This action is irreversible.`}
          onClose={deleteModalControl.closeModal}
          onConfirm={handleDelete}
          isSubmitting={isDeleting}
        />
      )}
    </div>
  );
}

/** Small header helper to render sortable column headers */
function HeaderSort({
  label,
  keyName,
  activeKey,
  asc,
  onSort,
}: {
  label: string;
  keyName: SortKey;
  activeKey: SortKey;
  asc: boolean;
  onSort: (k: SortKey) => void;
}) {
  const active = activeKey === keyName;
  return (
    <th
      onClick={() => onSort(keyName)}
      className="cursor-pointer px-5 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400"
    >
      <div className="flex items-center gap-2">
        <p className="text-xs font-medium">{label}</p>
        <span className="flex flex-col leading-none">
          <svg
            className={
              active && asc
                ? "text-gray-500 dark:text-gray-400"
                : "text-gray-300 dark:text-gray-600"
            }
            width="8"
            height="5"
            viewBox="0 0 8 5"
            fill="currentColor"
          >
            <path d="M4.41.585a.5.5 0 0 0-.82 0L1.05 4.213C.819 4.545 1.056 5 1.46 5h5.08c.405 0 .642-.455.41-.787L4.41.585Z" />
          </svg>
          <svg
            className={
              active && !asc
                ? "text-gray-500 dark:text-gray-400"
                : "text-gray-300 dark:text-gray-600"
            }
            width="8"
            height="5"
            viewBox="0 0 8 5"
            fill="currentColor"
          >
            <path d="M4.41 4.415a.5.5 0 0 1-.82 0L1.05.787C.819.455 1.056 0 1.46 0h5.08c.405 0 .642.455.41.787L4.41 4.415Z" />
          </svg>
        </span>
      </div>
    </th>
  );
}
export default LandlordListTable;
