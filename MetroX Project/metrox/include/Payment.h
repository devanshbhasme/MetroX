#pragma once

#include <string>

/**
 * @class Payment
 * @brief Abstract Base Class defining the contract for transit fare payments.
 * Demonstrates: Abstraction, Pure Virtual Functions (interface), Virtual Destructor.
 */
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
    virtual std::string getMethodName() const = 0;
};
