import { Layout } from "@/components/layout/Layout";
import { Hero } from "@/components/home/Hero";
import { Categories } from "@/components/home/Categories";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { Reviews } from "@/components/home/Reviews";
import { ComingSoon } from "@/components/home/ComingSoon";
import { FAQ } from "@/components/home/FAQ";
import { Newsletter } from "@/components/home/Newsletter";

const Index = () => {
  return (
    <Layout>
      <Hero />
      <Categories />
      <FeaturedProducts />
      <Reviews />
      <ComingSoon />
      <FAQ />
      <Newsletter />
    </Layout>
  );
};

export default Index;
