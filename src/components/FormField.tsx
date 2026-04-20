import 'css/App.css';

import { Field, Input } from '@chakra-ui/react';
import { useForm } from 'hooks/useForm';

type FormFieldProps<T extends Record<string, any>> = {
  label: string;
  field: keyof T;
  form: ReturnType<typeof useForm<T>>;
  placeholder?: string;
  required?: boolean;
};

export default function FormField<T extends Record<string, any>>({
  label,
  field,
  form,
  placeholder,
  required,
}: FormFieldProps<T>) {
  return (
    <Field.Root invalid={form.isInvalid(field)} required={!!required}>
      <Field.Label>
        {label}
        {!!required && <Field.RequiredIndicator />}
      </Field.Label>
      <Input
        placeholder={placeholder}
        value={form.values[field]}
        onChange={(e) => {
          form.setValue(field, e.currentTarget.value as T[typeof field]);
        }}
        onBlur={() => form.touch(field)}
      />
      <Field.ErrorText>{form.getError(field)}</Field.ErrorText>
    </Field.Root>
  );
}
