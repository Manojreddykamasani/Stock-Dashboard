Stock Market Dashboard
This project is a full-stack web application that serves as a stock market dashboard. The application is built to provide users with a clean interface to view and analyze stock data for a list of major companies.

Technologies Used
Frontend:

Next.js: A React framework for building high-performance and scalable user interfaces.

Tailwind CSS: A utility-first CSS framework used for designing a modern and responsive layout.

Chart.js & React Chart.js 2: Libraries for rendering interactive and customizable stock price charts.

Backend:

Node.js & Express: Used for building a REST API that handles all data requests.

SQLite: A lightweight, file-based database chosen to simplify local development and avoid network configuration issues.

Axios: A library for making HTTP requests to external APIs.

Data Source:

Financial Modeling Prep (FMP) API: A third-party API that provides comprehensive stock data, including historical prices.

Key Features Implemented
Responsive UI: The application features a dark-themed, responsive design that ensures a consistent and professional user experience on both desktop and mobile devices.

Dynamic Data Fetching: The backend uses a hybrid approach to get stock data. It first checks the local SQLite database for cached information, and only if data is not available or is outdated, does it make a request to the FMP API.

Real-time Indicators: The API includes features to calculate and provide key financial metrics for a selected stock:

52-Week High and Low: This feature provides the highest and lowest prices of a stock over the past year.

Simple Moving Average: A popular technical indicator to help identify trends.

AI-based Prediction: A simple machine learning model using linear regression is implemented to forecast the next day's closing price. This demonstrates the ability to use data-driven techniques for predictive analysis.