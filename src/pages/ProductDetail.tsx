import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { InquiryDialog } from '@/components/InquiryDialog';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { supabase } from '@/integrations/supabase/client';
import { ShoppingCart, Package } from 'lucide-react';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price_inr: number;
  price_usd: number;
  price_eur: number;
  image_url: string | null;
  stock_quantity: number | null;
  specifications: any;
  slug: string;
  is_sold_out?: boolean; // ✅ added to match ProductCard
}

const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();

  useEffect(() => {
    if (slug) {
      loadProduct();
    }
  }, [slug]);

  const loadProduct = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) console.error('Error loading product:', error);
    if (data) setProduct(data);
  };

  const handleAddToCart = () => {
    if (!product) return;
    if (product.is_sold_out) {
      toast.error('This product is sold out');
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price_inr: product.price_inr,
      price_usd: product.price_usd,
      price_eur: product.price_eur,
      image_url: product.image_url,
    });

    toast.success('Added to cart');
  };

  const handleBuyNow = () => {
    if (!product) return;
    if (product.is_sold_out) {
      toast.error('This product is sold out');
      return;
    }

    setIsDialogOpen(true);
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12 animate-fade-in">
          {/* Product Image */}
          <div className="aspect-square rounded-2xl overflow-hidden bg-secondary/50 shadow-elegant relative">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="h-24 w-24 text-muted-foreground" />
              </div>
            )}

            {/* 🆕 Sold Out Overlay */}
            {product.is_sold_out && (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                <span className="text-3xl font-bold text-destructive">SOLD OUT</span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center animate-slide-up">
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-primary">
                {formatPrice(product.price_inr, product.price_usd, product.price_eur)}
              </span>
            </div>

            {product.description && (
              <p className="text-lg text-muted-foreground mb-6">{product.description}</p>
            )}

            {product.stock_quantity !== null && (
              <p className={`text-sm mb-6 ${product.is_sold_out ? 'text-destructive' : 'text-muted-foreground'}`}>
                {product.is_sold_out
                  ? 'Out of Stock'
                  : `In Stock: ${product.stock_quantity} units`}
              </p>
            )}

            <div className="flex gap-4 mb-8">
              <Button
                size="lg"
                onClick={handleAddToCart}
                className="flex-1 transition-all duration-300 hover:scale-105"
                disabled={product.is_sold_out} // ✅ toggled by is_sold_out
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {product.is_sold_out ? 'Sold Out' : 'Add to Cart'}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleBuyNow}
                className="flex-1"
                disabled={product.is_sold_out} // ✅ toggled by is_sold_out
              >
                {product.is_sold_out ? 'Sold Out' : 'Buy Now'}
              </Button>
            </div>

            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="border-t pt-6">
                <h3 className="text-xl font-semibold mb-4">Specifications</h3>
                <dl className="space-y-2">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex">
                      <dt className="font-medium w-1/3">{key}:</dt>
                      <dd className="text-muted-foreground w-2/3">{String(value)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>
      </div>

      {product && (
        <InquiryDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          productId={product.id}
          productName={product.name}
        />
      )}
    </div>
  );
};

export default ProductDetail;
