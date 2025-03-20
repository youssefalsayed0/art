import Breadcrumbs from "@/components/common/bread-crumb";
import React from "react";
import ContactForm from "./_components/contact-form";
import ImagesProduct from "./_components/images-product";
import { fetchProducts } from "@/lib/apis/products-details";
import { getTranslations } from "next-intl/server";

type PageProps = {
  params: { id: string };
};

const Page = async ({ params: { id } }: PageProps) => {

  const t = await getTranslations()
  const product = await fetchProducts(id);

  
  

  if (!product) {
    return <p>حدث خطأ أثناء جلب بيانات المنتج.</p>;
  }

  const breadcrumbItems = [
    { href: "/", icon: "/assets/icons/home.svg" },
    { label: t("Categories") },
    // { label: t("products") },
    { label: product?.data?.product?.title },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <section className="section">
        <div className="container mx-auto">
          
          {/* <div className="col-span-full mb-12">
            <div className="flex items-center">
              <h2 className="py-[16px] h2_section">
                {" "}
                {product?.data?.product?.title}
              </h2>
            </div>
            <div className="block md:flex gap-x-[15px] items-center">
              <p className="md:text-[2rem] text-[1.2rem] font-bold text-normal">
                {product?.data?.product?.price} ريال سعودي
              </p>
              <p className="md:text-[1.5rem] text-[1rem] font-bold text-text-placeholder line-through py-[6px] md:py-0">
                120 ريال سعودي
              </p>
              <div className="py-[3.077px] px-[10.258px] flex items-center justify-center bg-accent-danger-light rounded-[30.774px] w-fit">
                <span className="text-[1rem] font-normal text-accent-danger">
                  64% خصم
                </span>
              </div>
            </div>
            <div className="p_section py-[30px]">
              <p
                dangerouslySetInnerHTML={{
                  __html: product?.data?.product?.description,
                }}
              />
            </div>
          </div> */}
          <div className=" flex flex-wrap items-end ">
            <div className="w-full md:w-6/12">
              <div className="md:pl-6">
                <div>
                  <ContactForm product={product?.data?.product} />
                </div>
              </div>
            </div>

            <div className="w-full md:w-6/12">
              <ImagesProduct images={product?.data?.product?.image} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Page;
