"use client";

import Link from "next/link";
import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useDebounced } from "@/hooks/useDebounced";
import { PropertyDto } from "@/types/property";
import { FilterRuleWire } from "@/types/shared";
import { PropertyFilterDropdown } from "./PropertyFilterDropdown";
import { useModal } from "@/hooks/useModal";
import { useProperties } from "@/hooks/property/useProperties";
import { useDeleteProperty } from "@/hooks/property/useProperty";
import toast from "react-hot-toast";
import Button from "../ui/Button";
import WarningModal from "../ui/modal/WarningModal";
import { stopPropagation } from "@/helper";
import TableDropdown from "../ui/TableDropdown";

type SortKey = keyof Pick<
  PropertyDto,
  | "code"
  | "addressLine1"
  | "city"
  | "postcode"
  | "bedrooms"
  | "bathrooms"
  | "furnished"
  | "availableFrom"
  | "createdAt"
>;

export default function PropertyListTable() {
  // table state
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const [sortBy, setSortBy] = useState<SortKey>("createdAt");
  const [sortDesc, setSortDesc] = useState(true);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounced(search, 400);

  const [filters, setFilters] = useState<FilterRuleWire[] | undefined>();
  const [showFilter, setShowFilter] = useState(false);

  const [toDelete, setToDelete] = useState<PropertyDto>();
  const deleteModal = useModal();
  const router = useRouter();

  const { data, isLoading, isError, error } = useProperties({
    opts: {
      page,
      pageSize,
      sortBy,
      sortDesc,
      search: debouncedSearch || undefined,
      // search across these fields
      searchFields: [
        "code",
        "addressLine1",
        "addressLine2",
        "city",
        "postcode",
      ],
    },
    filters,
  });

  const items = useMemo(() => data?.items ?? [], [data?.items]);
  const total = data?.total ?? 0;
  const svrPage = data?.page ?? page;
  const svrPageSize = data?.pageSize ?? pageSize;
  const totalPages =
    data?.totalPages ?? (svrPageSize > 0 ? Math.ceil(total / svrPageSize) : 1);

  const del = useDeleteProperty();

  const handleDelete = async () => {
    if (!toDelete?.id) return;
    try {
      await del.mutateAsync(String(toDelete.id));
      deleteModal.closeModal();
      toast.success("Property deleted successfully");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to delete property");
    }
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

  const shownIds = useMemo(() => items.map((p) => p.id as string), [items]);
  const isAllSelected =
    shownIds.length > 0 && shownIds.every((id) => selected.includes(id));
  const toggleAll = () => {
    setSelected((prev) =>
      isAllSelected
        ? prev.filter((id) => !shownIds.includes(id))
        : [...new Set([...prev, ...shownIds])]
    );
  };
  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const go = (id: string) => router.push(`/app/properties/${id}`);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      {/* Header */}
      <div className="flex flex-col justify-between gap-5 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center dark:border-gray-800">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Properties
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Browse, search, and filter properties.
          </p>
        </div>

        <div className="relative flex gap-3">
          <Button variant="outline">Export</Button>
          <Link
            href="/app/properties/create"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-brand-600"
          >
            Add Property
          </Link>
        </div>
      </div>

      {/* Toolbar */}
      <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-800">
        <div className="flex gap-3 sm:justify-between">
          <div className="relative flex-1 sm:flex-auto">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
              <svg
                className="fill-current"
                width="20"
                height="20"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M3.042 9.374C3.042 5.877 5.877 3.042 9.375 3.042c3.498 0 6.333 2.835 6.333 6.332 0 3.497-2.835 6.332-6.333 6.332C5.877 15.706 3.042 12.871 3.042 9.374Zm6.333-7.832C5.049 1.542 1.542 5.048 1.542 9.374c0 4.325 3.507 7.831 7.833 7.831 1.892 0 3.628-.671 4.982-1.787l2.82 2.821c.293.293.768.293 1.061 0 .293-.293.293-.768 0-1.061l-2.82-2.821A7.804 7.804 0 0 0 17.209 9.374c0-4.326-3.507-7.832-7.834-7.832Z"
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
              placeholder="Search code or address…"
              className="shadow-sm focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pr-4 pl-11 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-none sm:w-[300px] sm:min-w-[300px] dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
            />
          </div>

          <PropertyFilterDropdown
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
                label="Code"
                keyName="code"
                activeKey={sortBy}
                asc={!sortDesc}
                onSort={toggleSort}
              />
              <HeaderSort
                label="Address"
                keyName="addressLine1"
                activeKey={sortBy}
                asc={!sortDesc}
                onSort={toggleSort}
              />
              <HeaderSort
                label="City"
                keyName="city"
                activeKey={sortBy}
                asc={!sortDesc}
                onSort={toggleSort}
              />
              <HeaderSort
                label="Postcode"
                keyName="postcode"
                activeKey={sortBy}
                asc={!sortDesc}
                onSort={toggleSort}
              />
              <HeaderSort
                label="Beds"
                keyName="bedrooms"
                activeKey={sortBy}
                asc={!sortDesc}
                onSort={toggleSort}
              />
              <HeaderSort
                label="Baths"
                keyName="bathrooms"
                activeKey={sortBy}
                asc={!sortDesc}
                onSort={toggleSort}
              />
              <HeaderSort
                label="Furnished"
                keyName="furnished"
                activeKey={sortBy}
                asc={!sortDesc}
                onSort={toggleSort}
              />
              <HeaderSort
                label="Available From"
                keyName="availableFrom"
                activeKey={sortBy}
                asc={!sortDesc}
                onSort={toggleSort}
              />
              <HeaderSort
                label="Created"
                keyName="createdAt"
                activeKey={sortBy}
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
                  colSpan={11}
                  className="px-5 py-6 text-sm text-gray-500 dark:text-gray-400"
                >
                  Loading…
                </td>
              </tr>
            )}
            {isError && (
              <tr>
                <td colSpan={11} className="px-5 py-6 text-sm text-red-600">
                  {error?.message ?? "Failed to load properties."}
                </td>
              </tr>
            )}
            {!isLoading && !isError && items.length === 0 && (
              <tr>
                <td
                  colSpan={11}
                  className="px-5 py-6 text-sm text-gray-500 dark:text-gray-400"
                >
                  No properties found.
                </td>
              </tr>
            )}

            {items.map((p) => {
              const id = String(p.id);
              return (
                <tr
                  key={id}
                  onKeyDown={(e) =>
                    (e.key === "Enter" || e.key === " ") && go(id)
                  }
                  onClick={() => go(id)}
                  role="button"
                  tabIndex={0}
                  className="cursor-pointer transition hover:bg-gray-50 dark:hover:bg-gray-900"
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
                      {p.code ?? "—"}
                    </span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {p.addressLine1}
                      {p.addressLine2 ? `, ${p.addressLine2}` : ""}
                    </p>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {p.city ?? "—"}
                    </p>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {p.postcode ?? "—"}
                    </p>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {p.bedrooms ?? "—"}
                    </p>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {p.bathrooms ?? "—"}
                    </p>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {p.furnished == null ? "—" : p.furnished ? "Yes" : "No"}
                    </p>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {p.availableFrom
                        ? new Date(p.availableFrom).toLocaleDateString()
                        : "—"}
                    </p>
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {p.createdAt
                        ? new Date(p.createdAt).toLocaleDateString()
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
                              href={`/app/properties/${p.id}/update`}
                              className="text-xs flex w-full rounded-lg px-3 py-2 text-left font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                              onClick={stopPropagation}
                            >
                              Edit
                            </Link>
                            <button
                              onClick={(e) => {
                                stopPropagation(e);
                                setToDelete(p);
                                deleteModal.openModal();
                              }}
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

      {toDelete && (
        <WarningModal
          open={deleteModal.isOpen}
          title="Delete Property"
          message="Are you sure you want to delete this property? This action is irreversible."
          onClose={deleteModal.closeModal}
          onConfirm={handleDelete}
          isSubmitting={del.isPending}
        />
      )}
    </div>
  );
}

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
