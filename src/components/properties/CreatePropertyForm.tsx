"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState, useMemo } from "react";
import { useLandlords } from "@/hooks/landlord/landlord";
import { useCreateProperty } from "@/hooks/property/useProperty";
import toast from "react-hot-toast";
import { applyProblemDetailsToForm } from "@/helper";
import Label from "../ui/Label";
import Input from "../ui/InputField";
import TextArea from "../ui/TextArea";
import Button from "../ui/Button";
import DatePicker from "../ui/date-picker";
import { PropertyFormType, propertySchema } from "@/schemas/property";

type Props = { onSuccess?: (id?: string) => void };

export default function CreatePropertyForm({ onSuccess }: Props) {
  const [serverError, setServerError] = useState<string | null>(null);

  const { data: landlordPaged } = useLandlords({
    opts: { page: 1, pageSize: 100, sortBy: "name", sortDesc: false },
  });
  const landlordOptions = useMemo(
    () => landlordPaged?.items ?? [],
    [landlordPaged?.items]
  );

  const post = useCreateProperty();

  const {
    handleSubmit,
    register,
    control,
    setError,
    formState: { errors, isSubmitting },
    reset,
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

  const onSubmit = async (values: PropertyFormType) => {
    setServerError(null);

    try {
      const payload = {
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
      };

      const created = await post.mutateAsync(payload);

      reset();
      onSuccess?.(created?.id);
      toast.success("Property created successfully!");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const top = applyProblemDetailsToForm(err, setError);
      setServerError(top ?? "Something went wrong.");
      toast.error("Something went wrong.");
    }
  };

  // for showing YYYY-MM-DD in date input
  //   const availableFrom = watch("availableFrom");
  //   const dateValue =
  //     availableFrom instanceof Date
  //       ? availableFrom.toISOString().slice(0, 10)
  //       : typeof availableFrom === "string"
  //       ? availableFrom.slice(0, 10)
  //       : "";

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
          <h2 className="text-lg font-medium text-gray-800 dark:text-white">
            Property Details
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
                    defaultDate={field.value}
                    minDate={"today"}
                    onChange={(dates, currentDateString) => {
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
              <Button type="reset" variant="outline" onClick={() => reset()}>
                Clear
              </Button>
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? "Saving…" : "Save Property"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
