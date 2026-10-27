#pragma once

#include "Payment.h"
#include <string>

/**
 * @class CardPayment
 * @brief Simulates Credit/Debit Card payments with card number validation and simulated 3D Secure verification.
 * Demonstrates: Polymorphic implementation of Payment interface.
 */
class CardPayment : public Payment {
private:
    std::string cardNumber;
    std::string cardHolder;
    std::string expiry; // MM/YY
    std::string cvv;

public:
    CardPayment();
    CardPayment(const std::string& cardNumber, const std::string& cardHolder,
                const std::string& expiry, const std::string& cvv);

    bool pay(double amount) override;
    std::string getMethodName() const override;

    // Helpers
    std::string getMaskedCardNumber() const;
};
