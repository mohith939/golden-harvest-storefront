import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, Truck, Shield, Award, Minus, Plus, MessageCircle } from 'lucide-react';
import { getTadepalliProduct } from '@/data/tadepalliProducts';
import { buildOrderMessage, openWhatsApp } from '@/utils/whatsapp';

const TadepalliProductDetail = () => {
  const { id } = useParams();
  const product = getTadepalliProduct(id);
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-serif font-bold text-primary mb-4">Product not found</h1>
        <Button asChild>
          <Link to="/tadepalli-store">Back to Our Tadepalli Store</Link>
        </Button>
      </div>
    );
  }

  const total = product.price * quantity;

  const handleOrder = () => {
    openWhatsApp(
      buildOrderMessage({
        customerName: customerName.trim() || 'Not provided',
        items: [{ name: product.name, quantity, price: product.price }],
        subtotal: total,
        total,
      })
    );
  };

  return (
    <div className="w-full bg-background">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-20">
          {/* Left Column - Visual */}
          <div className="space-y-6">
            <div className="w-full aspect-square lg:h-[600px] rounded-2xl shadow-2xl bg-warm-beige flex items-center justify-center p-8">
              <span className="text-3xl md:text-4xl font-serif font-bold text-primary text-center">
                {product.name}
              </span>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">{product.name}</h1>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-4xl font-bold text-primary">₹{product.price}/-</span>
              </div>
              <div className="flex flex-wrap gap-3 mb-6">
                <Badge variant="secondary" className="text-sm px-3 py-1">{product.category}</Badge>
                <Badge variant="secondary" className="text-sm px-3 py-1">Tadepalli Store</Badge>
              </div>
              <p className="text-foreground/80 text-xl leading-relaxed">
                Available at our Tadepalli store. Place your order on WhatsApp and our team will confirm
                availability, payment, and pickup or delivery details.
              </p>
            </div>

            {/* Quantity and Order */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <label htmlFor="quantity" className="text-lg font-semibold text-primary">Quantity:</label>
                <div className="flex items-center gap-3 bg-white dark:bg-gray-700 rounded-full px-4 py-2 shadow-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="h-8 w-8 rounded-full hover:bg-primary/10"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-10 text-center font-bold text-lg">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(q => Math.min(10, q + 1))}
                    disabled={quantity >= 10}
                    className="h-8 w-8 rounded-full hover:bg-primary/10"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2 max-w-sm">
                <Label htmlFor="customer_name">Your Name (Optional)</Label>
                <Input
                  id="customer_name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter your name"
                  className="h-11"
                />
              </div>

              <Button
                onClick={handleOrder}
                size="lg"
                className="w-full py-8 text-xl font-semibold shadow-lg hover:shadow-xl transition-shadow"
              >
                <MessageCircle className="mr-2 h-6 w-6" />
                Order on WhatsApp - ₹{total}
              </Button>
            </div>

            {/* Trust Signals */}
            <div className="grid grid-cols-2 gap-4 pt-8 border-t border-border">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <span className="text-sm font-medium text-foreground/80">Lab Tested</span>
              </div>
              <div className="flex items-center gap-3">
                <Truck className="w-6 h-6 text-blue-600" />
                <span className="text-sm font-medium text-foreground/80">Fast Delivery</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-purple-600" />
                <span className="text-sm font-medium text-foreground/80">100% Pure</span>
              </div>
              <div className="flex items-center gap-3">
                <Award className="w-6 h-6 text-orange-600" />
                <span className="text-sm font-medium text-foreground/80">FSSAI Certified</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-16">
          <section className="bg-warm-beige rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-6 drop-shadow-sm">
              About This Product
            </h2>
            <p className="text-foreground/90 leading-relaxed text-lg max-w-4xl">
              {product.name} is part of our Tadepalli store collection, made with carefully selected
              ingredients and prepared naturally. Priced at ₹{product.price}/-.
            </p>
          </section>

          <section className="bg-primary text-primary-foreground rounded-2xl p-8 md:p-12">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Bulk Orders Available</h2>
              <p className="leading-relaxed text-lg mb-8 opacity-90">
                Looking for larger quantities from our Tadepalli store? Get in touch and we will share
                pricing and availability.
              </p>
              <Button asChild size="lg" variant="secondary" className="px-8 py-4 text-lg font-semibold">
                <Link to="/bulk-inquiry">Contact for Bulk Orders</Link>
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TadepalliProductDetail;
