#include "../include/CardPayment.h"
#include <iostream>
#include <iomanip>
#include <algorithm>
#include <cctype>
#include <thread>
#include <chrono>
using namespace std;

CardPayment::CardPayment() : cardNumber(""), cardHolder(""), expiry(""), cvv("") {}

CardPayment::CardPayment(const string& cardNumber, const string& cardHolder,
                         const string& expiry, const string& cvv)
    : cardNumber(cardNumber), cardHolder(cardHolder), expiry(expiry), cvv(cvv) {}

string CardPayment::getMethodName() const {
    return "Debit/Credit Card";
}

string CardPayment::getMaskedCardNumber() const {
    string digits;
    for (char c : cardNumber) {
        if (isdigit(static_cast<unsigned char>(c))) digits += c;
    }
    if (digits.length() < 4) return "****";
    string last4 = digits.substr(digits.length() - 4);
    return "****-****-****-" + last4;
}

bool CardPayment::pay(double amount) {
    cout << "\n=========================================\n";
    cout << "       [SIMULATION] CARD PAYMENT         \n";
    cout << "=========================================\n";
    cout << ">> Initiating payment of ₹" << fixed << setprecision(2) << amount << "\n";
    cout << ">> Cardholder: " << (cardHolder.empty() ? "Guest" : cardHolder) << "\n";

    // Clean digits from card number
    string digits;
    for (char c : cardNumber) {
        if (isdigit(static_cast<unsigned char>(c))) digits += c;
    }

    if (digits.length() < 13 || digits.length() > 19) {
        cout << "[ERROR] Invalid Card Number length (" << digits.length() 
                  << " digits). Standard cards must be 13 to 19 digits.\n";
        cout << "[TRANSACTION FAILED] Payment declined.\n";
        return false;
    }

    if (cvv.length() < 3 || cvv.length() > 4) {
        cout << "[ERROR] Invalid CVV code. Must be 3 or 4 digits.\n";
        cout << "[TRANSACTION FAILED] Payment declined.\n";
        return false;
    }

    cout << ">> Card: " << getMaskedCardNumber() << " (Exp: " << expiry << ")\n";
    cout << ">> Contacting simulated card issuer network...\n";
    cout << ">> Simulating 3D Secure OTP verification: [VERIFIED]\n";

    this_thread::sleep_for(chrono::milliseconds(250));

    cout << "[SUCCESS] ₹" << fixed << setprecision(2) << amount 
              << " authorized via Card simulation (Auth Code: TXN" << (rand() % 900000 + 100000) << ")\n";
    cout << "[NOTICE] This is a simulated transaction. No real money was charged.\n";
    cout << "=========================================\n\n";
    return true;
}
