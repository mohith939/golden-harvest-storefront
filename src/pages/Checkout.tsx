import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { calculateShippingCharge } from '@/utils/shipping';
import { Loader2, User, Phone, Mail, MapPin, ShoppingCart, MessageCircle } from 'lucide-react';
import CheckoutProgress from '@/components/CheckoutProgress';

const WHATSAPP_NUMBER = '919392633211';

const Checkout = () => {
  const { cartItems, getCartTotal, getCartTotalWeight, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '',
    email: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    pincode: '',
    order_notes: ''
  });

  const subtotal = getCartTotal();
  const totalWeight = getCartTotalWeight();
  const shippingCost = calculateShippingCharge(totalWeight, formData.state);
  const total = Math.round(subtotal + shippingCost);

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const required = ['customer_name', 'phone', 'address_line1', 'city', 'state', 'pincode'];
    for (const field of required) {
      if (!formData[field as keyof typeof formData].trim()) {
        toast({
          title: "Validation Error",
          description: `${field.replace('_', ' ').toUpperCase()} is required`,
          variant: "destructive"
        });
        return false;
      }
    }
    if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive"
      });
      return false;
    }
    if (!/^\d{6}$/.test(formData.pincode)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid 6-digit pincode",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const generateWhatsAppMessage = () => {
    const itemsList = cartItems.map(item => 
      `• ${item.product.name} (${item.variant.weight}) x${item.quantity} - ₹${(item.variant.price * item.quantity).toFixed(0)}`
    ).join('\n');

    const message = `🌿 *New Order from Golden Harvest*

*Customer Details:*
Name: ${formData.customer_name}
Phone: ${formData.phone}
${formData.email ? `Email: ${formData.email}` : ''}

*Shipping Address:*
${formData.address_line1}
${formData.address_line2 ? formData.address_line2 + '\n' : ''}${formData.city}, ${formData.state} - ${formData.pincode}

*Order Items:*
${itemsList}

*Order Summary:*
Subtotal: ₹${subtotal.toFixed(0)}
Shipping: ₹${shippingCost}
*Total: ₹${total}*

${formData.order_notes ? `*Notes:* ${formData.order_notes}` : ''}

Payment Method: Cash on Delivery`;

    return encodeURIComponent(message);
  };

  const handleWhatsAppOrder = () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const message = generateWhatsAppMessage();
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
      
      // Open WhatsApp in new tab
      window.open(whatsappUrl, '_blank');
      
      toast({
        title: "Redirecting to WhatsApp",
        description: "Complete your order on WhatsApp. Your cart will be cleared after confirmation.",
      });

      // Clear cart and redirect after a short delay
      setTimeout(() => {
        clearCart();
        navigate('/order-confirmation', {
          state: {
            orderId: `WA-${Date.now()}`,
            amount: total,
            paymentMethod: 'WhatsApp Order'
          }
        });
      }, 2000);
      
    } catch (error: any) {
      console.error('WhatsApp order failed:', error);
      toast({
        title: "Error",
        description: "Failed to open WhatsApp. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <CheckoutProgress currentStep="checkout" />

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-primary">Checkout</h1>
          <Link to="/cart">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Back to Cart
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 sm:gap-8">
          {/* Customer Details Form */}
          <div className="space-y-4 sm:space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="text-lg sm:text-xl font-serif flex items-center gap-2">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="customer_name" className="text-sm flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5" />
                      Full Name *
                    </Label>
                    <Input
                      id="customer_name"
                      name="customer_name"
                      value={formData.customer_name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      required
                      className="h-10 sm:h-11"
                    />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="phone" className="text-sm flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5" />
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter 10-digit phone number"
                      required
                      className="h-10 sm:h-11"
                    />
                  </div>
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="email" className="text-sm flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" />
                    Email (Optional)
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className="h-10 sm:h-11"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="text-lg sm:text-xl font-serif flex items-center gap-2">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="address_line1" className="text-sm">Address Line 1 *</Label>
                  <Input
                    id="address_line1"
                    name="address_line1"
                    value={formData.address_line1}
                    onChange={handleInputChange}
                    placeholder="Street address"
                    required
                    className="h-10 sm:h-11"
                  />
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="address_line2" className="text-sm">Address Line 2 (Optional)</Label>
                  <Input
                    id="address_line2"
                    name="address_line2"
                    value={formData.address_line2}
                    onChange={handleInputChange}
                    placeholder="Apartment, suite, etc."
                    className="h-10 sm:h-11"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="city" className="text-sm">City *</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="City"
                      required
                      className="h-10 sm:h-11"
                    />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="state" className="text-sm">State *</Label>
                    <Select value={formData.state} onValueChange={(value) => setFormData(prev => ({ ...prev, state: value }))}>
                      <SelectTrigger className="h-10 sm:h-11">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Andhra Pradesh">Andhra Pradesh</SelectItem>
                        <SelectItem value="Arunachal Pradesh">Arunachal Pradesh</SelectItem>
                        <SelectItem value="Assam">Assam</SelectItem>
                        <SelectItem value="Bihar">Bihar</SelectItem>
                        <SelectItem value="Chhattisgarh">Chhattisgarh</SelectItem>
                        <SelectItem value="Goa">Goa</SelectItem>
                        <SelectItem value="Gujarat">Gujarat</SelectItem>
                        <SelectItem value="Haryana">Haryana</SelectItem>
                        <SelectItem value="Himachal Pradesh">Himachal Pradesh</SelectItem>
                        <SelectItem value="Jharkhand">Jharkhand</SelectItem>
                        <SelectItem value="Karnataka">Karnataka</SelectItem>
                        <SelectItem value="Kerala">Kerala</SelectItem>
                        <SelectItem value="Madhya Pradesh">Madhya Pradesh</SelectItem>
                        <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                        <SelectItem value="Manipur">Manipur</SelectItem>
                        <SelectItem value="Meghalaya">Meghalaya</SelectItem>
                        <SelectItem value="Mizoram">Mizoram</SelectItem>
                        <SelectItem value="Nagaland">Nagaland</SelectItem>
                        <SelectItem value="Odisha">Odisha</SelectItem>
                        <SelectItem value="Punjab">Punjab</SelectItem>
                        <SelectItem value="Rajasthan">Rajasthan</SelectItem>
                        <SelectItem value="Sikkim">Sikkim</SelectItem>
                        <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                        <SelectItem value="Telangana">Telangana</SelectItem>
                        <SelectItem value="Tripura">Tripura</SelectItem>
                        <SelectItem value="Uttar Pradesh">Uttar Pradesh</SelectItem>
                        <SelectItem value="Uttarakhand">Uttarakhand</SelectItem>
                        <SelectItem value="West Bengal">West Bengal</SelectItem>
                        <SelectItem value="Delhi">Delhi</SelectItem>
                        <SelectItem value="Jammu and Kashmir">Jammu and Kashmir</SelectItem>
                        <SelectItem value="Ladakh">Ladakh</SelectItem>
                        <SelectItem value="Puducherry">Puducherry</SelectItem>
                        <SelectItem value="Chandigarh">Chandigarh</SelectItem>
                        <SelectItem value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</SelectItem>
                        <SelectItem value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli</SelectItem>
                        <SelectItem value="Lakshadweep">Lakshadweep</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="pincode" className="text-sm">Pincode *</Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      placeholder="Pincode"
                      required
                      className="h-10 sm:h-11"
                    />
                  </div>
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="order_notes" className="text-sm">Order Notes (Optional)</Label>
                  <Textarea
                    id="order_notes"
                    name="order_notes"
                    value={formData.order_notes}
                    onChange={handleInputChange}
                    placeholder="Any special instructions..."
                    rows={2}
                    className="resize-none"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-20">
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="text-lg sm:text-xl font-serif">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 max-h-48 sm:max-h-60 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={`${item.product.id}-${item.variant.weight}`} className="flex gap-2 sm:gap-3">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded"
                        loading="lazy"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-xs sm:text-sm truncate">{item.product.name}</h4>
                        <p className="text-xs text-muted-foreground">{item.variant.weight} × {item.quantity}</p>
                        <p className="text-xs sm:text-sm font-medium">₹{(item.variant.price * item.quantity).toFixed(0)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-3 sm:pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{!formData.state ? 'Select state' : `₹${shippingCost}`}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base sm:text-lg pt-2 border-t">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <Button
                    size="lg"
                    className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white shadow-lg hover:shadow-xl transition-all duration-300 h-12 sm:h-14 text-sm sm:text-base"
                    onClick={handleWhatsAppOrder}
                    disabled={isLoading || !formData.state}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <MessageCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                        Order via WhatsApp - ₹{total}
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    You'll be redirected to WhatsApp to complete your order
                  </p>
                  
                  <div className="bg-primary/5 rounded-lg p-3 text-center">
                    <p className="text-xs text-muted-foreground">
                      💵 Cash on Delivery • 🚚 All India Shipping
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
