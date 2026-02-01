import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const navigate = useNavigate();
  const subtotal = getCartTotal();
  const total = subtotal;

  if (cartItems.length === 0) {
    return (
      <div className="w-full py-16">
        <div className="container mx-auto px-4 text-center">
          <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-3xl font-serif font-bold text-primary mb-4 animate-fade-in">Your Cart is Empty</h1>
          <p className="text-foreground/70 mb-8 animate-fade-in-delay">Add some products to get started!</p>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
            <Link to="/shop">Browse Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-8 animate-fade-in">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6 animate-fade-in-delay">
            {cartItems.map((item) => (
              <Card key={`${item.product.id}-${item.variant.weight}`} className="border-0 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 shadow-lg">
                <CardContent className="p-4 sm:p-6 lg:p-8">
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    <Link to={`/product/${item.product.id}`} className="flex gap-4 sm:gap-6 flex-1 min-w-0">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-primary mb-2 break-words">{item.product.name}</h3>
                        <p className="text-sm text-foreground/70 mb-3 bg-primary/10 px-3 py-1 rounded-full inline-block">{item.variant.weight}</p>
                        <p className="text-xl font-bold text-primary">₹{item.variant.price}</p>
                      </div>
                    </Link>

                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between gap-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item.product.id, item.variant.weight)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 rounded-full"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>

                      <div className="flex items-center gap-2 sm:gap-3 bg-white dark:bg-gray-700 rounded-full px-3 sm:px-4 py-2 shadow-md">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => updateQuantity(item.product.id, item.variant.weight, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="h-8 w-8 rounded-full hover:bg-primary/10"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-10 text-center font-bold text-lg">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => updateQuantity(item.product.id, item.variant.weight, item.quantity + 1)}
                          disabled={item.quantity >= item.variant.stock}
                          className="h-8 w-8 rounded-full hover:bg-primary/10"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="w-full min-w-0">
            <Card className="border-border lg:sticky lg:top-20">
              <CardContent className="p-4 sm:p-6">
                <h2 className="text-xl font-serif font-bold text-primary mb-6">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-foreground/80 gap-2">
                    <span className="flex-shrink-0">Subtotal</span>
                    <span className="text-right whitespace-nowrap">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between text-foreground/80 gap-1 sm:gap-2">
                    <span className="flex-shrink-0">Shipping</span>
                    <span className="text-sm sm:text-base sm:text-right break-words">Shipping charges will calculate at checkout</span>
                  </div>
                  <div className="border-t border-border pt-3">
                    <div className="flex justify-between text-lg font-bold text-primary gap-2">
                      <span>Total</span>
                      <span className="text-right whitespace-nowrap">₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90 mb-3"
                  onClick={() => navigate('/checkout')}
                >
                  Proceed to Checkout
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="w-full border-primary text-primary hover:bg-primary/10"
                  asChild
                >
                  <Link to="/shop">Continue Shopping</Link>
                </Button>

                <div className="mt-6 p-4 bg-primary/5 rounded-lg">
                  <p className="text-sm text-foreground/70 text-center">
                    All India Shipping
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
