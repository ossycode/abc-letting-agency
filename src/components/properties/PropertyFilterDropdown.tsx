import React, { useEffect, useRef, useState } from "react";
import { FilterRuleWire } from "@/types/shared";

type BoolFilter = "any" | "yes" | "no";

export const PropertyFilterDropdown: React.FC<{
  open: boolean;
  setShowFilter: (show: boolean) => void;
  onApply: (filters: FilterRuleWire[]) => void;
}> = ({ open, onApply, setShowFilter }) => {
  const ref = useRef<HTMLDivElement>(null);

  const [furnished, setFurnished] = useState<BoolFilter>("any");
  const [bedMin, setBedMin] = useState<string>("");
  const [bedMax, setBedMax] = useState<string>("");
  const [bathMin, setBathMin] = useState<string>("");
  const [bathMax, setBathMax] = useState<string>("");
  const [availableFromStart, setAvailableFromStart] = useState<string>("");
  const [availableFromEnd, setAvailableFromEnd] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [postcode, setPostcode] = useState<string>("");

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShowFilter(false);
      }
    };
    if (open) document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [open, setShowFilter]);

  const apply = () => {
    const fs: FilterRuleWire[] = [];

    if (furnished !== "any") {
      fs.push({
        field: "furnished",
        op: "eq",
        value: furnished === "yes" ? "true" : "false",
      });
    }

    // Bedrooms range
    if (bedMin) fs.push({ field: "bedrooms", op: "gte", value: bedMin });
    if (bedMax) fs.push({ field: "bedrooms", op: "lte", value: bedMax });

    // Bathrooms range
    if (bathMin) fs.push({ field: "bathrooms", op: "gte", value: bathMin });
    if (bathMax) fs.push({ field: "bathrooms", op: "lte", value: bathMax });

    // AvailableFrom between
    if (availableFromStart)
      fs.push({
        field: "availableFrom",
        op: "gte",
        value: availableFromStart,
      });
    if (availableFromEnd)
      fs.push({
        field: "availableFrom",
        op: "lte",
        value: availableFromEnd,
      });

    // City/Postcode contains
    if (city.trim())
      fs.push({ field: "city", op: "contains", value: city.trim() });
    if (postcode.trim())
      fs.push({ field: "postcode", op: "contains", value: postcode.trim() });

    onApply(fs);
    setShowFilter(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        className="shadow-theme-xs flex h-11 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
        onClick={() => setShowFilter(!open)}
        type="button"
      >
        {/* icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
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
        <div className="absolute right-0 z-10 mt-2 w-80 rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          {/* Furnished */}
          <div className="mb-4">
            <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
              Furnished
            </label>
            <select
              value={furnished}
              onChange={(e) => setFurnished(e.target.value as BoolFilter)}
              className="h-10 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
            >
              <option value="any">Any</option>
              <option value="yes">Yes only</option>
              <option value="no">No only</option>
            </select>
          </div>

          {/* Bedrooms */}
          <div className="mb-4 grid grid-cols-2 gap-3">
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                Bedrooms (min)
              </label>
              <input
                type="number"
                value={bedMin}
                onChange={(e) => setBedMin(e.target.value)}
                className="h-10 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                Bedrooms (max)
              </label>
              <input
                type="number"
                value={bedMax}
                onChange={(e) => setBedMax(e.target.value)}
                className="h-10 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              />
            </div>
          </div>

          {/* Bathrooms */}
          <div className="mb-4 grid grid-cols-2 gap-3">
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                Bathrooms (min)
              </label>
              <input
                type="number"
                value={bathMin}
                onChange={(e) => setBathMin(e.target.value)}
                className="h-10 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                Bathrooms (max)
              </label>
              <input
                type="number"
                value={bathMax}
                onChange={(e) => setBathMax(e.target.value)}
                className="h-10 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              />
            </div>
          </div>

          {/* Available From */}
          <div className="mb-4 grid grid-cols-2 gap-3">
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                Available From (start)
              </label>
              <input
                type="date"
                value={availableFromStart}
                onChange={(e) => setAvailableFromStart(e.target.value)}
                className="h-10 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                Available From (end)
              </label>
              <input
                type="date"
                value={availableFromEnd}
                onChange={(e) => setAvailableFromEnd(e.target.value)}
                className="h-10 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              />
            </div>
          </div>

          {/* City/Postcode */}
          <div className="mb-5 grid grid-cols-2 gap-3">
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                City contains
              </label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="h-10 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                Postcode contains
              </label>
              <input
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                className="h-10 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              />
            </div>
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
