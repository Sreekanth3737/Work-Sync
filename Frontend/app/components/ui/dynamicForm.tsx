import React from "react";
import {
  type UseFormReturn,
  type FieldValues,
  type Path,
} from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "./form";
import { Input } from "./input";
import { Textarea } from "./textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Checkbox } from "./checkbox";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import { Button } from "./button";
import { PasswordInput } from "./password-input";
import { INPUT_TYPES, type InputType } from "@/lib/constants";
import { cn } from "@/lib/utils";

export interface FormElement<T extends FieldValues> {
  name: Path<T>;
  label: string;
  type: InputType;
  placeholder?: string;
  options?: { label: string; value: string }[];
  rows?: number;
}

interface DynamicFormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  elements: FormElement<T>[];
  onSubmit: (data: T) => void;
  hideSubmitButton?: boolean;
  isPending?: boolean;
}

export const DynamicForm = <T extends FieldValues>({
  form,
  elements,
  onSubmit,
  hideSubmitButton = false,
  isPending = false,
}: DynamicFormProps<T>) => {
  const renderFormControl = (element: FormElement<T>, field: any) => {
    switch (element.type) {
      case INPUT_TYPES.TEXT:
        return <Input {...field} placeholder={element.placeholder} />;

      case INPUT_TYPES.PASSWORD:
        return <PasswordInput {...field} placeholder={element.placeholder} />;

      case INPUT_TYPES.TEXTAREA:
        return (
          <Textarea
            {...field}
            placeholder={element.placeholder}
            rows={element.rows || 3}
          />
        );

      case INPUT_TYPES.SELECT:
        return (
          <Select
            onValueChange={(value) => field.onChange(value)}
            value={field.value}
          >
            <SelectTrigger>
              <SelectValue placeholder={element.placeholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{element.label}</SelectLabel>
                {element.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        );

      case INPUT_TYPES.CHECKBOX:
        return (
          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
        );

      case INPUT_TYPES.RADIO:
        return (
          <RadioGroup value={field.value} onValueChange={field.onChange}>
            {element.options?.map((option) => (
              <div key={option.value} className="flex items-center">
                <RadioGroupItem value={option.value} />
                <span className="ml-2">{option.label}</span>
              </div>
            ))}
          </RadioGroup>
        );

      case INPUT_TYPES.COLOR_PICKER:
        if (!element.options) {
          return null;
        }
        return (
          <div className="flex gap-3 flex-wrap">
            {element.options.map(({ label, value }) => (
              <div
                onClick={() => field.onChange(value)}
                key={label}
                className={cn(
                  "w-6 h-6 rounded-full cursor-pointer hover:opacity-80 transition-all duration-300",
                  field.value === value && "ring-2 ring-offset-2 ring-blue-500"
                )}
                style={{ backgroundColor: value }}
              ></div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-4 py-4">
        {elements.map((element) => (
          <FormField
            key={element.name}
            name={element.name}
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{element.label}</FormLabel>
                <FormControl>{renderFormControl(element, field)}</FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        {!hideSubmitButton && (
          <Button type="submit" disabled={isPending}>
            {isPending ? "Submitting..." : "Submit"}
          </Button>
        )}
      </div>
    </form>
  );
};
