"use client"

import { createUrl, post, setAdminStoredJWT, setStoredJWT } from "../api/apiClients";

export const footerLinks = [
    {
      title: "Make Money",
      links:[
        "Sell on PrimePicks",
        "Sell on PrimePicks Business",
        "Associates Programme",
        "Fullfillment by PrimePicks",
        "Advertise Your Products",
      ]
    },
    {
      title: "Payment Methods",
      links:[
        "PrimePicks Payment Methods",
        "PrimePicks Platinum Mastercard",
        "PrimePicks Money Store",
        "Gift Cards",
        "PrimePicks Currency Convertor"
      ]
    },
    {
      title: "Support",
  
      links:[
        "Tracks Pacakges or View Orders",
        "Delivary Rates & Polices",
        "PrimePicks Premium" ,
        "Returns & Replacements"
      ]
    }
  ];
  
  
export async function adminLogin(password: string, email: string){
  const result = await post(createUrl("/api/auth/adminLogin"), {
    password,
    email
  })
  console.log(email + "    " + password);
  if (!result) {
    return alert("Could not login!");
  }
  setAdminStoredJWT(result.data.addMsg);
  return result.data;
}

export async function userLogin(password: string , email: string) {
  const result = await post(createUrl("/api/auth/login"), {
    password,
    email,
  });

  if (!result) {
    return alert("Could not login!");
  }
  setStoredJWT(result.data.addMsg);
  return result.data;
}
