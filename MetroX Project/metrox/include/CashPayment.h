#pragma once

#include "Payment.h"

/**
 * @class CashPayment
 * @brief Implements physical cash payment simulation and automated change calculation.
 * Demonstrates: Polymorphic implementation of Payment interface.
 */
class CashPayment : public Payment {
private:
    double cashTendered;
    double changeAmount;

public:
    CashPayment();
    explicit CashPayment(double cashTendered);

    bool pay(double amount) override;
    std::string getMethodName() const override;

    double getCashTendered() const;
    double getChangeAmount() const;
    void setCashTendered(double tendered);
};
