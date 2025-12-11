import React from 'react';
import ProductDetails from './ProductDetails';

const ProductPage = async ({ params, searchParams }) => {
  const slug = params?.slug;
  const color = searchParams?.color;
  const size = searchParams?.size;

  if (!slug) return <div>Invalid Product</div>;

  let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/details/${slug}`;
  if (color && size) url += `?color=${color}&size=${size}`;

  try {
    const res = await fetch(url, { cache: "no-store" });

    // Backend 404/500 safe handling
    if (!res.ok) {
      const errorData = await res.text();
      console.error("Backend error response:", errorData);
      return (
        <div className="flex justify-center items-center py-10">
          <h1 className="text-4xl font-semibold">Product Not Found or Server Error</h1>
        </div>
      );
    }

    const getProduct = await res.json();

    if (!getProduct.success || !getProduct.data) {
      return (
        <div className="flex justify-center items-center py-10">
          <h1 className="text-4xl font-semibold">Data Not Found</h1>
        </div>
      );
    }

    return (
      <ProductDetails
        product={getProduct.data.product}
        variant={getProduct.data.variant}
        colors={getProduct.data.colors}
        sizes={getProduct.data.sizes}
        reviewCount={getProduct.data.reviewCount}
      />
    );
  } catch (err) {
    console.error("Fetch error:", err);
    return (
      <div className="flex justify-center items-center py-10">
        <h1 className="text-4xl font-semibold">Server Error. Please try again later.</h1>
      </div>
    );
  }
};

export default ProductPage;
