const Razorpay = require('razorpay');
const crypto = require('crypto');

/**
 * Payment Service - Razorpay Integration
 * 
 * Business Logic:
 * - Create payment orders
 * - Verify payments
 * - Process refunds
 * - Handle webhooks
 * - Calculate platform revenue
 */
class PaymentService {
    constructor() {
        // BUSINESS LOGIC: Make Razorpay optional for demo/testing
        const hasRazorpayKeys = process.env.RAZORPAY_KEY_ID &&
            process.env.RAZORPAY_KEY_SECRET &&
            process.env.RAZORPAY_KEY_ID !== 'your_razorpay_key_id';

        if (hasRazorpayKeys) {
            this.razorpay = new Razorpay({
                key_id: process.env.RAZORPAY_KEY_ID,
                key_secret: process.env.RAZORPAY_KEY_SECRET
            });
            console.log('✅ Razorpay Payment Gateway Initialized');
        } else {
            this.razorpay = null;
            console.log('⚠️  Razorpay not configured - using demo mode');
            console.log('💡 Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to enable payments');
        }
    }

    /**
     * BUSINESS LOGIC: Create payment order
     * Create payment order
     * @param {Object} orderData - Order details {amount, currency, receipt, notes}
     * @returns {Promise<Object>} Payment order
     */
    async createOrder(orderData) {
        try {
            // Demo mode fallback
            if (!this.razorpay) {
                console.log(`💡 Demo mode: Creating mock order for amount ${orderData.amount}`);
                return {
                    orderId: `demo_order_${Date.now()}`,
                    amount: orderData.amount,
                    currency: orderData.currency || 'INR',
                    receipt: orderData.receipt || `receipt_${Date.now()}`,
                    status: 'created',
                    demoMode: true
                };
            }

            const options = {
                amount: Math.round(orderData.amount * 100), // Convert to paise
                currency: orderData.currency || 'INR',
                receipt: orderData.receipt || `receipt_${Date.now()}`,
                notes: {
                    ...(orderData.notes || {}),
                    platform: 'EchoJhar',
                    createdAt: new Date().toISOString()
                }
            };

            const order = await this.razorpay.orders.create(options);

            // BUSINESS LOGIC: Calculate platform revenue
            const platformFee = this.calculatePlatformFee(orderData.amount);

            console.log(`💰 Payment order created: ${order.id} | Amount: ₹${orderData.amount} | Fee: ₹${platformFee}`);

            return {
                orderId: order.id,
                amount: order.amount / 100,
                currency: order.currency,
                receipt: order.receipt,
                status: order.status
            };
        } catch (error) {
            console.error('Payment order creation error:', error.message);
            throw new Error('Failed to create payment order');
        }
    }

    /**
     * BUSINESS LOGIC: Verify payment signature
     * Security: Prevents payment fraud
     */
    verifyPayment({ orderId, paymentId, signature }) {
        try {
            const generatedSignature = crypto
                .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
                .update(`${orderId}|${paymentId}`)
                .digest('hex');

            const isValid = generatedSignature === signature;

            if (isValid) {
                console.log(`✅ Payment verified: ${paymentId}`);
            } else {
                console.warn(`⚠️  Payment verification failed: ${paymentId}`);
            }

            return isValid;
        } catch (error) {
            console.error('Payment verification error:', error.message);
            return false;
        }
    }

    /**
     * BUSINESS LOGIC: Process refund
     * @param {String} paymentId - Razorpay payment ID
     * @param {Number} amount - Amount to refund (in rupees)
     * @param {Object} notes - Refund metadata
     */
    async processRefund(paymentId, amount, notes = {}) {
        try {
            const refund = await this.razorpay.payments.refund(paymentId, {
                amount: Math.round(amount * 100), // Convert to paise
                notes: {
                    ...notes,
                    processedAt: new Date().toISOString()
                }
            });

            console.log(`💸 Refund processed: ₹${amount} | Refund ID: ${refund.id}`);

            return {
                success: true,
                refundId: refund.id,
                amount: refund.amount / 100,
                status: refund.status
            };
        } catch (error) {
            console.error('Refund processing failed:', error.message);
            throw new Error(`Refund failed: ${error.message}`);
        }
    }

    /**
      * BUSINESS LOGIC: Fetch payment details
      */
    async getPaymentDetails(paymentId) {
        try {
            const payment = await this.razorpay.payments.fetch(paymentId);
            return {
                success: true,
                payment: {
                    id: payment.id,
                    amount: payment.amount / 100,
                    currency: payment.currency,
                    status: payment.status,
                    method: payment.method,
                    email: payment.email,
                    contact: payment.contact,
                    createdAt: new Date(payment.created_at * 1000)
                }
            };
        } catch (error) {
            console.error('Payment fetch failed:', error.message);
            throw new Error(`Could not fetch payment: ${error.message}`);
        }
    }

    /**
     * BUSINESS LOGIC: Verify webhook signature
     * Security: Ensure webhook is from Razorpay
     */
    verifyWebhookSignature(requestBody, signature) {
        try {
            const expectedSignature = crypto
                .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
                .update(requestBody)
                .digest('hex');

            return expectedSignature === signature;
        } catch (error) {
            console.error('Webhook verification error:', error.message);
            return false;
        }
    }

    /**
     * BUSINESS METRIC: Calculate platform revenue
     */
    calculatePlatformRevenue(amount, feePercent = 0.05) {
        const platformFee = amount * feePercent;
        const vendorPayout = amount - platformFee;

        return {
            totalAmount: amount,
            platformFee,
            vendorPayout,
            feePercent
        };
    }

    /**
     * BUSINESS LOGIC: Create transfer to vendor
     * (Marketplace payout system)
     */
    async createTransfer(accountId, amount, currency = 'INR', notes = {}) {
        try {
            // Note: Requires Razorpay Route (additional setup)
            // For MVP, we'll track manually and process via dashboard

            console.log(`📤 Transfer scheduled: ₹${amount} to ${accountId}`);

            return {
                success: true,
                transferId: `transfer_${Date.now()}`,
                amount,
                currency,
                status: 'processing',
                note: 'Transfer will be processed within 2-3 business days'
            };
        } catch (error) {
            console.error('Transfer creation failed:', error.message);
            throw new Error(`Transfer failed: ${error.message}`);
        }
    }
}

module.exports = new PaymentService();
