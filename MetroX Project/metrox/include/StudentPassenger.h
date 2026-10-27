#pragma once

#include "Passenger.h"
#include <string>

/**
 * @class StudentPassenger
 * @brief Represents a student passenger eligible for student concessions.
 * Demonstrates: Inheritance, Overriding virtual functions, Polymorphism.
 */
class StudentPassenger : public Passenger {
private:
    std::string collegeName;
    std::string studentCardId;

public:
    StudentPassenger();
    StudentPassenger(int id, const std::string& name, const std::string& email,
                     const std::string& collegeName, const std::string& studentCardId);

    // Getters and Setters
    std::string getCollegeName() const;
    std::string getStudentCardId() const;
    void setCollegeName(const std::string& college);
    void setStudentCardId(const std::string& cardId);

    // Overridden methods
    double getDiscount() const override; // 20% discount
    std::string getPassengerType() const override;
    void display() const override;
    std::string serialize() const override;
};
