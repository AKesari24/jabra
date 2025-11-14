import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useCart, CartItem } from '@/contexts/CartContext';

interface InquiryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
  productId?: string;
  isCartInquiry?: boolean;
}

export const InquiryDialog = ({ isOpen, onClose, productName, productId, isCartInquiry = false }: InquiryDialogProps) => {
  const { cartItems, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      // Prepare cart items data if this is a cart inquiry
      const cartItemsData = isCartInquiry ? cartItems.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price_inr: item.price_inr,
        price_usd: item.price_usd,
        price_eur: item.price_eur,
      })) : [];

      // Save to database
      const { error: dbError } = await supabase.from('inquiries').insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        product_name: isCartInquiry ? 'Cart Order' : productName,
        product_id: isCartInquiry ? null : productId,
        cart_items: cartItemsData,
      });

      if (dbError) throw dbError;

      // Send email via edge function
      const { error: emailError } = await supabase.functions.invoke('send-inquiry-email', {
        body: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          productName: isCartInquiry ? 'Cart Order' : productName,
          cartItems: cartItemsData,
          isCartInquiry,
          adminEmail: 'admin@jabra.com',
        },
      });

      if (emailError) {
        console.error('Email sending failed:', emailError);
      }

      toast.success(isCartInquiry ? 'Order inquiry sent successfully!' : 'Inquiry sent successfully!');
      if (isCartInquiry) {
        clearCart();
      }
      onClose();
      setFormData({ name: '', email: '', phone: '', company: '' });
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to send inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isCartInquiry ? 'Cart Order Inquiry' : 'Product Inquiry'}</DialogTitle>
          <DialogDescription>
            {isCartInquiry 
              ? 'Fill out the form below to place your order inquiry'
              : `Fill out the form below to inquire about ${productName}`
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isCartInquiry && (
            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="text-sm font-medium mb-2">Cart Items:</p>
              {cartItems.map((item) => (
                <div key={item.id} className="text-sm text-muted-foreground">
                  {item.name} × {item.quantity}
                </div>
              ))}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Your full name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your@email.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone *</Label>
            <Input
              id="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 (555) 000-0000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              placeholder="Your company (optional)"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
