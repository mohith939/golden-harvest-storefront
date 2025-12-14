# TODO: Fix Razorpay Payment Order Creation Error

- [x] Edit `supabase/functions/create-razorpay-order/index.ts` to round the amount to integer using `Math.round(amount * 100)`
- [x] Fix receipt length issue by using last 8 characters of orderId
- [x] Deploy the updated edge function to Supabase
- [x] Test the checkout process - order creation and Razorpay order creation successful, but api.razorpay.com connection refused (network/firewall issue)
