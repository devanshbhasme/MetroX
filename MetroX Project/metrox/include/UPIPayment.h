#pragma once

#include "Payment.h"
#include <string>
using namespace std;

class UPIPayment : public Payment {
private:
    string upiId;

public:
    UPIPayment();
    explicit UPIPayment(const string& upiId);

    bool pay(double amount) override;
    string getMethodName() const override;

    string getUpiId() const;
    void setUpiId(const string& id);
};
