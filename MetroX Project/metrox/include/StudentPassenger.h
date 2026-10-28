#pragma once

#include "Passenger.h"
#include <string>
using namespace std;

class StudentPassenger : public Passenger {
private:
    string collegeName;
    string studentCardId;

public:
    StudentPassenger();
    StudentPassenger(int id, const string& name, const string& email,
                     const string& collegeName, const string& studentCardId);

    // Getters and Setters
    string getCollegeName() const;
    string getStudentCardId() const;
    void setCollegeName(const string& college);
    void setStudentCardId(const string& cardId);

    // Overridden methods
    double getDiscount() const override; // 20% discount
    string getPassengerType() const override;
    void display() const override;
    string serialize() const override;
};
