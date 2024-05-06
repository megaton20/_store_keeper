-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: May 07, 2024 at 12:51 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `storeManagenent`
--

-- --------------------------------------------------------

--
-- Table structure for table `Category`
--

CREATE TABLE `Category` (
  `CategoryID` int(11) NOT NULL,
  `Category_name` varchar(255) NOT NULL,
  `details` varchar(800) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Category`
--

INSERT INTO `Category` (`CategoryID`, `Category_name`, `details`) VALUES
(1, 'food', 'garri, rice'),
(2, 'Diaries & Eggs', 'Milk,cheese, yogurt, Egg\n'),
(3, 'personal care', 'toiletries, health and beauty'),
(4, 'convenience', 'Tobacco, cigarettes'),
(5, 'Household Essentials', 'cleaning supplies (cleaning sprays, dish soap), Laundry detergent, paper product (paper towels, toilet paper)'),
(6, 'snacks & confectionaries', 'chips, cookies, candy, nuts'),
(7, 'Beverages', 'soft drinks, juice, pure wine'),
(8, 'Alcohol Beverage', 'gin, wine spirits, cream spirits, ginger');

-- --------------------------------------------------------

--
-- Table structure for table `Customers`
--

CREATE TABLE `Customers` (
  `id` int(11) NOT NULL,
  `First_name` varchar(255) NOT NULL,
  `Last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `Phone` int(11) NOT NULL,
  `Address` varchar(50) NOT NULL,
  `created_date` date NOT NULL,
  `Previous_visit` date NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'verified',
  `spending` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Customers`
--

INSERT INTO `Customers` (`id`, `First_name`, `Last_name`, `email`, `Phone`, `Address`, `created_date`, `Previous_visit`, `status`, `spending`) VALUES
(1, 'chinedu', 'emeka', 'adarikumichael@gmail.com', 777666, '9098', '2024-04-22', '2024-04-22', 'verified', 0),
(2, 'chinedu', 'werw', 'adarikumichael@gmail.com', 778909, '9098', '2024-04-22', '2024-04-22', 'verified', 0);

-- --------------------------------------------------------

--
-- Table structure for table `Damaged`
--

CREATE TABLE `Damaged` (
  `id` int(11) NOT NULL,
  `Product_name` varchar(255) NOT NULL,
  `Category_Id` int(11) NOT NULL,
  `Unit_price` int(11) NOT NULL,
  `Supplier_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Discount`
--

CREATE TABLE `Discount` (
  `id` int(11) NOT NULL,
  `Discount_name` varchar(100) NOT NULL,
  `Discount_percentage` int(20) NOT NULL,
  `Start_date` date NOT NULL,
  `End_date` date NOT NULL,
  `Discount_provider` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Discount`
--

INSERT INTO `Discount` (`id`, `Discount_name`, `Discount_percentage`, `Start_date`, `End_date`, `Discount_provider`) VALUES
(1, 'church wwww', 232, '2024-05-08', '2024-05-14', 'church');

-- --------------------------------------------------------

--
-- Table structure for table `Employees`
--

CREATE TABLE `Employees` (
  `id` int(11) NOT NULL,
  `First_name` varchar(255) NOT NULL,
  `Last_name` varchar(255) NOT NULL,
  `Contact_phone` varchar(255) NOT NULL,
  `Position` varchar(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `Gender` varchar(20) NOT NULL,
  `State` varchar(255) NOT NULL,
  `lga` varchar(255) NOT NULL,
  `userRole` varchar(255) NOT NULL,
  `Store` varchar(255) NOT NULL,
  `created_date` date NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Employees`
--

INSERT INTO `Employees` (`id`, `First_name`, `Last_name`, `Contact_phone`, `Position`, `email`, `Gender`, `State`, `lga`, `userRole`, `Store`, `created_date`, `password`) VALUES
(1, 'Michael', 'Adariku', '1234', 'Regional director', 'adarikumichael@gmail.com', '0913232323', 'Adamawa ', 'Demsa', 'super', 'all', '0000-00-00', '1234'),
(3, 'Francis', 'Fidelis', '12342121313', 'manager', 'frr@gmail.com', 'Male', 'Akwa Ibom  ', 'Abak', 'admin', 'fist to fist', '2024-04-23', '1234');

-- --------------------------------------------------------

--
-- Table structure for table `inventory`
--

CREATE TABLE `inventory` (
  `id` int(11) NOT NULL,
  `Product_name` varchar(255) NOT NULL,
  `Brand_name` varchar(255) NOT NULL,
  `Category_name` varchar(255) NOT NULL,
  `Purchase_price` int(11) NOT NULL,
  `QTY_recieved` int(11) NOT NULL,
  `total_in_pack` int(11) NOT NULL,
  `created_date` date NOT NULL,
  `Supplier_name` varchar(255) NOT NULL,
  `Reciever_name` varchar(255) NOT NULL,
  `Payment_method` varchar(255) NOT NULL,
  `Delivery_method` varchar(255) NOT NULL,
  `Cost_of_delivery` int(11) NOT NULL,
  `barcode` varchar(255) DEFAULT NULL,
  `Manufacture_date` date NOT NULL,
  `Expire_date` date NOT NULL,
  `Total_damaged` int(255) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'unverified',
  `activate` varchar(10) NOT NULL DEFAULT 'no'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inventory`
--

INSERT INTO `inventory` (`id`, `Product_name`, `Brand_name`, `Category_name`, `Purchase_price`, `QTY_recieved`, `total_in_pack`, `created_date`, `Supplier_name`, `Reciever_name`, `Payment_method`, `Delivery_method`, `Cost_of_delivery`, `barcode`, `Manufacture_date`, `Expire_date`, `Total_damaged`, `status`, `activate`) VALUES
(1, 'instant noodles', 'indomie', 'food', 23000, 12, 22, '2024-04-28', 'Business_name 1 ', 'Francis Fidelis ', 'Cash', 'by comapany', 12000, NULL, '2024-05-17', '2024-05-19', 0, 'verified', 'yes'),
(2, 'super pack', 'indomie', 'food', 30000, 12, 23, '2024-04-28', 'Business_name 9 ', 'Francis Fidelis ', 'Cash', 'by Supplier', 12000, NULL, '2024-02-16', '2024-10-31', 2, 'verified', 'yes'),
(3, 'three crown', 'Peak', 'Diaries & Eggs', 30000, 12, 10, '2024-04-29', 'Business_name 9 ', 'Francis Fidelis ', 'Transfer', 'by comapany', 12000, NULL, '2024-04-30', '2024-05-11', 0, 'verified', 'yes'),
(4, 'condensed milk', 'Peak', 'food', 30000, 2, 12, '2024-04-29', 'Unregistered', 'Francis Fidelis ', 'Cash', 'by comapany', 2000, NULL, '2024-04-25', '2024-04-26', 0, 'verified', 'yes'),
(5, 'omo', 'omo', 'personal care', 12000, 12, 2, '2024-05-03', 'Business_name 9 ', 'Francis Fidelis ', 'Transfer', 'by comapany', 12000, NULL, '2024-05-30', '2024-05-30', 12, 'verified', 'yes'),
(6, 'cabin busicuits', 'yale', 'personal care', 20000, 34, 20, '2024-05-03', 'Business_name 9 ', 'Francis Fidelis ', 'Cash', 'by comapany', 12, NULL, '2024-05-19', '2024-05-17', 0, 'verified', 'yes');

-- --------------------------------------------------------

--
-- Table structure for table `Order_Products`
--

CREATE TABLE `Order_Products` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `store_id` int(11) NOT NULL,
  `sale_id` bigint(255) NOT NULL,
  `price_per_item` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Order_Products`
--

INSERT INTO `Order_Products` (`id`, `product_id`, `store_id`, `sale_id`, `price_per_item`, `name`) VALUES
(1, 2, 6, 1714828170010, 400, 'super pack'),
(2, 4, 6, 1714828170010, 550, 'condensed milk'),
(3, 2, 6, 1714828170010, 400, 'super pack'),
(4, 2, 6, 1714828253865, 400, 'super pack'),
(5, 4, 6, 1714828253865, 550, 'condensed milk'),
(6, 2, 6, 1714828906827, 400, 'super pack'),
(7, 4, 6, 1714828906827, 550, 'condensed milk'),
(8, 3, 6, 1714831206507, 850, 'three crown'),
(9, 5, 6, 1714831206507, 100, 'cabin busicuits'),
(10, 6, 6, 1714831206507, 70, 'omo'),
(11, 4, 6, 1714831206507, 550, 'condensed milk'),
(12, 2, 6, 1714831206507, 400, 'super pack'),
(13, 3, 6, 1714831384730, 850, 'three crown'),
(14, 2, 6, 1714831384730, 400, 'super pack'),
(15, 3, 6, 1714831678519, 850, 'three crown'),
(16, 2, 6, 1714831678519, 400, 'super pack'),
(17, 5, 6, 1714831678519, 100, 'cabin busicuits'),
(18, 2, 6, 1714831822520, 400, 'super pack'),
(19, 4, 6, 1714831822520, 550, 'condensed milk'),
(20, 5, 6, 1714831822520, 100, 'cabin busicuits'),
(21, 6, 6, 1714831822520, 70, 'omo'),
(22, 3, 6, 1715021170095, 850, 'three crown'),
(23, 2, 6, 1715021170095, 400, 'super pack'),
(24, 4, 6, 1715021170095, 550, 'condensed milk');

-- --------------------------------------------------------

--
-- Table structure for table `Positions`
--

CREATE TABLE `Positions` (
  `id` int(11) NOT NULL,
  `Position_name` varchar(255) NOT NULL,
  `Salary` int(11) NOT NULL,
  `Job_description` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Positions`
--

INSERT INTO `Positions` (`id`, `Position_name`, `Salary`, `Job_description`) VALUES
(1, 'Regional director', 50000, 'handle all stock records, employ new staffs as required, fire if required\r\n');

-- --------------------------------------------------------

--
-- Table structure for table `Products`
--

CREATE TABLE `Products` (
  `id` int(11) NOT NULL,
  `ProductName` varchar(100) NOT NULL,
  `Brand_name` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL,
  `inventory_id` int(50) NOT NULL,
  `UnitPrice` int(100) DEFAULT NULL,
  `StockQuantity` int(100) NOT NULL,
  `created_date` date NOT NULL,
  `activate` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Products`
--

INSERT INTO `Products` (`id`, `ProductName`, `Brand_name`, `category`, `inventory_id`, `UnitPrice`, `StockQuantity`, `created_date`, `activate`) VALUES
(2, 'super pack', 'indomie', 'food', 2, 400, 12, '2024-04-28', 'yes'),
(3, 'three crown', 'Peak', 'Diaries & Eggs', 3, 850, 12, '2024-04-29', 'yes'),
(4, 'condensed milk', 'Peak', 'food', 4, 550, 2, '2024-04-29', 'yes'),
(5, 'cabin busicuits', 'yale', 'personal care', 6, 100, 34, '2024-05-03', 'yes'),
(6, 'omo', 'omo', 'personal care', 5, 70, 12, '2024-05-03', 'yes');

-- --------------------------------------------------------

--
-- Table structure for table `Sales`
--

CREATE TABLE `Sales` (
  `id` int(11) NOT NULL,
  `store_name` varchar(255) NOT NULL,
  `store_id` int(11) NOT NULL,
  `sale_id` bigint(255) NOT NULL,
  `created_date` date NOT NULL,
  `Discount_applied` int(11) NOT NULL DEFAULT 0,
  `attendant_id` varchar(255) NOT NULL,
  `total_amount` int(255) NOT NULL,
  `Payment_type` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Sales`
--

INSERT INTO `Sales` (`id`, `store_name`, `store_id`, `sale_id`, `created_date`, `Discount_applied`, `attendant_id`, `total_amount`, `Payment_type`) VALUES
(1, 'all', 6, 1714828170010, '2024-05-04', 0, '1', 1350, 'Debit Card'),
(2, 'all', 6, 1714828253865, '2024-05-04', 0, '1', 950, 'Cash'),
(3, 'all', 6, 1714828906827, '2024-05-04', 0, '1', 950, 'Cash'),
(4, 'all', 6, 1714831206507, '2024-05-04', 0, '1', 1970, 'Cash'),
(5, 'all', 6, 1714831384730, '2024-05-04', 0, '1', 1250, 'Cash'),
(6, 'all', 6, 1714831678519, '2024-05-04', 0, '1', 1350, 'Debit Card'),
(7, 'all', 6, 1714831822520, '2024-05-04', 0, '1', 1120, 'Split Payment'),
(8, 'all', 6, 1715021170095, '2024-05-06', 0, '1', 1800, 'Cash');

-- --------------------------------------------------------

--
-- Table structure for table `Stores`
--

CREATE TABLE `Stores` (
  `id` int(11) NOT NULL,
  `store_name` varchar(100) NOT NULL,
  `store_address` varchar(100) NOT NULL,
  `state` varchar(100) NOT NULL,
  `lga` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Stores`
--

INSERT INTO `Stores` (`id`, `store_name`, `store_address`, `state`, `lga`) VALUES
(1, 'Iron fist', 'No. 15, Edim Otop, Calabar Munipality', 'Cross River', 'Calabar-Municipal'),
(2, 'Rubber Spoon ', 'No. 21, Uwanse, Calabar South', 'Cross River', 'Calabar-South');

-- --------------------------------------------------------

--
-- Table structure for table `Suppliers`
--

CREATE TABLE `Suppliers` (
  `id` int(11) NOT NULL,
  `First_name` varchar(255) NOT NULL,
  `Last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `Phone` int(11) NOT NULL,
  `Address` varchar(255) NOT NULL,
  `Business_name` varchar(255) NOT NULL,
  `created_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Suppliers`
--

INSERT INTO `Suppliers` (`id`, `First_name`, `Last_name`, `email`, `Phone`, `Address`, `Business_name`, `created_date`) VALUES
(2, 'chinedu', 'emeka', 'jasonnewman@gmail.com', 3233, '113', 'Business_name 1', '2024-04-22'),
(3, 'chinedu', 'emeka', 'jasonnewmaniv@gmail.com', 889, '9099', 'Business_name 9', '2024-04-22');

-- --------------------------------------------------------

--
-- Table structure for table `Transactions`
--

CREATE TABLE `Transactions` (
  `TransactionID` int(11) NOT NULL,
  `ProductID` int(200) NOT NULL,
  `StoreID` int(100) NOT NULL,
  `TransactionType` int(100) NOT NULL,
  `Quantity` int(100) NOT NULL,
  `TransactionDate` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `firstName` varchar(200) NOT NULL,
  `lastName` varchar(200) NOT NULL,
  `email` varchar(200) NOT NULL,
  `password` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `firstName`, `lastName`, `email`, `password`) VALUES
(1, 'Michael', 'Adariku', 'adarikumichael@gmail.com', '1234');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Category`
--
ALTER TABLE `Category`
  ADD PRIMARY KEY (`CategoryID`);

--
-- Indexes for table `Customers`
--
ALTER TABLE `Customers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Damaged`
--
ALTER TABLE `Damaged`
  ADD PRIMARY KEY (`id`),
  ADD KEY `CategoryID` (`Category_Id`);

--
-- Indexes for table `Discount`
--
ALTER TABLE `Discount`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Employees`
--
ALTER TABLE `Employees`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `inventory`
--
ALTER TABLE `inventory`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Order_Products`
--
ALTER TABLE `Order_Products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Positions`
--
ALTER TABLE `Positions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Products`
--
ALTER TABLE `Products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `CategoryID` (`inventory_id`);

--
-- Indexes for table `Sales`
--
ALTER TABLE `Sales`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Stores`
--
ALTER TABLE `Stores`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ManagerID` (`state`);

--
-- Indexes for table `Suppliers`
--
ALTER TABLE `Suppliers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Transactions`
--
ALTER TABLE `Transactions`
  ADD PRIMARY KEY (`TransactionID`),
  ADD KEY `ProductID` (`ProductID`),
  ADD KEY `StoreID` (`StoreID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Category`
--
ALTER TABLE `Category`
  MODIFY `CategoryID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `Customers`
--
ALTER TABLE `Customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `Damaged`
--
ALTER TABLE `Damaged`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Discount`
--
ALTER TABLE `Discount`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `Employees`
--
ALTER TABLE `Employees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `inventory`
--
ALTER TABLE `inventory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `Order_Products`
--
ALTER TABLE `Order_Products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `Positions`
--
ALTER TABLE `Positions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `Products`
--
ALTER TABLE `Products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `Sales`
--
ALTER TABLE `Sales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `Stores`
--
ALTER TABLE `Stores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `Suppliers`
--
ALTER TABLE `Suppliers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `Transactions`
--
ALTER TABLE `Transactions`
  MODIFY `TransactionID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Transactions`
--
ALTER TABLE `Transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`ProductID`) REFERENCES `Products` (`id`),
  ADD CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`StoreID`) REFERENCES `Stores` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
