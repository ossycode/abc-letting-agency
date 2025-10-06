"use client";

import { applyProblemDetailsToForm } from "@/helper";
import { useLandlords } from "@/hooks/landlord/landlord";
import { useProperty, useUpdateProperty } from "@/hooks/property/useProperty";
import { PropertyFormType, propertySchema } from "@/schemas/property";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Label from "../ui/Label";
import DatePicker from "../ui/date-picker";
import Input from "../ui/InputField";
import TextArea from "../ui/TextArea";
import Button from "../ui/Button";
import { useParams } from "next/navigation";

type Props = { id?: string; onSuccess?: () => void };

export default function UpdatePropertyForm({ id: propId, onSuccess }: Props) {
  const params = useParams();
  const id = useMemo(
    () => propId ?? (params?.id as string | undefined),
    [propId, params]
  );

  const [serverError, setServerError] = useState<string | null>(null);

  const { data: landlordPaged } = useLandlords({
    opts: { page: 1, pageSize: 100, sortBy: "name", sortDesc: false },
  });
  const landlordOptions = useMemo(
    () => landlordPaged?.items ?? [],
    [landlordPaged?.items]
  );

  const { data, isLoading, isError, error } = useProperty(id, {
    enabled: !!id,
  });

  const update = useUpdateProperty(id!);

  const {
    handleSubmit,
    register,
    control,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PropertyFormType>({
    resolver: zodResolver(propertySchema),
    mode: "onChange",
    defaultValues: {
      addressLine1: "",
      addressLine2: "",
      city: "",
      postcode: "",
      bedrooms: undefined,
      bathrooms: undefined,
      furnished: undefined,
      availableFrom: "",
      landlordId: "",
      notes: "",
    },
  });

  const isoToYmd = (iso?: string | null) =>
    iso ? new Date(iso).toISOString().slice(0, 10) : "";

  useEffect(() => {
    if (!data) return;
    reset({
      addressLine1: data.addressLine1 ?? "",
      addressLine2: data.addressLine2 ?? "",
      city: data.city ?? "",
      postcode: data.postcode ?? "",
      bedrooms: (data.bedrooms ?? undefined) as unknown as number | undefined,
      bathrooms: (data.bathrooms ?? undefined) as unknown as number | undefined,
      furnished: data.furnished ?? undefined,
      availableFrom: isoToYmd(data.availableFrom),
      landlordId: String(data.landlordId ?? ""),
      notes: data.notes ?? "",
    });
  }, [data, reset]);

  const onSubmit = async (values: PropertyFormType) => {
    setServerError(null);
    try {
      await update.mutateAsync({
        addressLine1: values.addressLine1,
        addressLine2: values.addressLine2,
        city: values.city,
        postcode: values.postcode,
        bedrooms: values.bedrooms,
        bathrooms: values.bathrooms,
        furnished: values.furnished,
        availableFrom: values.availableFrom
          ? new Date(values.availableFrom).toISOString()
          : undefined,
        landlordId: values.landlordId,
        notes: values.notes,
      });

      toast.success("Property updated successfully!");
      onSuccess?.();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const top = applyProblemDetailsToForm(err, setError);
      setServerError(top ?? "Failed to update property.");
      toast.error("Failed to update property.");
    }
  };

  if (!id) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Missing property id.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <p className="text-sm text-gray-600 dark:text-gray-400">Loading…</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <p className="text-sm text-red-600">
          {error?.message ?? "Unable to load property."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
          <h2 className="text-lg font-medium text-gray-800 dark:text-white">
            Update Property
          </h2>
        </div>

        <div className="p-4 sm:p-6">
          {serverError && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-900/10 dark:text-red-300">
              {serverError}
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-5 md:grid-cols-2"
          >
            <div>
              <Label>Landlord *</Label>
              <select
                className="h-10 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                {...register("landlordId")}
              >
                <option value="">Select landlord…</option>
                {landlordOptions.map((l) => (
                  <option key={String(l.id)} value={String(l.id)}>
                    {l.name}
                  </option>
                ))}
              </select>
              {errors.landlordId && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.landlordId.message}
                </p>
              )}
            </div>

            <div>
              <Controller
                control={control}
                name="availableFrom"
                render={({ field }) => (
                  <DatePicker
                    id="date-picker"
                    label="Available From"
                    placeholder="Select a date"
                    defaultDate={field.value} // "YYYY-MM-DD"
                    minDate={"today"}
                    onChange={(_dates, currentDateString) => {
                      field.onChange(currentDateString || undefined);
                    }}
                  />
                )}
              />
              {errors.availableFrom && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.availableFrom.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label>Address Line 1 *</Label>
              <Input
                placeholder="123 High Street"
                {...register("addressLine1")}
              />
              {errors.addressLine1 && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.addressLine1.message}
                </p>
              )}
            </div>

            <div>
              <Label>Address Line 2</Label>
              <Input placeholder="Apt / Suite" {...register("addressLine2")} />
              {errors.addressLine2 && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.addressLine2.message}
                </p>
              )}
            </div>

            <div>
              <Label>City</Label>
              <Input placeholder="London" {...register("city")} />
              {errors.city && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.city.message}
                </p>
              )}
            </div>

            <div>
              <Label>Postcode</Label>
              <Input placeholder="SW1A 1AA" {...register("postcode")} />
              {errors.postcode && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.postcode.message}
                </p>
              )}
            </div>

            <div>
              <Label>Furnished</Label>
              <Controller
                control={control}
                name="furnished"
                render={({ field }) => (
                  <select
                    value={
                      field.value === undefined
                        ? ""
                        : field.value
                        ? "yes"
                        : "no"
                    }
                    onChange={(e) => {
                      const v = e.target.value;
                      field.onChange(v === "" ? undefined : v === "yes");
                    }}
                    className="h-10 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                  >
                    <option value="">—</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                )}
              />
              {errors.furnished && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.furnished.message}
                </p>
              )}
            </div>

            <div>
              <Label>Bedrooms</Label>
              <Input
                type="number"
                inputMode="numeric"
                placeholder="e.g. 3"
                {...register("bedrooms", {
                  setValueAs: (v) =>
                    v === "" || v === null ? undefined : Number(v),
                })}
              />
              {errors.bedrooms && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.bedrooms.message}
                </p>
              )}
            </div>

            <div>
              <Label>Bathrooms</Label>
              <Input
                type="number"
                inputMode="numeric"
                placeholder="e.g. 2"
                {...register("bathrooms", {
                  setValueAs: (v) =>
                    v === "" || v === null ? undefined : Number(v),
                })}
              />
              {errors.bathrooms && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.bathrooms.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label>Notes</Label>
              <Controller
                control={control}
                name="notes"
                render={({ field }) => (
                  <TextArea
                    rows={4}
                    defaultValue={field.value ?? ""}
                    onChange={field.onChange}
                    placeholder="Any extra details…"
                  />
                )}
              />
              {errors.notes && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.notes.message}
                </p>
              )}
            </div>

            <div className="col-span-full flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={() => reset()}>
                Reset
              </Button>
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? "Saving…" : "Update Property"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
