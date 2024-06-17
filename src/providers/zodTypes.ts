import { ZodType, z } from "zod";

export type LoginFields = {
  username: string;
  password: string;
};

export const loginSchema: ZodType<LoginFields> = z.object({
  username: z.string().min(1, "Username should be atleast 1 character"),
  password: z.string().min(4, "Password must be at least 8 characters"),
});

const LevelTypeSchema = z.union([
  z.literal("Fresher"),
  z.literal("Junior"),
  z.literal("Senior"),
]);

type LevelType = z.infer<typeof LevelTypeSchema>;

const dateSchema = z.object({
  t: z.coerce.date(),
});
type dateType = z.infer<typeof dateSchema>;

export type RegisterFields = {
  first_name: string;
  middle_name?: string;
  last_name: string;
  phone_number: string;
  email: string;
  emp_id: string;
  level: LevelType;
  job_title: string;
  start_date: dateType;
};

export const registerSchema: ZodType<RegisterFields> = z.object({
  first_name: z.string().min(5, "First Name should be at least 5 letters"),
  middle_name: z.string().optional(),
  last_name: z.string(),
  email: z.string().email("Invalid email address"),
  phone_number: z
    .string()
    .min(10, { message: "Phone Number Should be a minimum of 10 digits" })
    .max(15, { message: "Phone Number Should be a maximum of 15 digits" })
    .refine((val) => val.startsWith("+"), {
      message: "Phone Number should start with '+'",
    }),
  emp_id: z.string(),
  level: LevelTypeSchema,
  job_title: z.string().min(1, { message: "Job Title should be mentioned" }),
  start_date: dateSchema,
});
