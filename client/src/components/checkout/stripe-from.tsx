import React, { useState } from "react";


const StripeFrom = () => {
  const paymentElementOptions = {
    layout: "tabs",
  }
  return <form id="payment-form" onSubmit={handleSubmit}>
    <PaymentElement id="payment-element" options={paymentElementOptions}/>
    <button disabled={isLoading || !stripe || !element} id="submit">
        <span id="button-text">
            {isLoading  ?<div className="spinner" id="spinner"></div> : "Pay Now"}
        </span>
    </button>
    { }
    { message && <div id="payment-message">{message}</div>}
  </form>;
};

export default StripeFrom;
