"use client";

import { getApiLandlordById, patchApiLandlordById } from "@/api/sdk";
import { getApiLandlordByIdQueryKey } from "@/api/sdk/@tanstack/react-query.gen";
import { Landlord } from "@/types/landlord";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";
import Label from "../ui/Label";
import Input from "../ui/InputField";
import TextArea from "../ui/TextArea";
import Button from "../ui/Button";

const landlordUpdateSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  email: z.email("Email is required"),
  phone: z.string().trim().min(1, "Phone is required").max(50),
  address: z.string().trim().min(1, "Address is required").max(400),
  bankIban: z.string().trim().max(34).optional().or(z.literal("")),
  bankSort: z.string().trim().max(20).optional().or(z.literal("")),
  notes: z.string().trim().max(4000).optional().or(z.literal("")),
});

type LandlordUpdateForm = z.infer<typeof landlordUpdateSchema>;

type Props = {
  id?: string;
  onSuccess?: () => void;
};

function UpdateLandlordForm({ id: propId, onSuccess }: Props) {
  const params = useParams();
  const id = useMemo(
    () => propId ?? (params?.id as string | undefined),
    [propId, params]
  );

  const qc = useQueryClient();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<LandlordUpdateForm>({
    resolver: zodResolver(landlordUpdateSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      bankIban: "",
      bankSort: "",
      notes: "",
    },
  });

  // --- Load existing landlord (prefill form) ---
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["landlord", id],
    enabled: !!id,
    queryFn: async ({ signal }) => {
      const { data } = await getApiLandlordById({
        path: { id: id! },
        signal,
        throwOnError: true,
      });
      return data as Landlord;
    },
    retry: 1,
  });

  const defaults = useMemo(
    () => ({
      name: data?.name ?? "",
      email: data?.email ?? "",
      phone: data?.phone ?? "",
      address: data?.address ?? "",
      bankIban: data?.bankIban ?? "",
      bankSort: data?.bankSort ?? "",
      notes: data?.notes ?? "",
    }),
    [data]
  );

  useEffect(() => {
    if (data) reset(defaults);
  }, [data, defaults, reset]);

  // --- Save (PATCH) ---
  const mutation = useMutation({
    mutationFn: async (values: LandlordUpdateForm) => {
      const res = await patchApiLandlordById({
        path: { id: id! },
        body: {
          name: values.name,
          email: values.email,
          phone: values.phone,
          address: values.address,
          bankIban: values.bankIban || null,
          bankSort: values.bankSort || null,
          notes: values.notes || null,
        },
        headers: { "Idempotency-Key": crypto.randomUUID() },
      });
      return res;
    },
    onSuccess: async (res) => {
      if (!res.response.ok) return;
      await qc.invalidateQueries({
        queryKey: getApiLandlordByIdQueryKey({ path: { id: id! } }),
      });
      await qc.invalidateQueries({ queryKey: ["getApiLandlord"] });
    },
  });

  const onSubmit = async (values: LandlordUpdateForm) => {
    setServerError(null);
    const { data, error, response } = await mutation.mutateAsync(values);

    if (!response.ok) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const problem = (error as any) ?? data;
      const details: Record<string, string | string[]> | undefined =
        problem?.errors || problem?.Extensions?.errors;

      if (details) {
        Object.entries(details).forEach(([key, message]) => {
          setError(key as keyof LandlordUpdateForm, {
            type: "server",
            message: Array.isArray(message) ? message[0] : String(message),
          });
        });
        return;
      }

      setServerError(
        problem?.title || problem?.message || "Failed to update landlord."
      );
      return;
    }

    toast.success("Landlord updated successfully!");
    onSuccess?.();
    // Optionally go back to list or details:
    // router.push("/app/landlords");
  };

  if (!id) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Missing landlord id.
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
          {error?.message ?? "Unable to load landlord."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
          <h2 className="text-lg font-medium text-gray-800 dark:text-white">
            Update Landlord
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
              <Label>Name *</Label>
              <Input placeholder="Acme Estates Ltd" {...register("name")} />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <Label>Email *</Label>
              <Input
                type="email"
                placeholder="owner@example.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label>Phone *</Label>
              <Input placeholder="+44 20 7946 0958" {...register("phone")} />
              {errors.phone && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label>Address *</Label>
              <Input
                placeholder="123 High Street, London, SW1A 1AA"
                {...register("address")}
              />
              {errors.address && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.address.message}
                </p>
              )}
            </div>

            <div>
              <Label>Bank IBAN</Label>
              <Input
                placeholder="GB29 NWBK 6016 1331 9268 19"
                {...register("bankIban")}
              />
              {errors.bankIban && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.bankIban.message}
                </p>
              )}
            </div>

            <div>
              <Label>Bank Sort Code</Label>
              <Input placeholder="12-34-56" {...register("bankSort")} />
              {errors.bankSort && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.bankSort.message}
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
                    value={field.value ?? ""}
                    onChange={field.onChange} // your TextArea expects (value: string)
                    placeholder="Anything the team should know…"
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
              <Button
                type="button"
                variant="outline"
                onClick={() => reset()} // reset to loaded values
              >
                Reset
              </Button>
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? "Saving…" : "Update Landlord"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
export default UpdateLandlordForm;
