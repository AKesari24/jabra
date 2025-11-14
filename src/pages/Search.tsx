import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Input } from '@/components/ui/input';
import { ProductCard } from '@/components/ProductCard';
import { InquiryDialog } from '@/components/InquiryDialog';
import { supabase } from '@/integrations/supabase/client';
import { Search as SearchIcon } from 'lucide-react';

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

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (searchQuery.trim()) {
      searchProducts();
    } else {
      setProducts([]);
    }
  }, [searchQuery]);

  const searchProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .ilike('name', `%${searchQuery}%`)
      .limit(20);

    if (data) setProducts(data);
  };

  const handleBuyClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold mb-6 text-center">Search Products</h1>
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search for headphones, headsets, and more..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg"
              autoFocus
            />
          </div>
        </div>

        {searchQuery.trim() && (
          <div>
            <p className="text-muted-foreground mb-6">
              {products.length} result{products.length !== 1 ? 's' : ''} for "{searchQuery}"
            </p>

            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-scale-in">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onBuyClick={handleBuyClick}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No products found for "{searchQuery}"</p>
              </div>
            )}
          </div>
        )}
      </div>

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

export default Search;
