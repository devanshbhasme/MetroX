#include "../include/SeniorPassenger.h"
#include <iostream>
#include <iomanip>
#include <sstream>

SeniorPassenger::SeniorPassenger()
    : Passenger(), age(60), seniorCardId("") {}

SeniorPassenger::SeniorPassenger(int id, const std::string& name, const std::string& email,
                                 int age, const std::string& seniorCardId)
    : Passenger(id, name, email), age(age >= 60 ? age : 60), seniorCardId(seniorCardId) {}

int SeniorPassenger::getAge() const {
    return age;
}

std::string SeniorPassenger::getSeniorCardId() const {
    return seniorCardId;
}

void SeniorPassenger::setAge(int newAge) {
    if (newAge >= 60) {
        age = newAge;
    }
}

void SeniorPassenger::setSeniorCardId(const std::string& cardId) {
    seniorCardId = cardId;
}

double SeniorPassenger::getDiscount() const {
    return 0.30; // 30% discount for seniors
}

std::string SeniorPassenger::getPassengerType() const {
    return "Senior";
}

void SeniorPassenger::display() const {
    std::cout << "Passenger ID: " << std::setw(4) << id
              << " | Type: " << std::setw(9) << getPassengerType()
              << " | Name: " << std::setw(20) << std::left << name
              << " | Email: " << std::setw(25) << email
              << " | Discount: " << std::fixed << std::setprecision(0) << (getDiscount() * 100.0) << "%\n"
              << std::right;
    std::cout << "   └── Age: " << age << " yrs (Senior Citizen Card: " << seniorCardId << ")\n";
}

std::string SeniorPassenger::serialize() const {
    // Format: TYPE|ID|NAME|EMAIL|AGE|SENIOR_CARD
    std::ostringstream oss;
    oss << "SENIOR|" << id << "|" << name << "|" << email << "|" << age << "|" << seniorCardId;
    return oss.str();
}
