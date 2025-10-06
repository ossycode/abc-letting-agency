// TenancyWizard.tsx
import React, { useState } from "react";
import {
  useForm,
  FormProvider,
  useFieldArray,
  useFormContext,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { OnboardingForm, onboardingSchema } from "@/schemas/tenancyWizard";
import { propertyApi } from "@/lib/apiServices/property";
import { tenantApi } from "@/lib/apiServices/tenantsMgt/tenant";
import { CreateTenantRequest, RentFrequency } from "@/types/tenantMgt";
import { tenancyApi } from "@/lib/apiServices/tenantsMgt/tenancy";

const Stepper: React.FC<{
  step: number;
  setStep: (n: number) => void;
  max: number;
}> = ({ step, setStep, max }) => (
  <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
    {[0, 1, 2, 3].map((i) => (
      <button
        key={i}
        onClick={() => setStep(i)}
        disabled={i > step}
        style={{
          padding: "6px 10px",
          borderRadius: 6,
          border: "1px solid #ddd",
          background: i === step ? "#eee" : "#fff",
        }}
      >
        {["Property", "Occupants", "Basics", "Review"][i]}
      </button>
    ))}
  </div>
);

// ----- Step 1 -----
const Step1: React.FC = () => {
  const { register, setValue, watch } = useFormContext<OnboardingForm>();
  const propertyId = watch("propertyId");
  const { data: property } = useQuery({
    queryKey: ["property", propertyId],
    queryFn: () => propertyApi.getById(propertyId),
    enabled: !!propertyId,
  });

  React.useEffect(() => {
    if (property) setValue("landlordId", property.landlordId);
  }, [property, setValue]);

  return (
    <div>
      <label>Property Id</label>
      <input type="number" {...register("propertyId")} />
      <div style={{ marginTop: 8 }}>
        <label>Landlord Id</label>
        <input type="number" {...register("landlordId")} readOnly />
      </div>
    </div>
  );
};

// helper: small search
const TenantSearch: React.FC<{ onPick: (id: string) => void }> = ({
  onPick,
}) => {
  const [q, setQ] = useState("");
  const { data, isFetching } = useQuery({
    queryKey: ["tenantSearch", q],
    queryFn: () => tenantApi.search(q),
    enabled: q.length >= 2,
  });

  return (
    <div style={{ margin: "8px 0" }}>
      <input
        placeholder="Search name/email/phone"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      {isFetching && <div>Searching…</div>}
      <ul>
        {data?.items.map((t) => (
          <li key={t.id}>
            {t.firstName} {t.lastName} — {t.email} — {t.phone}{" "}
            <button type="button" onClick={() => onPick(t.id)}>
              Add
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// ----- Step 2 -----
const Step2: React.FC = () => {
  const methods = useFormContext<OnboardingForm>();
  const { control, register, setValue, watch } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "occupants",
  });
  const [mode, setMode] = useState<"existing" | "new">("existing");

  const addExisting = (tenantId: string) => {
    append({
      tenantId,
      isPrimary: fields.length === 0,
      responsibilitySharePercent: undefined,
    });
  };

  const addNew = () => {
    append({
      isPrimary: fields.length === 0,
      newTenant: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
      } as CreateTenantRequest,
    });
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <button type="button" onClick={() => setMode("existing")}>
          Add existing
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("new");
            addNew();
          }}
        >
          Add new
        </button>
      </div>

      {mode === "existing" && <TenantSearch onPick={addExisting} />}

      {fields.length === 0 && <div>No occupants yet.</div>}
      {fields.map((f, idx) => {
        const path = `occupants.${idx}` as const;
        const isNew = !!watch(`${path}.newTenant`);
        return (
          <div
            key={f.id}
            style={{
              border: "1px solid #eee",
              padding: 10,
              borderRadius: 6,
              marginBottom: 8,
            }}
          >
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <strong>Occupant {idx + 1}</strong>
              <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <input
                  type="checkbox"
                  {...register(`${path}.isPrimary` as const)}
                />
                Primary
              </label>
              <button type="button" onClick={() => remove(idx)}>
                Remove
              </button>
            </div>

            {isNew ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 8,
                  marginTop: 8,
                }}
              >
                <input
                  placeholder="First name"
                  {...register(`${path}.newTenant.firstName` as const)}
                />
                <input
                  placeholder="Last name"
                  {...register(`${path}.newTenant.lastName` as const)}
                />
                <input
                  placeholder="Email"
                  {...register(`${path}.newTenant.email` as const)}
                />
                <input
                  placeholder="Phone"
                  {...register(`${path}.newTenant.phone` as const)}
                />
                <input
                  placeholder="Second email"
                  {...register(`${path}.newTenant.secondEmail` as const)}
                />
                <input
                  placeholder="Second phone"
                  {...register(`${path}.newTenant.secondPhone` as const)}
                />
              </div>
            ) : (
              <div>
                Existing tenant id:{" "}
                <input {...register(`${path}.tenantId` as const)} />
              </div>
            )}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 8,
                marginTop: 8,
              }}
            >
              <input
                type="number"
                placeholder="% share"
                {...register(`${path}.responsibilitySharePercent` as const, {
                  valueAsNumber: true,
                })}
              />
              <input
                type="date"
                placeholder="Occupancy start"
                {...register(`${path}.occupancyStart` as const)}
              />
              <input
                type="date"
                placeholder="Occupancy end"
                {...register(`${path}.occupancyEnd` as const)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ----- Step 3 -----
const Step3: React.FC = () => {
  const { register } = useFormContext<OnboardingForm>();
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
      <label>
        Start date <input type="date" {...register("startDate")} />
      </label>
      <label>
        End date <input type="date" {...register("endDate")} />
      </label>
      <label>
        Rent due day{" "}
        <input
          type="number"
          {...register("rentDueDay", { valueAsNumber: true })}
        />
      </label>
      <label>
        Frequency
        <select {...register("frequency")}>
          <option value={RentFrequency.Monthly}>Monthly</option>
          <option value={RentFrequency.FourWeekly}>FourWeekly</option>
          <option value={RentFrequency.Weekly}>Weekly</option>
          <option value={RentFrequency.Yearly}>Yearly</option>
        </select>
      </label>
      <label>
        Rent amount{" "}
        <input
          type="number"
          step="0.01"
          {...register("rentAmount", { valueAsNumber: true })}
        />
      </label>
      <label>
        Commission %{" "}
        <input
          type="number"
          step="0.01"
          {...register("commissionPercent", { valueAsNumber: true })}
        />
      </label>
      <label>
        Deposit amount{" "}
        <input
          type="number"
          step="0.01"
          {...register("depositAmount", { valueAsNumber: true })}
        />
      </label>
      <label>
        Deposit location <input type="text" {...register("depositLocation")} />
      </label>
      <label style={{ gridColumn: "1 / span 2" }}>
        Notes <textarea {...register("notes")} />
      </label>
      <label>
        <input type="checkbox" {...register("seedFirstCharge")} /> Seed first
        rent charge
      </label>
    </div>
  );
};

// ----- Step 4 -----
const Step4: React.FC<{ onSubmit: () => void; submitting: boolean }> = ({
  onSubmit,
  submitting,
}) => {
  const { watch } = useFormContext<OnboardingForm>();
  const v = watch();
  return (
    <div>
      <pre style={{ background: "#f7f7f7", padding: 12, borderRadius: 8 }}>
        {JSON.stringify(v, null, 2)}
      </pre>
      <button type="button" onClick={onSubmit} disabled={submitting}>
        {submitting ? "Creating..." : "Create tenancy"}
      </button>
    </div>
  );
};

export const TenancyWizard: React.FC = () => {
  const [step, setStep] = useState(0);
  const methods = useForm<OnboardingForm>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      propertyId: undefined,
      landlordId: undefined,
      occupants: [],
      startDate: "",
      endDate: undefined,
      rentDueDay: 1,
      frequency: RentFrequency.Monthly,
      rentAmount: 0,
      commissionPercent: undefined,
      depositAmount: undefined,
      depositLocation: "",
      notes: "",
      seedFirstCharge: true,
    },
    mode: "onBlur",
  });

  const { handleSubmit, trigger } = methods;

  const startMutation = useMutation({
    mutationFn: tenancyApi.startOnboarding,
  });

  const next = async () => {
    // per-step validation
    const groups: Array<(keyof OnboardingForm)[]> = [
      ["propertyId", "landlordId"],
      ["occupants"],
      ["startDate", "endDate", "rentDueDay", "frequency", "rentAmount"],
    ];
    if (step <= 2) {
      const ok = await trigger(groups[step], { shouldFocus: true });
      if (!ok) return;
      setStep((s) => s + 1);
    }
  };

  const prev = () => setStep((s) => Math.max(0, s - 1));

  const onSubmit = handleSubmit(async (data) => {
    // send directly (single-commit)
    await startMutation.mutateAsync({
      propertyId: data.propertyId!,
      landlordId: data.landlordId!,
      startDate: data.startDate!,
      endDate: data.endDate ?? null,
      rentDueDay: data.rentDueDay,
      frequency: data.frequency,
      rentAmount: data.rentAmount,
      commissionPercent: data.commissionPercent,
      depositAmount: data.depositAmount,
      depositLocation: data.depositLocation,
      notes: data.notes,
      seedFirstCharge: !!data.seedFirstCharge,
      occupants: data.occupants.map((o) => ({
        tenantId: o.tenantId,
        newTenant: o.newTenant,
        isPrimary: o.isPrimary,
        responsibilitySharePercent: o.responsibilitySharePercent,
        occupancyStart: o.occupancyStart ?? data.startDate,
        occupancyEnd: o.occupancyEnd ?? null,
      })),
    });
    // navigate to detail view… or show success
    alert("Tenancy created!");
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={(e) => e.preventDefault()}>
        <Stepper step={step} setStep={setStep} max={3} />
        {step === 0 && <Step1 />}
        {step === 1 && <Step2 />}
        {step === 2 && <Step3 />}
        {step === 3 && (
          <Step4 onSubmit={onSubmit} submitting={startMutation.isPending} />
        )}

        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          {step > 0 && (
            <button type="button" onClick={prev}>
              Back
            </button>
          )}
          {step < 3 && (
            <button type="button" onClick={next}>
              Next
            </button>
          )}
        </div>

        {startMutation.isError && (
          <div style={{ color: "crimson", marginTop: 12 }}>
            {(startMutation.error as Error)?.message ?? "Failed"}
          </div>
        )}
      </form>
    </FormProvider>
  );
};
