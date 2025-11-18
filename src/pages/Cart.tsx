import { useState } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { InquiryDialog } from '@/components/InquiryDialog';
import { useCart } from '@/contexts/CartContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { Trash2, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getTotalItems } = useCart();
  const { formatPrice, currency } = useCurrency();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getTotal = () => {
    return cartItems.reduce((sum, item) => {
      const price = currency === 'INR' ? item.price_inr : currency === 'USD' ? item.price_usd : item.price_eur;
      return sum + (price * item.quantity);
    }, 0);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-8">Add some products to get started!</p>
          <Link to="/products">
            <Button size="lg">Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 animate-fade-in">Shopping Cart ({getTotalItems()} items)</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-6 bg-card rounded-lg shadow-soft hover:shadow-elegant transition-shadow animate-slide-up"
              >
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-secondary/50 flex-shrink-0">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-muted-foreground text-xs">No image</span>
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                  <p className="text-primary font-bold mb-4">
                    {formatPrice(item.price_inr, item.price_usd, item.price_eur)}
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 border rounded-lg">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(item.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-bold text-lg">
                    {currency === 'INR' 
                      ? `₹${(item.price_inr * item.quantity).toFixed(2)}`
                      : currency === 'USD'
                      ? `$${(item.price_usd * item.quantity).toFixed(2)}`
                      : `€${(item.price_eur * item.quantity).toFixed(2)}`
                    }
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card p-6 rounded-lg shadow-soft sticky top-24 animate-scale-in">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">
                    {currency === 'INR' ? `₹${getTotal().toFixed(2)}` : currency === 'USD' ? `$${getTotal().toFixed(2)}` : `€${getTotal().toFixed(2)}`}
                  </span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total(excluding taxes)</span>
                    <span className="text-primary">
                      {currency === 'INR' ? `₹${getTotal().toFixed(2)}` : currency === 'USD' ? `$${getTotal().toFixed(2)}` : `€${getTotal().toFixed(2)}`}
                    </span>
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => setIsDialogOpen(true)}
                className="w-full mb-3"
                size="lg"
              >
                Send Inquiry
              </Button>

              <Link to="/products">
                <Button variant="outline" className="w-full mb-3">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <InquiryDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        isCartInquiry={true}
      />
    </div>
  );
};

export default Cart;
