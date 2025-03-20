"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { addToCart } from "@/lib/actions/cart/addToCart.action";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";

interface AddToCartButtonProps {
  product: ProductDetails["product"];
  quantity: number;
  count: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
  formRef: React.RefObject<HTMLFormElement>;
}

type ErrorMessage = string | { message: string };

export default function AddToCartButton({
  product,
  quantity,
  count,
  form,
  formRef,
}: AddToCartButtonProps) {
  const t = useTranslations();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (!formRef.current) return;

      const formData = new FormData(formRef.current);
      formData.append("product_id", product?.id.toString());
      formData.append("quantity", quantity.toString());
      formData.append("count", count.toString());

      if (product?.need_design_files) {
        const files = form.getValues("files");
        if (files && files.length > 0) {
          Array.from(files).forEach((file, index) => {
            if (file instanceof File) {
              formData.append(`designs[${index}]`, file);
            }
          });
        }
      }

      return await addToCart(formData);
    },
    onSuccess: () => {
      toast({
        title: t("AddedSuccessfully"),
        description: t("ProductAdded"),
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error: { message: string }) => {
      let errorMessage: string = t("Unexpected-Error"); // Default error message

      if (error) {
        try {
          // Attempt to parse the error message as JSON
          const parsedError: ErrorMessage = JSON.parse(error.message);
          // If parsing succeeds, use the `message` property if it exists
          if (typeof parsedError === "object" && "message" in parsedError) {
            errorMessage = parsedError.message;
          } else if (typeof parsedError === "string") {
            errorMessage = parsedError;
          }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
          // If parsing fails, fall back to the raw error message
          errorMessage = error.message;
        }
      }


      // Show error toast
      toast({
        title: t("Sending-Error"),
        description: errorMessage, // Ensure this is a string
        variant: "destructive",
      });
    },
  });

  return (
    <Button
      onClick={(e) => {
        e.preventDefault();
        mutate();
      }}
      variant="default"
      className="w-full"
      disabled={isPending}
    >
      {isPending ? <Loader2 className="animate-spin mr-2" /> : ""}
      <img src="/assets/icons/bag-2.svg" alt="icon" /> {t("add-to-cart")}
    </Button>
  );
}