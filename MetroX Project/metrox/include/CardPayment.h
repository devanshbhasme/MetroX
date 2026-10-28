#pragma once

#include "Payment.h"
#include <string>
using namespace std;

class CardPayment : public Payment {
private:
    string cardNumber;
    string cardHolder;
    string expiry; // MM/YY
    string cvv;

public:
    CardPayment();
    CardPayment(const string& cardNumber, const string& cardHolder,
                const string& expiry, const string& cvv);

    bool pay(double amount) override;
    string getMethodName() const override;

    // Helpers
    string getMaskedCardNumber() const;
};
