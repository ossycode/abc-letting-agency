// wizardSchemas.ts
import { RentFrequency } from "@/types/tenantMgt";
import { z } from "zod";

export const createTenantSchema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  email: z.email("Invalid email"),
  secondEmail: z.email().optional(),
  phone: z.string().min(5, "Too short"),
  secondPhone: z.string().optional(),
  notes: z.string().max(4000).optional(),
});

export const occupantSchema = z
  .object({
    // either tenantId OR newTenant
    tenantId: z.string().optional(),
    newTenant: createTenantSchema.optional(),
    isPrimary: z.boolean(),
    responsibilitySharePercent: z.number().min(0).max(100).optional(),
    occupancyStart: z.string().optional(),
    occupancyEnd: z.string().nullable().optional(),
  })
  .refine((v) => !!v.tenantId || !!v.newTenant, {
    message: "Select an existing tenant or provide new tenant details",
    path: ["tenantId"],
  });

export const step1Schema = z.object({
  propertyId: z.string({ message: "Pick a property" }),
  landlordId: z.string({ message: "Landlord required" }),
});

export const step2Schema = z
  .object({
    occupants: z.array(occupantSchema).min(1, "Add at least one occupant"),
  })
  .superRefine((val, ctx) => {
    // exactly one primary
    const primaryCount = val.occupants.filter((o) => o.isPrimary).length;
    if (primaryCount !== 1) {
      ctx.addIssue({
        code: "custom",
        message: "Exactly one primary occupant",
        path: ["occupants"],
      });
    }
    // no duplicate tenantIds
    const ids = val.occupants
      .map((o) => o.tenantId)
      .filter(Boolean) as string[];
    const dup = ids.length !== new Set(ids).size;
    if (dup) {
      ctx.addIssue({
        code: "custom",
        message: "Duplicate occupants not allowed",
        path: ["occupants"],
      });
    }
    // shares sum to 100 if any present
    const shares = val.occupants.map((o) => o.responsibilitySharePercent ?? 0);
    const any = val.occupants.some((o) => o.responsibilitySharePercent != null);
    if (any) {
      const sum = shares.reduce((a, b) => a + b, 0);
      if (Math.abs(sum - 100) > 0.001) {
        ctx.addIssue({
          code: "custom",
          message: "Shares must sum to 100%",
          path: ["occupants"],
        });
      }
    }
  });

export const step3Schema = z
  .object({
    startDate: z.string().min(1, "Required"),
    endDate: z.string().optional().nullable(),
    rentDueDay: z.number().int().min(1).max(31),
    frequency: z.enum(RentFrequency),
    rentAmount: z.number().positive(),
    commissionPercent: z.number().min(0).max(100).optional(),
    depositAmount: z.number().min(0).optional(),
    depositLocation: z.string().optional(),
    notes: z.string().max(4000).optional(),
    seedFirstCharge: z.boolean().optional(),
  })
  .refine((v) => !v.endDate || new Date(v.endDate) >= new Date(v.startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  });

export const onboardingSchema = step1Schema
  .extend(step2Schema.shape)
  .extend(step3Schema.shape);

export type OnboardingForm = z.infer<typeof onboardingSchema>;
