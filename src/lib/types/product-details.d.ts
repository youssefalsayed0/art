//  declare type ProductDetails = {
//     product: {
//         id: number;
//         image: string[];
//         title: string;
//         description: string;
//         price: number;
//         custom_quantity_from: number;
//         custom_quantity_to: number;
//         is_wishlist: boolean;
//         quantities: {
//             id: number;
//             quantity: number;
//         }[];
//         need_design_files: boolean;
//         attributes: any[]; // يمكنك تعديله لاحقًا حسب هيكلة `attributes`
//     };
// };


type AttributeOption = {
    id: number;
    title: string;
    price: number;
    image: string;
  };
  
  type Attribute = {
    id: number;
    title: string;
    view_type: string;
    type: "required" | "optional";
    options: AttributeOption[];
  };
  
  type ProductDetails = {
    product: {
      id: number;
      image: string[];
      title: string;
      description: string;
      price: number;
      custom_quantity_from: number;
      custom_quantity_to: number;
      is_wishlist: boolean;
      quantities: {
        id: number;
        quantity: number;
      }[];
      need_design_files: boolean;
      attributes: Attribute[];
    };
  };
  
