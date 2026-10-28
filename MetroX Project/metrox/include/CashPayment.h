#pragma once

#include "Payment.h"
using namespace std;

class CashPayment : public Payment {
private:
    double cashTendered;
    double changeAmount;

public:
    CashPayment();
    explicit CashPayment(double cashTendered);

    bool pay(double amount) override;
    string getMethodName() const override;

    double getCashTendered() const;
    double getChangeAmount() const;
    void setCashTendered(double tendered);
};
