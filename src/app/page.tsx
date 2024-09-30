import { HeroSection } from "@/components/hero-section";
import ProductItem from "@/components/ProductItem";
import { Product } from "@prisma/client";

const fetchProducts = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/product/all`,
    { cache: "no-store" }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  const products = await response.json();
  return products as Product[];
};

export default async function Home() {
  const products = await fetchProducts();

  return (
    <div className="w-full min-h-dvh">
      <HeroSection backgroundImg="https://c0.wallpaperflare.com/preview/18/875/686/sale-clothes-shopping-retail.jpg" />
      <section id="shop" className="p-5 my-5">
        <h1 className="text-3xl text-black font-bold">Explore Products</h1>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] w-full h-full gap-3 mt-5">
          {products.map((product) => (
            <ProductItem key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
