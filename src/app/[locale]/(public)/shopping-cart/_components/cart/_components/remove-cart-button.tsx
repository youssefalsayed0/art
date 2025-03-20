"use client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { removeCart } from "@/lib/actions/cart/removeCart.action";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";

interface RemoveCartButtonProps {
  cart_id: number;
  onRemove: (id: number) => void;
}

export default function RemoveCartButton({ cart_id, onRemove }: RemoveCartButtonProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: () => removeCart(cart_id),
    onSuccess: () => {
      onRemove(cart_id); // 🔥 تحديث القائمة محليًا بدون Reload
      toast({
        title: "تم الحذف بنجاح",
        description: "تم إزالة المنتج من السلة.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },

    onError: (error) => {
      toast({
        title: "حدث خطأ",
        description: "تعذر إزالة المنتج، حاول مرة أخرى.",
        variant: "destructive",
      });
      console.error("Error removing item:", error);
    },
  });

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => mutate()}
      className="absolute rtl:left-2 ltr:right-2 top-0 cursor-pointer hover:bg-transparent"
    >
      <img src="/assets/icons/close-circle.svg" alt="icon" />
    </Button>
  );
}
