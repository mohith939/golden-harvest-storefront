// Centralised WhatsApp ordering helpers
export const WHATSAPP_NUMBER = '919502189555'; // 9502189555 with India country code

export const buildWhatsAppUrl = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

/** Opens WhatsApp (app on mobile, WhatsApp Web on desktop) in a new tab. */
export const openWhatsApp = (message: string) => {
  const url = buildWhatsAppUrl(message);
  const win = window.open(url, '_blank', 'noopener,noreferrer');
  if (!win) {
    window.location.href = url;
  }
};

export interface WhatsAppOrderItem {
  name: string;
  variant?: string;
  quantity: number;
  price: number; // unit price
}

export interface WhatsAppOrderDetails {
  orderId?: string;
  customerName: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
  items: WhatsAppOrderItem[];
  subtotal: number;
  shipping?: number;
  total: number;
}

export const buildOrderMessage = (order: WhatsAppOrderDetails) => {
  const lines: string[] = [];
  lines.push('Hello Ghraw Powders, I would like to place an order.');
  lines.push('');
  if (order.orderId) lines.push(`Order ID: ${order.orderId}`);
  lines.push('*Order Details*');
  order.items.forEach((item, idx) => {
    const label = item.variant ? `${item.name} (${item.variant})` : item.name;
    lines.push(
      `${idx + 1}. ${label} — Qty: ${item.quantity} × ₹${item.price} = ₹${item.price * item.quantity}`
    );
  });
  lines.push('');
  lines.push(`Subtotal: ₹${Math.round(order.subtotal)}`);
  if (typeof order.shipping === 'number') lines.push(`Shipping: ₹${Math.round(order.shipping)}`);
  lines.push(`Total: ₹${Math.round(order.total)}`);
  lines.push('');
  lines.push('*Customer Details*');
  lines.push(`Name: ${order.customerName}`);
  if (order.phone) lines.push(`Phone: ${order.phone}`);
  if (order.email) lines.push(`Email: ${order.email}`);
  if (order.address) lines.push(`Address: ${order.address}`);
  if (order.notes) lines.push(`Notes: ${order.notes}`);
  return lines.join('\n');
};
