#include "../include/StudentPassenger.h"
#include <iostream>
#include <iomanip>
#include <sstream>

StudentPassenger::StudentPassenger()
    : Passenger(), collegeName(""), studentCardId("") {}

StudentPassenger::StudentPassenger(int id, const std::string& name, const std::string& email,
                                   const std::string& collegeName, const std::string& studentCardId)
    : Passenger(id, name, email), collegeName(collegeName), studentCardId(studentCardId) {}

std::string StudentPassenger::getCollegeName() const {
    return collegeName;
}

std::string StudentPassenger::getStudentCardId() const {
    return studentCardId;
}

void StudentPassenger::setCollegeName(const std::string& college) {
    collegeName = college;
}

void StudentPassenger::setStudentCardId(const std::string& cardId) {
    studentCardId = cardId;
}

double StudentPassenger::getDiscount() const {
    return 0.20; // 20% discount for students
}

std::string StudentPassenger::getPassengerType() const {
    return "Student";
}

void StudentPassenger::display() const {
    std::cout << "Passenger ID: " << std::setw(4) << id
              << " | Type: " << std::setw(9) << getPassengerType()
              << " | Name: " << std::setw(20) << std::left << name
              << " | Email: " << std::setw(25) << email
              << " | Discount: " << std::fixed << std::setprecision(0) << (getDiscount() * 100.0) << "%\n"
              << std::right;
    std::cout << "   └── College: " << collegeName << " (Student ID Card: " << studentCardId << ")\n";
}

std::string StudentPassenger::serialize() const {
    // Format: TYPE|ID|NAME|EMAIL|COLLEGE|STUDENT_CARD
    std::ostringstream oss;
    oss << "STUDENT|" << id << "|" << name << "|" << email << "|" << collegeName << "|" << studentCardId;
    return oss.str();
}
