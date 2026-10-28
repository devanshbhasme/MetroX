#pragma once

#include <string>
using namespace std;

class Payment {
public:
    virtual ~Payment() = default;

    /**
     * @brief Executes a simulated payment.
     * @param amount The total payable amount in currency units.
     * @return true if simulation succeeded, false otherwise.
     */
    virtual bool pay(double amount) = 0;

    /**
     * @brief Returns the human-readable payment method name.
     */
    virtual string getMethodName() const = 0;
};
