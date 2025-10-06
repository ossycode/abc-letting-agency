/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Button from "../ui/Button";
import Label from "../ui/Label";
import Input from "../ui/InputField";
import TextArea from "../ui/TextArea";
import toast from "react-hot-toast";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateLandlord } from "@/hooks/landlord/landlord";
import { applyProblemDetailsToForm } from "@/helper";

const landlordSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  email: z.email("Email is required"),
  phone: z.string().trim().min(1, "Phone is required").max(50),
  address: z.string().trim().min(1, "Address is required").max(400),
  bankIban: z.string().trim().max(34).optional().or(z.literal("")),
  bankSort: z.string().trim().max(20).optional().or(z.literal("")),
  notes: z.string().trim().max(4000).optional().or(z.literal("")),
});

type LandlordForm = z.infer<typeof landlordSchema>;

type Props = { onSuccess?: (id?: string) => void };

function CreateLandlordForm({ onSuccess }: Props) {
  const [serverError, setServerError] = useState<string | null>(null);

  const post = useCreateLandlord();

  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<LandlordForm>({
    resolver: zodResolver(landlordSchema),
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

  const onSubmit = async (values: LandlordForm) => {
    setServerError(null);

    try {
      const created = await post.mutateAsync({
        name: values.name,
        email: values.email,
        phone: values.phone,
        address: values.address,
        bankIban: values.bankIban,
        bankSort: values.bankSort,
        notes: values.notes,
      });

      reset();
      onSuccess?.(created?.id);
      toast.success("Landlord created successfully!");
    } catch (err: any) {
      const top = applyProblemDetailsToForm(err, setError);
      setServerError(top ?? "Something went wrong.");
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
          <h2 className="text-lg font-medium text-gray-800 dark:text-white">
            Landlord Details
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
                    defaultValue={field.value ?? ""}
                    onChange={field.onChange}
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
              <Button type="reset" variant="outline" onClick={() => reset()}>
                Clear
              </Button>
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? "Saving…" : "Save Landlord"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
export default CreateLandlordForm;
