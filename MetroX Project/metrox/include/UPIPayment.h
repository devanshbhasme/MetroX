#pragma once

#include "Payment.h"
#include <string>

/**
 * @class UPIPayment
 * @brief Simulates Unified Payments Interface (UPI) transactions.
 * Demonstrates: Polymorphic implementation of Payment interface.
 */
class UPIPayment : public Payment {
private:
    std::string upiId;

public:
    UPIPayment();
    explicit UPIPayment(const std::string& upiId);

    bool pay(double amount) override;
    std::string getMethodName() const override;

    std::string getUpiId() const;
    void setUpiId(const std::string& id);
};
