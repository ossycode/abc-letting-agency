import z from "zod";

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

export const propertySchema = z.object({
  addressLine1: z.string().trim().min(1, "Address line 1 is required").max(200),
  addressLine2: z.string().trim().max(200).optional(), // no transform
  city: z.string().trim().min(1, "City is required").max(120),
  postcode: z.string().trim().min(1, "Postcode is required").max(20),
  bedrooms: z
    .number({ error: "Bedrooms is required" })
    .int("Bedrooms must be a whole number")
    .min(0, "Bedrooms cannot be negative")
    .max(50, "Bedrooms max is 50"),
  bathrooms: z
    .number({
      error: "Bathrooms is required",
    })
    .int("Bathrooms must be a whole number")
    .min(0, "Bathrooms cannot be negative")
    .max(50, "Bathrooms max is 50"),
  furnished: z.boolean().optional(),
  // Accept date-only string "YYYY-MM-DD" (or empty) as optional
  //   availableFrom: z.string().trim().optional(), // no transform
  availableFrom: z
    .string()
    .trim()
    .optional()
    .refine((v) => !v || new Date(v) >= startOfToday(), {
      message: "Available From cannot be in the past",
    }),
  landlordId: z.string().trim().min(1, "Landlord is required"),
  notes: z.string().trim().max(4000).optional(), // no transform
});

export type PropertyFormType = z.infer<typeof propertySchema>;
