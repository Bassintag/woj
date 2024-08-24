import { Outlet, ScrollRestoration } from "react-router-dom";
import { CartBanner } from "@/features/cart/components/CartBanner";

export const CartPage = () => {
  return (
    <>
      <div className="mb-16">
        <Outlet />
      </div>
      <CartBanner />
      <ScrollRestoration />
    </>
  );
};

export const element = <CartPage />;
