import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useCart } from '@/contexts/CartContext';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { InquiryDialog } from './InquiryDialog';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  price_inr: number;
  price_usd: number;
  price_eur: number;
  image_url: string | null;
  description: string | null;
  slug: string;
  is_sold_out?: boolean;
}

interface ProductCardProps {
  product: Product;
  onBuyClick: (product: Product) => void;
}

export const ProductCard = ({ product, onBuyClick }: ProductCardProps) => {
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();
  const [showInquiry, setShowInquiry] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
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

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.is_sold_out) {
      toast.error('This product is sold out');
      return;
    }

    setShowInquiry(true);
  };

  return (
    <>
      <Link to={`/product/${product.slug}`}>
        <Card className="group hover-lift overflow-hidden border-0 shadow-soft hover:shadow-elegant transition-all duration-300 bg-gradient-card">
          <div className="aspect-square overflow-hidden bg-secondary/50 relative">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-muted">
                <span className="text-muted-foreground text-sm">No image</span>
              </div>
            )}
            {product.is_sold_out && (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                <span className="text-2xl font-bold text-destructive">SOLD OUT</span>
              </div>
            )}
        </div>
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {product.description}
            </p>
          )}
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-primary">
              {formatPrice(product.price_inr, product.price_usd, product.price_eur)}
            </span>
            <div className="flex gap-2">
              <Button 
                onClick={handleAddToCart}
                size="sm"
                variant="outline"
                disabled={product.is_sold_out}
                className="transition-all duration-300 hover:scale-105"
              >
                Add to Cart
              </Button>
              <Button 
                onClick={handleBuyNow}
                size="sm"
                disabled={product.is_sold_out}
                className="transition-all duration-300 hover:scale-105"
              >
                {product.is_sold_out ? 'Sold Out' : 'Buy Now'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
    <InquiryDialog
      isOpen={showInquiry}
      onClose={() => setShowInquiry(false)}
      productId={product.id}
      productName={product.name}
    />
    </>
  );
};
