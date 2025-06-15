import React, { useState } from "react";
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
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Button } from "../ui/button";
import { PasswordInput } from "../ui/password-input";
import { INPUT_TYPES, KEY_TYPES, type InputType } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon, ChevronDownIcon, PlusCircle, X } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";

export interface FormElement<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  type: InputType;
  placeholder?: string;
  options?: { label: string; value: string }[];
  rows?: number;
  elementContainerClassName?: string;
  children?: FormElement<T>[];
  subOptionKey?: string;
  subOptions?: { label: string; value: string }[];
}

interface DynamicFormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  elements: FormElement<T>[];
  onSubmit: (data: T) => void;
  hideSubmitButton?: boolean;
  isPending?: boolean;
  containerClassName?: string;
}

export const DynamicForm = <T extends FieldValues>({
  form,
  elements,
  onSubmit,
  hideSubmitButton = false,
  isPending = false,
  containerClassName,
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
            <SelectTrigger className="w-full">
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

      case INPUT_TYPES.GROUP:
        return (
          <div className={element.elementContainerClassName}>
            {element.children?.map((child) => (
              <FormField
                key={child.name}
                name={child.name}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{child.label}</FormLabel>
                    <FormControl>{renderFormControl(child, field)}</FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
        );

      case INPUT_TYPES.DATE:
        return (
          <Popover modal={true}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full  flex items-center justify-between text-left font-normal overflow-hidden text-ellipsis whitespace-nowrap",
                  !field.value && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="size-4 mr-2 shrink-0" />
                <span className="truncate flex-1">
                  {field.value
                    ? format(new Date(field.value), "PPPP")
                    : "Pick a date"}
                </span>
                <ChevronDownIcon className="size-4 ml-2 shrink-0" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={field.value ? new Date(field.value) : undefined}
                onSelect={(date) =>
                  field.onChange(date?.toISOString() || undefined)
                }
              />
            </PopoverContent>
          </Popover>
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
          <div className={element.elementContainerClassName}>
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

      case INPUT_TYPES.TAG:
        const [tagInput, setTagInput] = useState("");
        const predefinedColors = [
          "#A3CEF1", // Light Blue
          "#B9FBC0", // Light Green
          "#FFF3B0", // Light Yellow
          "#FBC4AB", // Light Pink
          "#CDB4DB", // Light Purple
          "#FFD6A5", // Light Orange
        ];

        const getRandomColor = () => {
          return predefinedColors[
            Math.floor(Math.random() * predefinedColors.length)
          ];
        };

        const handleAddTag = (tag: string) => {
          if (
            tag &&
            Array.isArray(field.value) &&
            !field.value.some((t: { tag: string }) => t.tag === tag)
          ) {
            field.onChange([...field.value, { tag, color: getRandomColor() }]);
          }
        };

        const handleRemoveTag = (tag: string) => {
          if (Array.isArray(field.value)) {
            field.onChange(
              field.value.filter((t: { tag: string }) => t.tag !== tag)
            );
          }
        };

        return (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {field.value?.map((t: { tag: string; color: string }) => (
                <span
                  key={t.tag}
                  className="flex items-center gap-1 px-2 py-1 rounded-full text-sm shadow-sm"
                  style={{ backgroundColor: t.color, color: "#333" }}
                >
                  {t.tag}
                  <X
                    aria-label={`Remove tag ${t.tag}`}
                    onClick={() => handleRemoveTag(t.tag)}
                    className="size-4 cursor-pointer text-white hover:text-gray-200"
                    style={{
                      backgroundColor: "rgba(0,0,0,0.4)",
                      borderRadius: "9999px",
                      padding: "2px",
                    }}
                  />
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Input
                className="border border-gray-300 rounded px-2 py-1 w-full text-sm"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder={element.placeholder || "Add tag"}
                onKeyDown={(e) => {
                  if (e.key === KEY_TYPES.ENTER) {
                    e.preventDefault();
                    handleAddTag(tagInput.trim());
                    setTagInput("");
                  }
                }}
              />

              <Button
                type="button"
                onClick={() => {
                  handleAddTag(tagInput.trim());
                  setTagInput("");
                }}
                className="text-sm"
                disabled={tagInput.trim() === ""}
              >
                <PlusCircle className="size-4" /> Add Tag
              </Button>
            </div>
          </div>
        );

      case INPUT_TYPES.MULTISELECT_WITH_OPTIONS:
        const [isOpenPopover, setIsOpenPopover] = useState(false);
        const options = element.options || [];
        const selectedItems = field.value || [];
        const subOptionKey = element.subOptionKey || "subOptionKey";
        console.log(selectedItems, "selectedItemss");
        const handleCheckboxChange = (checked: boolean, option: any) => {
          if (checked) {
            field.onChange([
              ...selectedItems,
              {
                value: option.value,
                [subOptionKey]: element.subOptions?.[0]?.value || "",
              },
            ]);
          } else {
            field.onChange(
              selectedItems.filter((item: any) => item.value !== option.value)
            );
          }
        };

        const handleSubOptionChange = (
          optionValue: string,
          newValue: string
        ) => {
          field.onChange(
            selectedItems.map((item: any) =>
              item.value === optionValue
                ? { ...item, [subOptionKey]: newValue }
                : item
            )
          );
        };

        return (
          <Popover open={isOpenPopover} onOpenChange={setIsOpenPopover}>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className="w-full justify-start text-left font-normal min-h-11"
              >
                {selectedItems.length === 0 ? (
                  <span className="text-muted-foreground">
                    {element.placeholder || "Select Options"}
                  </span>
                ) : selectedItems.length <= 3 ? (
                  selectedItems
                    .map((item: any) => {
                      const matched = options.find(
                        (opt: any) => opt.value === item.value
                      );
                      return matched?.label;
                    })
                    .join(", ")
                ) : (
                  `${selectedItems.length} selected`
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              side="top"
              className="w-full max-w-96 overflow-y-auto"
              align="start"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{element.label}</span>
                <span
                  role="button"
                  aria-label="Close"
                  onClick={() => setIsOpenPopover(!isOpenPopover)}
                  className="cursor-pointer p-1 rounded hover:bg-muted"
                >
                  <X className="size-4" />
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {options.map((option: any) => {
                  const selectedItem = selectedItems.find(
                    (item: any) => item.value === option.value
                  );

                  return (
                    <div
                      key={option.value}
                      className="flex items-center gap-2 p-2 border rounded"
                    >
                      <Checkbox
                        checked={!!selectedItem}
                        onCheckedChange={(checked: boolean) =>
                          handleCheckboxChange(checked, option)
                        }
                        id={`checkbox-${option.value}`}
                      />
                      <span className="truncate flex-1">{option.label}</span>

                      <div className="w-36">
                        {selectedItem && element.subOptions ? (
                          <Select
                            value={selectedItem[subOptionKey]}
                            onValueChange={(newValue) =>
                              handleSubOptionChange(option.value, newValue)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Option" />
                            </SelectTrigger>
                            <SelectContent>
                              {element.subOptions.map((subOption: any) => (
                                <SelectItem
                                  key={subOption.value}
                                  value={subOption.value}
                                >
                                  {subOption.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <div className="h-6"></div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className={containerClassName}>
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
        <div className="flex justify-end mt-4">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Submitting..." : "Submit"}
          </Button>
        </div>
      )}
    </form>
  );
};
