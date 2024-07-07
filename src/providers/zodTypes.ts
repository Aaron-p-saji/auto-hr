import { ZodType, date, z } from "zod";

const JobTypes = z.union([z.literal("Intern"), z.literal("Trainee")]);

export type LoginFields = {
  username: string;
  password: string;
};

export const loginSchema: ZodType<LoginFields> = z.object({
  username: z.string().min(1, "Username should be atleast 1 character"),
  password: z.string().min(4, "Password must be at least 8 characters"),
});
type JobType = z.infer<typeof JobTypes>;

function calculateAge(dateOfBirth: Date): number {
  const today = new Date();
  const dob = new Date(dateOfBirth);
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

export type RegisterFields = {
  full_name: string;
  dob: Date;
  job_title: JobType;
  email: string;
  phone_number: string;
  institute: string;
  nationality: number;
  street_address: string;
  zip: string;
  start_date: Date;
  endDate?: Date;
};

export type UserFields = {
  intern_code: string;
  full_name: string;
  dob: Date;
  job_title: JobType;
  email: string;
  phone_number: string;
  institute: string;
  nationality: number;
  street_address: string;
  zip: string;
  start_date: Date;
  endDate?: Date;
};
export type certificate = {
  id: string;
  filename: string;
  created_date: string;
};

export const registerSchema: ZodType<RegisterFields> = z
  .object({
    full_name: z
      .string()
      .min(5, { message: "Full Name should be at least 5 characters" }),
    dob: z
      .date()
      .refine(
        (value) => {
          // Check if dob is a valid date and age is at least 10
          return !isNaN(value.getTime()) && calculateAge(value) >= 10;
        },
        { message: "User must be at least 10 years old" }
      )
      .transform((value: string | number | Date) => new Date(value)),
    job_title: JobTypes,
    email: z.string().email({ message: "Invalid email address" }),
    phone_number: z
      .string()
      .min(5, { message: "Phone Number should be at least 5 digits" })
      .max(15, { message: "Phone Number should not exceed 15 digits" })
      .refine((val: string) => !val.startsWith("+"), {
        message: "Phone Number shouldn't start with '+'",
      }),
    institute: z.string({
      required_error: "Institution is required",
    }),
    nationality: z.number({
      required_error: "country is required",
    }),
    street_address: z.string({
      required_error: "street is required",
    }),
    zip: z.string({
      required_error: "zip is required",
    }),
    start_date: z.date().refine(
      (value) => {
        return !isNaN(value.getTime());
      },
      { message: "Invalid start date" }
    ),
    endDate: z.date().refine(
      (value) => {
        return !isNaN(value.getTime());
      },
      { message: "Invalid End date" }
    ),
  })
  .refine(
    (data) => {
      const start = data.start_date;
      const end = data.endDate;
      const diffInMs = end.getTime() - start.getTime();
      const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
      return diffInDays >= 7;
    },
    {
      message: "Start and End date should be atleast 7 days apart",
      path: ["endDate"],
    }
  );
