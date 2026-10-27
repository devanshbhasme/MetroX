#include "../include/CashPayment.h"
#include <iostream>
#include <iomanip>

CashPayment::CashPayment() : cashTendered(0.0), changeAmount(0.0) {}

CashPayment::CashPayment(double cashTendered)
    : cashTendered(cashTendered), changeAmount(0.0) {}

double CashPayment::getCashTendered() const {
    return cashTendered;
}

double CashPayment::getChangeAmount() const {
    return changeAmount;
}

void CashPayment::setCashTendered(double tendered) {
    cashTendered = tendered;
}

std::string CashPayment::getMethodName() const {
    return "Cash (Ticket Counter / TVM)";
}

bool CashPayment::pay(double amount) {
    std::cout << "\n=========================================\n";
    std::cout << "       [SIMULATION] CASH PAYMENT         \n";
    std::cout << "=========================================\n";
    std::cout << ">> Total Payable Amount: ₹" << std::fixed << std::setprecision(2) << amount << "\n";

    // If cash tendered was not preset, prompt user
    if (cashTendered <= 0.0) {
        std::cout << ">> Enter cash tendered by passenger: ₹";
        if (!(std::cin >> cashTendered)) {
            std::cin.clear();
            std::string dummy;
            std::getline(std::cin, dummy);
            std::cout << "[ERROR] Invalid cash amount entered.\n";
            return false;
        }
    }

    std::cout << ">> Cash Tendered: ₹" << std::fixed << std::setprecision(2) << cashTendered << "\n";

    if (cashTendered < amount) {
        double deficit = amount - cashTendered;
        std::cout << "[ERROR] Insufficient cash provided!\n";
        std::cout << "        Shortfall: ₹" << std::fixed << std::setprecision(2) << deficit << "\n";
        std::cout << "[TRANSACTION FAILED] Payment cancelled due to insufficient funds.\n";
        return false;
    }

    changeAmount = cashTendered - amount;
    std::cout << "[SUCCESS] Payment Accepted.\n";
    std::cout << "-----------------------------------------\n";
    std::cout << "  Amount Billed:      ₹" << std::setw(8) << std::fixed << std::setprecision(2) << amount << "\n";
    std::cout << "  Cash Received:      ₹" << std::setw(8) << cashTendered << "\n";
    std::cout << "  Change Returned:    ₹" << std::setw(8) << changeAmount << "\n";
    std::cout << "-----------------------------------------\n";
    std::cout << "[NOTICE] This is a simulated cash payment.\n";
    std::cout << "=========================================\n\n";
    return true;
}
