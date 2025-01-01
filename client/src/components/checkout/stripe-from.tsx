import React, { useEffect, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

export default function CheckoutFrom({
  clientSecret,
}: {
  clientSecret: string;
}) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    if (!stripe) {
      return;
    }
    // const clientSecret = new URLSearchParams(window.location.search).get(
    //   "payment_intent_client_secret"
    // );

    console.log("form cs", { clientSecret });

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      console.log("PaymentIntent", { paymentIntent });
      switch (paymentIntent?.status) {
        case "processing":
          setMessage("Your payment is processing");
          break;
        case "succeeded":
          setMessage("Your payment was successful");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong. Please try again.");
          break;
      }
    });
  }, [stripe, elements]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!stripe || !elements) {
      // STRIPE.JS HAS NOT YET LOADED.
      // MAKE SURE TO DISABLE FORM SUBMISSION UNTIL STRIPE.JS HAS LOADED.
      return;
    }
    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:3000/success",
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(`Payment failed: ${error.message}`);
    } else {
      setMessage(`An unexpected error occurred.`);
    }
    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: "tabs" as const,
  };
  console.log({ message });
  return (
    <div className="flex items-center justify-center h-[80vh] w-full">
      <form id="payment-form" onSubmit={handleSubmit}>
        <PaymentElement id="payment-element" options={paymentElementOptions} />
        <button disabled={isLoading || !stripe || !elements} id="submit" className="border text-lg font-semibold px-5 py-5 border-[#1DBF73] bg-[#1DBF73] text-white rounded-md mt-5 w-full">
          <span id="button-text">
            {isLoading ? (
              <div className="spinner" id="spinner"></div>
            ) : (
              "Pay Now"
            )}
          </span>
        </button>
        {}
        {message && <div id="payment-message">{message}</div>}
      </form>
    </div>
  );
}
