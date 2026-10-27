#include "../include/CardPayment.h"
#include <iostream>
#include <iomanip>
#include <algorithm>
#include <cctype>
#include <thread>
#include <chrono>

CardPayment::CardPayment() : cardNumber(""), cardHolder(""), expiry(""), cvv("") {}

CardPayment::CardPayment(const std::string& cardNumber, const std::string& cardHolder,
                         const std::string& expiry, const std::string& cvv)
    : cardNumber(cardNumber), cardHolder(cardHolder), expiry(expiry), cvv(cvv) {}

std::string CardPayment::getMethodName() const {
    return "Debit/Credit Card";
}

std::string CardPayment::getMaskedCardNumber() const {
    std::string digits;
    for (char c : cardNumber) {
        if (std::isdigit(static_cast<unsigned char>(c))) digits += c;
    }
    if (digits.length() < 4) return "****";
    std::string last4 = digits.substr(digits.length() - 4);
    return "****-****-****-" + last4;
}

bool CardPayment::pay(double amount) {
    std::cout << "\n=========================================\n";
    std::cout << "       [SIMULATION] CARD PAYMENT         \n";
    std::cout << "=========================================\n";
    std::cout << ">> Initiating payment of ₹" << std::fixed << std::setprecision(2) << amount << "\n";
    std::cout << ">> Cardholder: " << (cardHolder.empty() ? "Guest" : cardHolder) << "\n";

    // Clean digits from card number
    std::string digits;
    for (char c : cardNumber) {
        if (std::isdigit(static_cast<unsigned char>(c))) digits += c;
    }

    if (digits.length() < 13 || digits.length() > 19) {
        std::cout << "[ERROR] Invalid Card Number length (" << digits.length() 
                  << " digits). Standard cards must be 13 to 19 digits.\n";
        std::cout << "[TRANSACTION FAILED] Payment declined.\n";
        return false;
    }

    if (cvv.length() < 3 || cvv.length() > 4) {
        std::cout << "[ERROR] Invalid CVV code. Must be 3 or 4 digits.\n";
        std::cout << "[TRANSACTION FAILED] Payment declined.\n";
        return false;
    }

    std::cout << ">> Card: " << getMaskedCardNumber() << " (Exp: " << expiry << ")\n";
    std::cout << ">> Contacting simulated card issuer network...\n";
    std::cout << ">> Simulating 3D Secure OTP verification: [VERIFIED]\n";

    std::this_thread::sleep_for(std::chrono::milliseconds(250));

    std::cout << "[SUCCESS] ₹" << std::fixed << std::setprecision(2) << amount 
              << " authorized via Card simulation (Auth Code: TXN" << (rand() % 900000 + 100000) << ")\n";
    std::cout << "[NOTICE] This is a simulated transaction. No real money was charged.\n";
    std::cout << "=========================================\n\n";
    return true;
}
