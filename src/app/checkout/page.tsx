"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { CartItem, Product } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BiLoaderCircle } from "react-icons/bi";
import { RxCross2 } from "react-icons/rx";

export default function Page() {
  const [cartItems, setCartItems] = useState<
    (CartItem & { product: Product })[]
  >([]);
  const [cartLoading, setCartLoading] = useState<boolean>(false);
  const [checkoutLoading, setCheckoutLoading] = useState<boolean>(false);
  const [couponLoading, setCouponLoading] = useState<boolean>(false);
  const [couponCode, setCouponCode] = useState<string>("");
  const [percentageOff, setPercentageOff] = useState<number>(0);
  const { toast } = useToast();
  const router = useRouter();


  /**
   * Confirms the user's order and places it.
   * @async
   * @function handleConfirmOrder
   * @returns {Promise<void>} - Resolves when the order has been placed successfully or an error has occurred.
   * @throws {Error} - Throws an error if there was a problem placing the order.
   */
  const handleConfirmOrder = async () => {
    try {
      setCheckoutLoading(true);
      const response = await fetch("/api/checkout", {
        method: "POST",
        body: JSON.stringify({ cartItems, couponCode }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.valid) {
          toast({
            description: "Order placed successfully!",
          });
          router.push("/");
        } else {
          toast({
            variant: "destructive",
            description:
              data.message || "Failed to place order. Please try again.",
          });
        }
      } else {
        toast({
          variant: "destructive",
          description: data.error || "Failed to place order. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      toast({
        variant: "destructive",
        description: "An error occurred while placing the order.",
      });
    } finally {
      setCheckoutLoading(false);
    }
  };

  /**
   * Applies a coupon code to the user's cart and updates the discount percentage.
   * @async
   * @function handleApplyCoupon
   * @returns {Promise<void>} - Resolves when the coupon has been applied successfully or an error has occurred.
   * @throws {Error} - Throws an error if there was a problem applying the coupon.
   */
  const handleApplyCoupon = async () => {
    try {
      setCouponLoading(true);
      const response = await fetch("/api/coupon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: couponCode }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.valid) {
          toast({
            description: `Coupon applied successfully! ${data.percentageOff}% off your order.`,
          });
          setPercentageOff(data.percentageOff);
        } else {
          toast({
            variant: "destructive",
            description: data.message,
          });
        }
      } else {
        toast({
          variant: "destructive",
          description:
            data.error || "Failed to apply coupon. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      toast({
        variant: "destructive",
        description: "An error occurred while applying the coupon.",
      });
    } finally {
      setCouponLoading(false);
    }
  };

  /**
   * Fetches the items in the user's cart from the server.
   * @async
   * @function fetchCartItems
   * @returns {Promise<void>} - Resolves when the cart items have been fetched and stored in the component state.
   * @throws {Error} - Throws an error if there was a problem fetching the cart items.
   */
  const fetchCartItems = async () => {
    try {
      setCartLoading(true);
      const response = await fetch("/api/cart/get");
      if (!response.ok) {
        throw new Error("Failed to fetch cart items");
      }
      const cartItems = await response.json();
      setCartItems(cartItems);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    } finally {
      setCartLoading(false);
    }
  };

  /**
   * Removes a product from the user's cart.
   * @async
   * @function handleRemoveFromCart
   * @param {string} productId - The ID of the product to remove from the cart.
   * @returns {Promise<void>} - Resolves when the product has been removed from the cart.
   * @throws {Error} - Throws an error if there was a problem removing the item from the cart.
   */
  const handleRemoveFromCart = async (productId: string) => {
    try {
      setCartLoading(true);
      const response = await fetch("/api/cart/remove", {
        method: "POST",
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        throw new Error("Failed to remove item from cart");
      }

      await fetchCartItems();
    } catch (error) {
      console.error("Error removing item from cart:", error);
    } finally {
      setCartLoading(false);
    }
  };

  // Fetch cart items when the component mounts
  // This ensures that the cart data is loaded and displayed when the user visits the checkout page
  useEffect(() => {
    fetchCartItems();
  }, []);

  return (
    <div className="w-full min-h-dvh p-5 pt-[72px]">
      <div className="__cart_items h-[300px] overflow-y-auto p-3 border w-full">
        <AnimatePresence mode="wait">
          {cartLoading ? (
            <motion.div
              key="loading-cart"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="size-full flex justify-center items-center"
            >
              <BiLoaderCircle className="animate-spin" />
            </motion.div>
          ) : (
            <div key="cart-items" className="flex gap-1.5 flex-col w-full">
              {cartItems.length > 0 ? (
                cartItems.map((item, index) => (
                  <motion.div
                    initial={{
                      opacity: 0,
                      filter: "blur(5px)",
                      scale: 0.95,
                    }}
                    exit={{
                      opacity: 0,
                      filter: "blur(5px)",
                      scale: 0.95,
                    }}
                    animate={{
                      opacity: 1,
                      filter: "blur(0px)",
                      scale: 1,
                    }}
                    transition={{ delay: index * 0.1 }}
                    key={item.id}
                    className="p-3 rounded-md bg-black/5 flex items-center gap-2 h-fit w-full relative group"
                  >
                    <div className="w-16 h-16 overflow-hidden bg-white relative aspect-square shrink-0 p-1 rounded-sm">
                      <Image
                        width={64}
                        height={64}
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm font-medium">{item.product.name}</p>
                      <p className="text-sm text-red-500 font-bold">
                        {item.quantity} x ₹{String(item.product.price)} ={" "}
                        {"₹" +
                          String(item.quantity * Number(item.product.price))}
                      </p>
                    </div>
                    <RxCross2
                      onClick={() => handleRemoveFromCart(item.productId)}
                      size={20}
                      className="absolute opacity-0 group-hover:opacity-100 top-2 right-2 text-gray-500 hover:text-red-500 transition-all cursor-pointer hover:bg-white rounded-full p-1"
                    />
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{
                    opacity: 0,
                    filter: "blur(5px)",
                    scale: 0.95,
                  }}
                  exit={{
                    opacity: 0,
                    filter: "blur(5px)",
                    scale: 0.95,
                  }}
                  animate={{
                    opacity: 1,
                    filter: "blur(0px)",
                    scale: 1,
                  }}
                  className="text-center text-black/60 text-sm flex justify-center items-center"
                >
                  Your cart is empty
                </motion.div>
              )}{" "}
            </div>
          )}
        </AnimatePresence>
      </div>
      <div className="__confirm_container">
        <h2 className="text-2xl font-bold mb-4">Confirm Order</h2>
        {cartItems.length > 0 ? (
          <>
            <div className="mb-4">
              <p className="text-lg font-semibold">Total Amount:</p>
              <p className="text-xl text-red-500 font-bold">
                ₹
                {(
                  cartItems.reduce(
                    (total, item) =>
                      total + item.quantity * Number(item.product.price),
                    0
                  ) *
                  (1 - percentageOff / 100)
                ).toFixed(2)}
              </p>
            </div>
            <div className="mb-4 w-full max-w-[500px] flex gap-1.5 mx-auto">
              <div className="w-full">
                <Input
                  type="text"
                  id="couponCode"
                  name="couponCode"
                  placeholder="Coupon Code (Optional)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
              </div>
              <Button
                onClick={handleApplyCoupon}
                disabled={couponCode.length === 0}
                className="w-full"
                loading={couponLoading}
              >
                Apply Coupon
              </Button>
            </div>
            <Button
              loading={checkoutLoading}
              onClick={handleConfirmOrder}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm Order
            </Button>
          </>
        ) : (
          <p className="text-center text-gray-500">
            Add items to your cart to place an order.
          </p>
        )}
      </div>
    </div>
  );
}
