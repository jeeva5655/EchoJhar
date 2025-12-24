const Razorpay = require('razorpay');
const crypto = require('crypto');

/**
 * Payment Service - Core Revenue Engine
 * 
 * Business Features:
 * - Multiple payment methods
 * - Webhook verification
 * - Refund handling
 * - Revenue tracking
 */
class PaymentService {
    constructor() {
        // Initialize Razorpay (Primary for India)
        this.razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
    }

    /**
     * BUSINESS LOGIC: Create payment order
     * @param {Object} params - {amount, currency, receipt, notes}
     * @returns {Object} Payment order
     */
    async createOrder({ amount, currency = 'INR', receipt, notes = {} }) {
        try {
            const options = {
                amount: Math.round(amount * 100), // Convert to paise
                currency,
                receipt,
                notes: {
                    ...notes,
                    platform: 'EchoJhar',
                    createdAt: new Date().toISOString()
                }
            };

            const order = await this.razorpay.orders.create(options);

            // LOG: Revenue opportunity created
            console.log(`💰 Payment order created: ₹${amount} | Order ID: ${order.id}`);

            return {
                success: true,
                orderId: order.id,
                amount: order.amount / 100,
                currency: order.currency,
                receipt: order.receipt
            };
        } catch (error) {
            console.error('Payment order creation failed:', error.message);
            throw new Error(`Payment order creation failed: ${error.message}`);
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
