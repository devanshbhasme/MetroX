#pragma once

#include "Passenger.h"
#include <string>
using namespace std;


class SeniorPassenger : public Passenger {
private:
    int age;
    string seniorCardId;

public:
    SeniorPassenger();
    SeniorPassenger(int id, const string& name, const string& email,
                    int age, const string& seniorCardId);

    // Getters and Setters
    int getAge() const;
    string getSeniorCardId() const;
    void setAge(int age);
    void setSeniorCardId(const string& cardId);

    // Overridden methods
    double getDiscount() const override; // 30% discount
    string getPassengerType() const override;
    void display() const override;
    string serialize() const override;
};
