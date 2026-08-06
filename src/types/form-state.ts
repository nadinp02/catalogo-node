export type FormState = {
  errors: Partial<Record<string, string[]>>;
};

export const emptyFormState: FormState = { errors: {} };
