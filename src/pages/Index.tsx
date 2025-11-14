import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { ProductCard } from '@/components/ProductCard';
import { InquiryDialog } from '@/components/InquiryDialog';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  price_inr: number;
  price_usd: number;
  price_eur: number;
  image_url: string | null;
  description: string | null;
  slug: string;
}

const heroSlides = [
  {
    title: 'Premium Audio Solutions',
    subtitle:
      "Experience superior sound quality with Jabra's professional audio equipment.",
    image: '/images/jab.webp',
  },
  {
    title: 'Engineered for Excellence',
    subtitle: 'Crystal-clear sound for work, life, and everything in between.',
    image: '/images/jab2.png',
  },
  {
    title: 'Uncompromising Performance',
    subtitle: 'Delivering precision-engineered sound wherever you go.',
    image: '/images/jab1.png',
  },
];

// ⭐ NEW ARRAY FOR SPECIALIST AUDIO/VIDEO SECTION
const techItems = [
  {
    title: "Crystal-Clear Calls",
    subtitle: "Advanced microphones for every environment",
    img: "https://www.jabra.com/-/media/Images/Frontpage/hearing/home-page-enhance-promo-enhance-select.png?h=480&iar=0&w=720&hash=89F9B0855EE111CA310100FDF50283D7",
  },
  {
    title: "Professional Video",
    subtitle: "AI-powered video conferencing",
    img: "https://www.jabra.com/-/media/Images/Category-Pages/Video-Conferencing-Cameras/2025/Top-Banner/Jabra-PanaCast-40-VBS-Wide-Lifestyle.jpg?h=900&iar=0&w=1920&hash=728D006D96F9C9799E859DEBFF436931",
  },
  {
    title: "Premium Sound",
    subtitle: "Exceptional clarity for music and media",
    img: "https://www.jabra.com/-/media/Images/Category-Pages/Speak2/TopBanner/Jabra-Handsfree-Solution-Hybrid-Meetings.jpg?h=1120&iar=0&w=1400&hash=866043A5B7EA82A0D9769B3420173722",
  },
  {
    title: "Smart Collaboration",
    subtitle: "Tools designed for hybrid work",
    img: "https://www.jabra.com/-/media/Images/Category-Pages/Frontline/jabra-perform-75-with-accessories.png",
  },
];

const Index = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadFeaturedProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(10);

    if (data) setFeaturedProducts(data);
  };

  const handleBuyClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* HERO SLIDER */}
      <section className="relative h-[90vh] overflow-hidden">
        {heroSlides.map((slide, index) => (
          <motion.div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative z-20 flex flex-col items-start justify-center h-full px-8 md:px-20 text-white">
              <motion.h1
                key={slide.title}
                className="text-4xl md:text-6xl font-bold mb-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {slide.title}
              </motion.h1>
              <motion.p
                className="text-lg md:text-xl mb-8 max-w-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                {slide.subtitle}
              </motion.p>
              <Link to="/products">
                <Button
                  size="lg"
                  variant="secondary"
                  className="group transition-all duration-300 hover:scale-105"
                >
                  Explore Products
                  <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </motion.div>
        ))}
      </section>

      {/* EXPLORE OUR AWARD-WINNING PRODUCTS */}
      <section className="py-20 bg-muted/10 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
            Explore our <span className="text-primary">award-winning products</span>
          </h2>

          <div className="relative">
            <div
              id="product-carousel"
              className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 no-scrollbar"
            >
              {[
                {
                  title: 'Video Conferencing',
                  subtitle: 'Complete room systems',
                  img: 'https://www.jabra.com/-/media/Images/Frontpage/dec-2023/categories/conference-cameras.png?h=800&iar=0&w=800&hash=F0E1D3F3901183C6276E8B7644AF7215',
                },
                {
                  title: 'Headsets',
                  subtitle: 'For home and office',
                  img: 'https://www.jabra.com/-/media/Images/Frontpage/dec-2023/categories/headsets2.png?h=1600&iar=0&w=1000&hash=539A81FA84ACB1E9C4FC59423804D08C',
                },
                {
                  title: 'Speakerphones',
                  subtitle: 'The next generation of the Speak Series',
                  img: 'https://www.jabra.com/-/media/Images/Frontpage/dec-2023/categories/speakerphones.png?h=800&iar=0&w=800&hash=6260C4A111F59C348DDC23793B6F2250',
                },
                {
                  title: 'Personal Cameras',
                  subtitle: 'Personal video conferencing solutions',
                  img: 'https://www.jabra.com/_next/image?url=https%3A%2F%2Fassets2.jabra.com%2Fd%2F1%2F6%2Ff%2Fd16f5a08b1a699c7d79ca217f3d82d3c330176e5_Jabra_PanaCast_Meet_Anywhere_plus1s.png&w=1080&q=75',
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className="min-w-[300px] md:min-w-[360px] bg-white rounded-3xl shadow-md overflow-hidden flex-shrink-0 snap-center"
                >
                  <div className="h-56 w-full bg-gray-100">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="object-contain w-full h-full"
                    />
                  </div>
                  <div className="p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.subtitle}</p>
                    </div>
                    <button className="mt-4 ml-auto w-10 h-10 flex items-center justify-center bg-yellow-400 text-black rounded-full hover:scale-110 transition-transform">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Scroll buttons */}
            <button
              onClick={() => {
                const el = document.getElementById('product-carousel');
                el?.scrollBy({ left: -400, behavior: 'smooth' });
              }}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-400/60 hover:bg-gray-500 text-white p-2 rounded-full shadow-md"
            >
              <ChevronRight className="rotate-180 w-5 h-5" />
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('product-carousel');
                el?.scrollBy({ left: 400, behavior: 'smooth' });
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-700 hover:bg-gray-800 text-white p-2 rounded-full shadow-md"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* SPECIALIST AUDIO & VIDEO SECTION */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            className="text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Specialist Audio and Video Technology.
            <br />
            For Work and Life.
          </motion.h2>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ staggerChildren: 0.2, duration: 0.6 }}
          >
            {techItems.map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05, rotate: 1 }}
                className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer transition-all hover:shadow-xl"
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="h-48 w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.subtitle}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Products</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover our latest and most popular audio solutions
            </p>
          </div>

          {featuredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No featured products available yet.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Please contact admin to add products.
              </p>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
            >
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onBuyClick={handleBuyClick}
                />
              ))}
            </motion.div>
          )}

          <div className="text-center mt-12">
            <Link to="/products">
              <Button variant="outline" size="lg">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {selectedProduct && (
        <InquiryDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          productId={selectedProduct.id}
          productName={selectedProduct.name}
        />
      )}
    </div>
  );
};

export default Index;
