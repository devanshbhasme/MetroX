#pragma once

#include <string>

/**
 * @class Passenger
 * @brief Abstract/Polymorphic Base class representing a metro passenger.
 * Demonstrates: Encapsulation, Inheritance base, Virtual functions, Runtime Polymorphism.
 */
class Passenger {
protected:
    int id;
    std::string name;
    std::string email;

public:
    Passenger();
    Passenger(int id, const std::string& name, const std::string& email);
    virtual ~Passenger() = default;

    // Getters and Setters
    int getId() const;
    std::string getName() const;
    std::string getEmail() const;
    void setName(const std::string& name);
    void setEmail(const std::string& email);

    // Virtual methods for polymorphism
    virtual double getDiscount() const; // Default 0.0 (no discount)
    virtual std::string getPassengerType() const; // "Regular"
    virtual void display() const;
    virtual std::string serialize() const;
};
