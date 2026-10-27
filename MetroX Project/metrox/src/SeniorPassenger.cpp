#include "../include/SeniorPassenger.h"
#include <iostream>
#include <iomanip>
#include <sstream>
using namespace std;

SeniorPassenger::SeniorPassenger()
    : Passenger(), age(60), seniorCardId("") {}

SeniorPassenger::SeniorPassenger(int id, const string& name, const string& email,
                                 int age, const string& seniorCardId)
    : Passenger(id, name, email), age(age >= 60 ? age : 60), seniorCardId(seniorCardId) {}

int SeniorPassenger::getAge() const {
    return age;
}

string SeniorPassenger::getSeniorCardId() const {
    return seniorCardId;
}

void SeniorPassenger::setAge(int newAge) {
    if (newAge >= 60) {
        age = newAge;
    }
}

void SeniorPassenger::setSeniorCardId(const string& cardId) {
    seniorCardId = cardId;
}

double SeniorPassenger::getDiscount() const {
    return 0.30; // 30% discount for seniors
}

string SeniorPassenger::getPassengerType() const {
    return "Senior";
}

void SeniorPassenger::display() const {
    cout << "Passenger ID: " << setw(4) << id
              << " | Type: " << setw(9) << getPassengerType()
              << " | Name: " << setw(20) << left << name
              << " | Email: " << setw(25) << email
              << " | Discount: " << fixed << setprecision(0) << (getDiscount() * 100.0) << "%\n"
              << right;
    cout << "   └── Age: " << age << " yrs (Senior Citizen Card: " << seniorCardId << ")\n";
}

string SeniorPassenger::serialize() const {
    // Format: TYPE|ID|NAME|EMAIL|AGE|SENIOR_CARD
    ostringstream oss;
    oss << "SENIOR|" << id << "|" << name << "|" << email << "|" << age << "|" << seniorCardId;
    return oss.str();
}
