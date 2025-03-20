"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller, useForm } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { ProductDetailsAction } from "@/lib/actions/product-details.action";
import { WishlistButton } from "./_components/WishlistButton";
import MaterialDialog from "../material-dailog";
import AddToCartButton from "./_components/AddToCartButton";
import { useTranslations } from "next-intl";

interface ContactFormProps {
  product: ProductDetails["product"];
}

const ContactForm = ({ product }: ContactFormProps) => {

  const t = useTranslations()
  const { toast } = useToast();
  const ref = useRef<HTMLFormElement>(null);

  // Mutation
  const { mutate } = useMutation({
    mutationFn: (values: FormData) => {
      return ProductDetailsAction(values);
    },
  });

  const form = useForm();

  const [isCustomQuantityChecked, setIsCustomQuantityChecked] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [quantity, setQuantity] = useState(1); // حالة لتخزين الكمية
  const [count, setCount] = useState(1); // حالة جديدة لـ count

  const [totalPrice, setTotalPrice] = useState(product?.price); // حالة لتخزين السعر الإجمالي

  const handleQuantityChange = (newQuantity: number) => {
    if (
      newQuantity >= product?.custom_quantity_from &&
      newQuantity <= product?.custom_quantity_to
    ) {
      setQuantity(newQuantity);
      form.setValue("quantity", newQuantity); // Ensure that `count` is updated
      // setTotalPrice(newQuantity);
    }
  };

  const handleCountChange = (newCount: number) => {
    if (
      newCount >= product?.custom_quantity_from &&
      newCount <= product?.custom_quantity_to
    ) {
      // form.setValue("count", newQuantity); // Ensure that `count` is updated
      // setTotalPrice(newQuantity);
      setCount(newCount); // تحديث count
    }
  };

  const onSubmit = useCallback(async () => {
    if (!ref.current) return;
    const formData = new FormData(ref.current);
    

    formData.append("product_id", product?.id.toString());
    formData.append("quantity", quantity.toString());
    formData.append("count", count.toString());

    // const selectedOptions = product?.attributes
    //   ?.map((attr) => {
    //     const selectedOptionIds = form
    //       .getValues(attr.title)
    //       ?.map((optionId: string) => optionId);
    //       

    //     if (selectedOptionIds?.length) {
    //       return { attributeId: attr.id, selectedOptionIds };
    //     }
    //   })
    //   .filter(Boolean);

    const selectedOptions = product?.attributes?.flatMap((attr) => {
      const selectedOptionId = form.getValues(attr.title); // احصل على الـ ID المختار لكل `attribute`

      

      if (selectedOptionId) {
        return Array.isArray(selectedOptionId)
          ? selectedOptionId
          : [selectedOptionId];
      }
      return [];
    });

   

    // ✅ تأكد أن `selectedOptions` تحتوي فقط على الأرقام المطلوبة
    if (selectedOptions && selectedOptions.length > 0) {
      selectedOptions.forEach((optionId, index) => {
        formData.append(`options_selected[${index}]`, optionId.toString());
      });
    }

    // **إضافة الملفات في حالة الحاجة إليها**
    if (product?.need_design_files) {
      const files = form.getValues("files");
      if (files && files.length > 0) {
        Array.from(files).forEach((file, index) => {
          if (file instanceof File) {
            formData.append(`files[${index}]`, file);
            // formData.append(`files[${index}]`, file);
          }
        });
      }
    }
  

    mutate(formData, {
      onSuccess: (data) => {
      

        setTotalPrice(data?.data); // تحديث السعر عند نجاح الطلب
      },
      onError: (error) => {
        toast({
          title: t("Sending-Error") ,
          description: error.message || t("Unexpected-Error"),
          variant: "destructive",
        });
      },
    });
  }, [product?.id, product?.attributes, product?.need_design_files, quantity, count, mutate, form, toast, t]);

  // تنفيذ `onSubmit` عند تغيير `quantity`
  useEffect(() => {
    if (quantity !== undefined) {
      const delay = setTimeout(() => {
        onSubmit();
      }, 500);

      return () => clearTimeout(delay);
    }
  }, [quantity, onSubmit]);

  return (
    <>
      <div>
        <div className="col-span-full mb-3">
          <div className="flex items-center">
            <h2 className="py-[16px] h2_section"> {product?.title}</h2>
          </div>
          <div className="block md:flex gap-x-[15px] items-center">
            <p className="md:text-[2rem] text-[1.2rem] font-bold text-normal">
              {totalPrice} {t("Saudi-Riyal")}
            </p>
            {/* <p className="md:text-[1.5rem] text-[1rem] font-bold text-text-placeholder line-through py-[6px] md:py-0">
              120 {t("Saudi-Riyal")}
            </p> */}
            {/* <div className="py-[3.077px] px-[10.258px] flex items-center justify-center bg-accent-danger-light rounded-[30.774px] w-fit">
              <span className="text-[1rem] font-normal text-accent-danger">
                64% خصم
              </span>
            </div> */}
          </div>
          <div className="p_section py-[30px]">
            <p
            // dangerouslySetInnerHTML={{
            //   __html: product?.description,
            // }}
            >
              {" "}
              {product?.description}{" "}
            </p>
          </div>
        </div>

        <Form {...form}>
          <h2 className="text-[20px] font-bold text-text-main mb-[24px]">
            { t("Specifications") }
          </h2>
          <form onSubmit={form.handleSubmit(onSubmit)} ref={ref}>
            <div className="flex flex-col gap-y-[20px]">
              {/* loop through attributes and show required ones */}
              {!product.attributes.some(
                (attr) => attr.view_type === "text with image"
              ) &&
                product.attributes?.map((attr) =>
                  attr.type === "required" ? (
                    <div key={attr.id} className="flex flex-col gap-y-2">
                      <Label>{attr.title}</Label>
                      <Controller
                        name={attr.title}
                        control={form.control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            onValueChange={(selectedId) => {
                              field.onChange(selectedId);
                            }}
                          >
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder={`${t("Choose")} ${attr.title}`} />
                            </SelectTrigger>
                            <SelectContent>
                              {attr.options.map((option: AttributeOption) => (
                                <SelectItem
                                  key={option.id}
                                  value={option.id.toString()}
                                >
                                  {option.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  ) : null
                )}

              {product.attributes.some(
                (attr) => attr.view_type === "text with image"
              ) && <MaterialDialog attributes={product.attributes} />}

              {!product.attributes.some(
                (attr) => attr.view_type === "text with image"
              ) &&
                product.attributes?.map((attr) => {
                  return attr.type === "optional" ? (
                    <div key={attr.id} className="flex flex-col gap-y-2">
                      <label className="flex items-center gap-x-2">
                        <Checkbox
                          id="checkbox"
                          checked={isChecked}
                          onCheckedChange={(checked) =>
                            setIsChecked(
                              checked === "indeterminate" ? false : checked
                            )
                          }
                          className="w-5 h-5"
                        />
                        <span>{`${ t("activation") } ${attr.title}`}</span>
                      </label>

                      {isChecked && (
                        <>
                          <Label>{attr.title}</Label>
                          <Controller
                            name={attr.title}
                            control={form.control}
                            render={({ field }) => (
                              <Select
                                {...field}
                                onValueChange={(selectedId) => {
                                  field.onChange(selectedId);
                                }}
                              >
                                <SelectTrigger className="h-12">
                                  <SelectValue
                                    placeholder={`${t("Choose")} ${attr.title}`}
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  {attr.options.map(
                                    (option: AttributeOption) => (
                                      <SelectItem
                                        key={option.id}
                                        value={option.id.toString()}
                                      >
                                        {option.title}
                                      </SelectItem>
                                    )
                                  )}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </>
                      )}
                    </div>
                  ) : null;
                })}

              {/* مخصص الكمية Checkbox */}
              <div className="flex gap-x-[6px] items-center">
                <Checkbox
                  id="customQuantity"
                  checked={isCustomQuantityChecked}
                  onCheckedChange={(checked) =>
                    setIsCustomQuantityChecked(
                      checked === "indeterminate" ? false : checked
                    )
                  }
                  className="w-5 h-5"
                />
                <Label htmlFor="customQuantity">
                  {t("Custom-quantity-between") } ({product?.custom_quantity_from} -{" "}
                  {product?.custom_quantity_to})
                </Label>
              </div>

              <div className="flex flex-col gap-y-[6px]">
                {/* الكمية */}
                {isCustomQuantityChecked ? (
                  <FormField
                    name="quantity"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <Label> { t("Quantity") } </Label>
                        <Input
                          {...field}
                          type="number"
                          min={product?.custom_quantity_from}
                          max={product?.custom_quantity_to}
                          value={quantity} // عرض الكمية الحالية
                          onChange={(e) =>
                            handleQuantityChange(Number(e.target.value))
                          }
                          placeholder={` ${t("Quantity")} ${product?.custom_quantity_from} - ${product?.custom_quantity_to}`}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <div className="flex flex-col gap-y-[6px]">
                    <Label>{ t("Quantity") } </Label>
                    <Select
                      name="quantity"
                      onValueChange={(value) =>
                        handleQuantityChange(Number(value))
                      }
                    >
                      <SelectTrigger className="h-[48px]">
                        <SelectValue placeholder={ t("Quantity") }  />
                      </SelectTrigger>
                      <SelectContent>
                        {product?.quantities?.map((q) => (
                          <SelectItem
                            key={q.id}
                            value={q.quantity.toString()} // تأكد من أن القيمة ستكون string
                          >
                            {q.quantity}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-y-[6px]">
                {product.need_design_files && (
                  <FormField
                    name="files"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        {/* Label */}
                        <Label> { t("Attach-file") } </Label>

                        {/* Input */}
                        <Input
                          type="file"
                          placeholder={ t("Attach-file") } 
                          multiple
                          name={field.name}
                          onChange={(e) => {
                            const files = e.target.files;
                            if (files) {
                              field.onChange(files); // Update form field
                            }
                          }}
                        />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              {/* الأزرار */}
              <div className="block md:flex items-center gap-x-[12px]">
                <AddToCartButton
                  product={product}
                  quantity={quantity}
                  count={count}
                  form={form}
                  formRef={ref} // تمرير النموذج بدلًا من تضمين نموذج داخل زر الإضافة
                />

                <div className="flex items-center pt-6 md:pt-0">
                  <div className="w-full flex items-center justify-between gap-x-[12px]">
                    <WishlistButton product={product} />

                    <div className="flex items-center justify-center p-[9px] border border-text-borders rounded-sm">
                      <Button
                        className="bg-[#F1F4F4] p-[0px] w-[40px] h-[40px] rounded-sm"
                        onClick={() => handleCountChange(count + 1)}
                      >
                        <img src="/assets/icons/plus 1.svg" alt="icon" />
                      </Button>

                      <FormField
                        name="count"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <Label className="sr-only">Count</Label>
                            <Input
                              {...field}
                              value={count} // ربط مع count فقط
                              onChange={(e) =>
                                handleCountChange(Number(e.target.value))
                              }
                              min="1"
                              className="w-[50px] text-center shadow-none border-none"
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        className="bg-[#F1F4F4] p-[0px] w-[40px] h-[40px] rounded-sm"
                        onClick={() => handleCountChange(count - 1)}
                      >
                        <img src="/assets/icons/Minus.svg" alt="icon" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default ContactForm;
