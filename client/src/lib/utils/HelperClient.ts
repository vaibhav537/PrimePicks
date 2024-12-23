"use client";

import {
  createUrl,
  post,
  setAdminStoredJWT,
  setStoredJWT,
} from "../api/apiClients";
import { Toaster, toast } from "react-hot-toast";

export const sortingTypes = [
  { id: 1, name: "Price: Low to High" },
  { id: 2, name: "Price: High to Low" },
  { id: 3, name: "Avg. Customer Review" },
  { id: 4, name: "Newest Arrival" },
];

export const TrustSilderImages = [
  {
    name: "PrimePicks Delivered",
    image: "/trust/delivery.png",
  },
  {
    name: "Top Brand",
    image: "/trust/trophy.png",
  },
  {
    name: "Warranty Policy",
    image: "/trust/shield.png",
  },
  {
    name: "Free Delivery",
    image: "/trust/Free.png",
  },
  {
    name: "7 Days Replacement",
    image: "/trust/Box.png",
  },
];

export const footerLinks = [
  {
    title: "Make Money",
    links: [
      "Sell on PrimePicks",
      "Sell on PrimePicks Business",
      "Associates Programme",
      "Fullfillment by PrimePicks",
      "Advertise Your Products",
    ],
  },
  {
    title: "Payment Methods",
    links: [
      "PrimePicks Payment Methods",
      "PrimePicks Platinum Mastercard",
      "PrimePicks Money Store",
      "Gift Cards",
      "PrimePicks Currency Convertor",
    ],
  },
  {
    title: "Support",

    links: [
      "Tracks Pacakges or View Orders",
      "Delivary Rates & Polices",
      "PrimePicks Premium",
      "Returns & Replacements",
    ],
  },
];

export const publicUrl: string = "/api/public";
export const protectedUrl: string = "/api/protected";
export const clientTokenName: string = "accessToken";

export async function adminLogin(password: string, email: string) {
  const result = await post(createUrl(publicUrl + "/adminLogin"), {
    password,
    email,
  });
  if (!result) {
    return alert("Could not login!");
  }
  setAdminStoredJWT(result.data.addMsg);
  return result.data;
}

export async function userLogin(password: string, email: string) {
  const result = await post(createUrl(publicUrl + "/login"), {
    password,
    email,
  });

  if (!result) {
    return alert("Could not login!");
  }
  setStoredJWT(result.data.addMsg);
  return result.data;
}

export class Helper {
  public tokenName: string = "adminToken";
  public showErrorMessage = (message: string) => {
    toast.dismiss();
    toast.error(message, {
      style: {
        background: "#f2f2f2",
        color: "red",
        fontWeight: "bold",
      },
      position: "bottom-right",
    });
  };
  public showSuccessMessage = (message: string) => {
    toast.dismiss();
    toast.success(message, {
      style: {
        background: "#f2f2f2",
        color: "green",
        fontWeight: "bold",
      },
      position: "bottom-right",
    });
  };

  public showInfoMessage = (message: string) => {
    toast.dismiss();
    toast(message, {
      style: {
        border: "1px solid #602025",
        padding: "16px",
        color: "#da5922",
      },
      position: "bottom-right",
    });
  };

  public getRandomDateInNext7Days(): string {
    const currentDate: Date = new Date();
    const next7Days: Date = new Date(currentDate);
    next7Days.setDate(currentDate.getDate() + 7);

    const randomDate: Date = new Date(
      currentDate.getTime() +
        Math.random() * (next7Days.getTime() - currentDate.getTime())
    );

    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
    };

    const formattedDate: string = randomDate.toLocaleDateString(
      "en-US",
      options
    );

    return formattedDate;
  }
}
