#pragma once

#include "Passenger.h"
#include <string>

/**
 * @class SeniorPassenger
 * @brief Represents a senior citizen passenger eligible for senior concessions.
 * Demonstrates: Inheritance, Overriding virtual functions, Polymorphism.
 */
class SeniorPassenger : public Passenger {
private:
    int age;
    std::string seniorCardId;

public:
    SeniorPassenger();
    SeniorPassenger(int id, const std::string& name, const std::string& email,
                    int age, const std::string& seniorCardId);

    // Getters and Setters
    int getAge() const;
    std::string getSeniorCardId() const;
    void setAge(int age);
    void setSeniorCardId(const std::string& cardId);

    // Overridden methods
    double getDiscount() const override; // 30% discount
    std::string getPassengerType() const override;
    void display() const override;
    std::string serialize() const override;
};
