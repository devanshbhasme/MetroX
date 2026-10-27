#include "../include/UPIPayment.h"
#include <iostream>
#include <iomanip>
#include <thread>
#include <chrono>

UPIPayment::UPIPayment() : upiId("") {}

UPIPayment::UPIPayment(const std::string& upiId) : upiId(upiId) {}

std::string UPIPayment::getUpiId() const {
    return upiId;
}

void UPIPayment::setUpiId(const std::string& id) {
    upiId = id;
}

std::string UPIPayment::getMethodName() const {
    return "UPI (Unified Payments Interface)";
}

bool UPIPayment::pay(double amount) {
    std::cout << "\n=========================================\n";
    std::cout << "        [SIMULATION] UPI PAYMENT         \n";
    std::cout << "=========================================\n";
    std::cout << ">> Initiating payment of ₹" << std::fixed << std::setprecision(2) << amount << "\n";
    std::cout << ">> Beneficiary: MetroX Transit Authority\n";

    if (upiId.empty() || upiId.find('@') == std::string::npos) {
        std::cout << "[ERROR] Invalid UPI Virtual Payment Address (VPA): '" << upiId << "'\n";
        std::cout << "        Expected format: username@bank or mobile@upi\n";
        std::cout << "[TRANSACTION FAILED] Simulated payment rejected due to invalid VPA.\n";
        return false;
    }

    std::cout << ">> Resolving VPA: " << upiId << " ... [OK]\n";
    std::cout << ">> Sending push authorization request to your UPI App...\n";
    std::cout << ">> Verifying simulated MPIN...\n";
    
    // Quick micro-pause to feel like realistic console interaction
    std::this_thread::sleep_for(std::chrono::milliseconds(250));

    std::cout << "[SUCCESS] ₹" << std::fixed << std::setprecision(2) << amount 
              << " debited via UPI simulation (Ref: UPI" << (rand() % 900000 + 100000) << ")\n";
    std::cout << "[NOTICE] This is a simulated transaction. No real money was debited.\n";
    std::cout << "=========================================\n\n";
    return true;
}
