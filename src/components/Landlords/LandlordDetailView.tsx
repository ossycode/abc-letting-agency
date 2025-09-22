"use client";

import { getApiLandlordByIdOptions } from "@/api/sdk/@tanstack/react-query.gen";
import { Landlord } from "@/types/landlord";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import Link from "next/link";

const SectionCard = ({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
  >
    <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
      <h2 className="text-lg font-medium text-gray-800 dark:text-white">
        {title}
      </h2>
    </div>
    <div className="p-4 sm:p-6">{children}</div>
  </div>
);

const Row = ({ label, value }: { label: string; value?: React.ReactNode }) => (
  <div className="grid grid-cols-3 gap-3 py-2">
    <div className="col-span-1 text-sm font-medium text-gray-600 dark:text-gray-400">
      {label}
    </div>
    <div className="col-span-2 text-sm text-gray-800 dark:text-gray-300">
      {value ?? "—"}
    </div>
  </div>
);

const CopyButton = ({ text }: { text?: string | null }) => {
  if (!text) return null;
  return (
    <button
      type="button"
      onClick={() => navigator.clipboard.writeText(text)}
      className="ml-2 rounded-md border border-gray-300 px-2 py-0.5 text-xs text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-white/5"
    >
      Copy
    </button>
  );
};

export default function LandlordDetailView() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const { data, isLoading, isError, error } = useQuery(
    getApiLandlordByIdOptions({
      path: { id }, // depends on your generated type; usually { path: { id } }
    })
  );

  const landlord = useMemo(() => (data ?? null) as Landlord | null, [data]);

  return (
    <div className="space-y-6">
      {/* Top header actions */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white/90">
            {landlord?.name ?? (isLoading ? "Loading…" : "Landlord")}
          </h1>
          {landlord?.id && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              ID: {landlord.id}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {landlord?.id && (
            <Link
              href={`/app/landlords/${landlord.id}/update`}
              className="bg-brand-500 hover:bg-brand-600 rounded-lg px-4 py-2 text-sm font-medium text-white"
            >
              Edit
            </Link>
          )}
        </div>
      </div>

      {/* Loading / Error / Not found */}
      {isLoading && (
        <SectionCard title="Details">
          <div className="animate-pulse space-y-3">
            <div className="h-4 w-1/3 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-800" />
          </div>
        </SectionCard>
      )}

      {isError && (
        <SectionCard title="Details">
          <p className="text-sm text-red-600">
            {error?.message ?? "Failed to load landlord."}
          </p>
        </SectionCard>
      )}

      {!isLoading && !isError && !landlord && (
        <SectionCard title="Details">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Landlord not found.
          </p>
        </SectionCard>
      )}

      {/* Main content */}
      {!isLoading && !isError && landlord && (
        <>
          {/* Summary + Contact */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <SectionCard title="Summary" className="lg:col-span-2">
              <div className="divide-y divide-gray-200 dark:divide-gray-800">
                <Row label="Name" value={landlord.name ?? "—"} />
                <Row
                  label="Email"
                  value={
                    <span className="inline-flex items-center">
                      {landlord.email ?? "—"}
                      <CopyButton text={landlord.email} />
                    </span>
                  }
                />
                <Row
                  label="Phone"
                  value={
                    <span className="inline-flex items-center">
                      {landlord.phone ?? "—"}
                      <CopyButton text={landlord.phone} />
                    </span>
                  }
                />
                <Row label="Address" value={landlord.address ?? "—"} />
                <Row
                  label="Created"
                  value={
                    landlord.createdAt
                      ? new Date(landlord.createdAt).toLocaleString()
                      : "—"
                  }
                />
                <Row
                  label="Updated"
                  value={
                    landlord.updatedAt
                      ? new Date(landlord.updatedAt).toLocaleString()
                      : "—"
                  }
                />
              </div>
            </SectionCard>

            {/* Bank / Notes */}
            <div className="space-y-6">
              <SectionCard title="Bank Details">
                <div className="divide-y divide-gray-200 dark:divide-gray-800">
                  <Row
                    label="IBAN"
                    value={
                      <span className="inline-flex items-center">
                        {landlord.bankIban ?? "—"}
                        <CopyButton text={landlord.bankIban} />
                      </span>
                    }
                  />
                  <Row
                    label="Sort Code"
                    value={
                      <span className="inline-flex items-center">
                        {landlord.bankSort ?? "—"}
                        <CopyButton text={landlord.bankSort} />
                      </span>
                    }
                  />
                </div>
              </SectionCard>

              <SectionCard title="Notes">
                <p className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-300">
                  {landlord.notes?.trim() || "—"}
                </p>
              </SectionCard>
            </div>
          </div>

          {/* Related */}
          <SectionCard title="Related">
            {/* Tabs could be upgraded later; for now, 3 blocks */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div>
                <h3 className="mb-3 text-sm font-semibold text-gray-800 dark:text-white">
                  Properties
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Show properties owned by this landlord.
                  {/* (Wire up a query like
                  <code className="mx-1 rounded bg-gray-100 px-1 py-0.5 text-[11px] dark:bg-gray-800">
                    getApiProperties?landlordId={landlord.id}
                  </code>
                  ) */}
                </p>
              </div>
              <div>
                <h3 className="mb-3 text-sm font-semibold text-gray-800 dark:text-white">
                  Tenancies
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Active/past tenancies for this landlord.
                </p>
              </div>
              <div>
                <h3 className="mb-3 text-sm font-semibold text-gray-800 dark:text-white">
                  Invoices / Activity
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Recent invoices, maintenance jobs, or timeline updates.
                </p>
              </div>
            </div>
          </SectionCard>
        </>
      )}
    </div>
  );
}
