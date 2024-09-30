import { HeroSection } from "@/components/hero-section";
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
      <section id="shop" className="">
        {products.map((product) => (
          <p key={product.id}>{product.name}</p>
        ))}
      </section>
    </div>
  );
}
