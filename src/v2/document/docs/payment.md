# Payment Integration

This document provides the configuration details for integrating Momo and Stripe payment gateways into the e-commerce API. Both payment services can be configured and managed through environment variables and a centralized configuration file (`config.js`).

## Table of Contents

-   [Payment Integration](#payment-integration)
    -   [Table of Contents](#table-of-contents)
    -   [Configuration](#configuration)
        -   [Environment Variables](#environment-variables)
        -   [Payment Configuration (config.js)](#payment-configuration-configjs)
    -   [Stripe Webhook Setup](#stripe-webhook-setup)
        -   [Steps to Set Up the Webhook on Stripe](#steps-to-set-up-the-webhook-on-stripe)
    -   [Turning Off Payment Services](#turning-off-payment-services)
    -   [Active Payment Methods](#active-payment-methods)
        -   [GET `/payments`](#get-payments)
            -   [Example Response](#example-response)
    -   [Momo Request Type](#momo-request-type)

## Configuration

### Environment Variables

To set up the payment services (Momo and Stripe), the following environment variables need to be defined in your `.env` file:

```bash
# Momo Payment Gateway
MOMO_SECRET_KEY=your_momo_secret_key
MOMO_ACCESS_KEY=your_momo_access_key
MOMO_PARTNER_CODE=your_momo_partner_code
MOMO_PAYMENT_URL=your_momo_payment_url

# Stripe Payment Gateway
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLIC_KEY=your_stripe_public_key
```

These variables contain sensitive information such as API keys and should be kept secure.

### Payment Configuration (config.js)

You need to configure the payment services in the `config/config.js` file.

This file allows you to easily enable/disable services and manage key aspects of the payment configuration, such as URLs, order info, and expiration time.

## Stripe Webhook Setup

To handle Stripe payment events, you need to set up a webhook through the Stripe Dashboard. This webhook will listen for events and notify your API about the status of Stripe payments.

### Steps to Set Up the Webhook on Stripe

1. **Go to your Stripe Dashboard:**
    - Log in to your [Stripe account](https://dashboard.stripe.com).
2. **Navigate to Webhooks:**

    - From the left-hand menu, click on **Developers** > **Webhooks**.

3. **Add a New Webhook:**

    - Click the **Add endpoint** button to create a new webhook.

4. **Enter the Webhook URL:**

    - Set the URL to point to your Stripe webhook handler in your application. This should match the `NOTIFY_URL` configured in `config.js`:
        - `https://your-server-url/api/v2/payment/stripe/notify`

5. **Select Events to Listen To:**

-   Choose the events that you want to listen for. For this integration, you should select the following events:
    -   `charge.succeeded` (When a charge has been successfully processed)
    -   `checkout.session.completed` (When the checkout session is completed)
    -   `checkout.session.expired` (When the checkout session expires)
    -   `charge.failed` (When a charge attempt fails)
    -   `charge.expired` (When an authorized charge expires)

6. **Save the Webhook:**

-   Once you've set the URL and selected the events, click **Add endpoint** to create the webhook.

7. **Stripe Secret:**

-   Make sure to store Stripe public and secret keys in your `.env` file:

```bash
STRIPE_SECRET_KEY=
STRIPE_PUBLIC_KEY=
```

## Turning Off Payment Services

To turn off a payment service, simply set the `ACTIVE` field for that service to `false` in the `paymentConfig` object.

For example, to disable the Momo payment service, set:

```javascript
momo: {
    ACTIVE: false,
    // Other configuration fields...
},
```

## Active Payment Methods

You can retrieve the active payment methods configured for your application by using the following endpoint:

### GET `/payments`

This endpoint will return the currently active payment methods based on the `ACTIVE` field in the `paymentConfig` object.

#### Example Response

Example response when Stripe is inactive:

```json
{
    "success": true,
    "paymentMethods": ["Cod", "Momo"]
}
```

## Momo Request Type

You can change Momo request type by setting the `REQUEST_TYPE` field in the `momo` object in the `paymentConfig` object.

Each request type corresponds to a specific Momo payment method. You can check the available request types in [Momo's documentation](https://developers.momo.vn/v3/vi/docs/payment/api/wallet/onetime).

Note that the application is not supporting all Momo request types. The supported request types are (other request types are not tested):

-   `payWithMethod`: Pay with multiple methods (QR code, bank account, credit card).

-   `captureWallet`: Pay with Momo application.
