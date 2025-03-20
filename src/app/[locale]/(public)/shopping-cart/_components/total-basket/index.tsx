"use client"
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import React from "react";

interface TotalBasketProps {
  sub_total: string;
  discount: number;
  total: string;
}

const TotalBasket = ({ sub_total, discount, total }: TotalBasketProps) => {

  const t = useTranslations()

  return (
    <div className="px-[20px] py-[16px] border border-text-borders rounded-sm  ">
      <h2 className="text-[18px] font-bold text-text-main"> {t("Shopping-cart")} </h2>

      <div className="flex flex-col gap-y-[14px]">
        <div className="flex justify-between items-center py-[12px] border-b border-text-borders">
          <span className="text-[16px] font-normal text-text-sub">
            { t("Subtotal") }
          </span>
          <span className="text-[14px] font-normal text-text-main">
            {sub_total} { t("Saudi-Riyal") }
          </span>
        </div>
        <div className="flex justify-between items-center py-[12px] border-b border-text-borders">
          <span className="text-[16px] font-normal text-text-sub"> { t("opponent") } </span>
          <span className="text-[14px] font-normal text-accent-danger">
            -{discount} { t("Saudi-Riyal") }
          </span>
        </div>
        <div className="flex justify-between items-center py-[12px] border-b border-text-borders">
          <span className="text-[16px] font-normal text-text-sub"> { t("total") } </span>
          <span className="text-[16px] font-bold text-text-main">
            {total} { t("Saudi-Riyal") }
          </span>
        </div>
        <Link href={"/shopping-cart/checkout"} className="w-full" >
          <Button variant={"default"} className="w-full" > {t("ProceedToCheckout")} </Button>
        </Link>
      </div>
    </div>
  );
};

export default TotalBasket;
