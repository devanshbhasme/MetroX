#include "../include/UPIPayment.h"
#include <iostream>
#include <iomanip>
#include <thread>
#include <chrono>
using namespace std;

UPIPayment::UPIPayment() : upiId("") {}

UPIPayment::UPIPayment(const string& upiId) : upiId(upiId) {}

string UPIPayment::getUpiId() const {
    return upiId;
}

void UPIPayment::setUpiId(const string& id) {
    upiId = id;
}

string UPIPayment::getMethodName() const {
    return "UPI (Unified Payments Interface)";
}

bool UPIPayment::pay(double amount) {
    cout << "\n=========================================\n";
    cout << "        [SIMULATION] UPI PAYMENT         \n";
    cout << "=========================================\n";
    cout << ">> Initiating payment of ₹" << fixed << setprecision(2) << amount << "\n";
    cout << ">> Beneficiary: MetroX Transit Authority\n";

    if (upiId.empty() || upiId.find('@') == string::npos) {
        cout << "[ERROR] Invalid UPI Virtual Payment Address (VPA): '" << upiId << "'\n";
        cout << "        Expected format: username@bank or mobile@upi\n";
        cout << "[TRANSACTION FAILED] Simulated payment rejected due to invalid VPA.\n";
        return false;
    }

    cout << ">> Resolving VPA: " << upiId << " ... [OK]\n";
    cout << ">> Sending push authorization request to your UPI App...\n";
    cout << ">> Verifying simulated MPIN...\n";
    
    // Quick micro-pause to feel like realistic console interaction
    this_thread::sleep_for(chrono::milliseconds(250));

    cout << "[SUCCESS] ₹" << fixed << setprecision(2) << amount 
              << " debited via UPI simulation (Ref: UPI" << (rand() % 900000 + 100000) << ")\n";
    cout << "[NOTICE] This is a simulated transaction. No real money was debited.\n";
    cout << "=========================================\n\n";
    return true;
}
