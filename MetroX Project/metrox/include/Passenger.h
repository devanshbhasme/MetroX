#pragma once

#include <string>
using namespace std;

class Passenger {
protected:
    int id;
    string name;
    string email;

public:
    Passenger();
    Passenger(int id, const string& name, const string& email);
    virtual ~Passenger() = default;

    // Getters and Setters
    int getId() const;
    string getName() const;
    string getEmail() const;
    void setName(const string& name);
    void setEmail(const string& email);

    // Virtual methods for polymorphism
    virtual double getDiscount() const; // Default 0.0 (no discount)
    virtual string getPassengerType() const; // "Regular"
    virtual void display() const;
    virtual string serialize() const;
};
