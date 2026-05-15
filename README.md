# Kirana

[![React Native](https://img.shields.io/badge/React_Native-2025-61DAFB?style=for-the-badge&logo=react)](https://reactnative.dev/)  
[![Expo](https://img.shields.io/badge/Expo-55-000000?style=for-the-badge&logo=expo)](https://expo.dev/)  
[![TypeScript](https://img.shields.io/badge/TypeScript-Strong-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)  
[![State Management](https://img.shields.io/badge/Zustand-Lightweight-orange?style=for-the-badge)](https://github.com/pmndrs/zustand)  
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

## About the Application

Kirana is a mobile personal finance management application built for Android that helps users record daily income and expenses, while also providing financial recommendations using the Fuzzy Tsukamoto method.

The application is designed to help users:
- Control personal spending
- Manage financial priorities
- Improve saving habits

---

## Features

- Record daily income and expenses
- Transaction categories (food, transport, etc.)
- Automatic financial recommendations using Fuzzy Tsukamoto
- Daily, weekly, and monthly summaries
- User spending pattern analysis
- Transaction reminder notifications
- Lightweight and responsive Android UI

---

## Fuzzy Tsukamoto System Workflow

```mermaid
flowchart TD
A[User Input] --> B[Monthly Income]
A --> C[Monthly Expenses]
A --> D[Remaining Balance]

B --> E[Fuzzification]
C --> E
D --> E

E --> F[IF-THEN Rule Base]
F --> G[Tsukamoto Inference Engine]

G --> H[Defuzzification]
H --> I[Recommendation Output]

I --> J[Frugal Recommendation]
I --> K[Balanced Recommendation]
I --> L[Aggressive Saving Recommendation]
