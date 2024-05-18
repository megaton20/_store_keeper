-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: May 16, 2024 at 08:56 PM
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
(4, 'convenience', 'Tobacco, cigarettes, illegal'),
(5, 'Household Essentials', 'cleaning supplies (cleaning sprays, dish soap), Laundry detergent, paper product (paper towels, toilet paper)'),
(8, 'Alcohol Beverage', 'gin, wine spirits, cream spirits, ginger'),
(16, 'alcohols', 'boost');

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
(7, 'free xmass updated', 30, '2024-05-12', '2024-05-09', 'church');

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
(1, 'Indomie', 'Dangote', 'food', 14000, 4, 24, '2024-05-12', 'Unregistered', 'Francis Fidelis ', 'Cash', 'by comapany', 500, NULL, '2024-05-29', '2024-06-08', 0, 'verified', 'yes'),
(2, 'Three crown', 'Peak', 'Diaries & Eggs', 2300, 2, 20, '2024-05-12', 'Unregistered', 'Francis Fidelis ', 'Cash', 'by comapany', 200, NULL, '2024-04-30', '2024-06-09', 0, 'verified', 'yes'),
(3, 'big x1', 'Smirnoff', 'alcohols', 12000, 2, 12, '2024-05-15', 'Unregistered', 'Michael Adariku ', 'Cash', 'by comapany', 1000, NULL, '2024-05-24', '2024-05-30', 0, 'verified', 'yes');

-- --------------------------------------------------------

--
-- Table structure for table `Orders`
--

CREATE TABLE `Orders` (
  `id` int(11) NOT NULL,
  `customer_email` varchar(255) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `pick_up_store_id` int(255) DEFAULT NULL,
  `pick_up_store_name` varchar(255) DEFAULT NULL,
  `sale_id` bigint(20) NOT NULL,
  `Delivery` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `payment_type` varchar(255) NOT NULL,
  `total_amount` int(11) NOT NULL,
  `created_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Orders`
--

INSERT INTO `Orders` (`id`, `customer_email`, `customer_id`, `pick_up_store_id`, `pick_up_store_name`, `sale_id`, `Delivery`, `status`, `payment_type`, `total_amount`, `created_date`) VALUES
(1, 'gift@gmail.com', 6, NULL, NULL, 1715788909043, 'not selected', 'complete', 'cash', 300, '2024-05-15'),
(2, 'gift@gmail.com', 6, NULL, NULL, 1715789122264, 'Pickup', 'complete', 'cash', 300, '2024-05-15'),
(3, 'gift@gmail.com', 6, NULL, NULL, 1715789135891, 'delivery', 'complete', 'cash', 700, '2024-05-15'),
(4, 'gift@gmail.com', 6, NULL, NULL, 1715791539030, 'Pickup', 'complete', 'cash', 300, '2024-05-15'),
(5, 'gift@gmail.com', 6, NULL, NULL, 1715840319678, 'Pickup', 'complete', 'cash', 300, '2024-05-16'),
(6, 'gift@gmail.com', 6, NULL, NULL, 1715840379083, 'Pickup', 'complete', 'cash', 300, '2024-05-16'),
(7, 'gift@gmail.com', 6, NULL, NULL, 1715841584036, 'Pickup', 'complete', 'cash', 6000, '2024-05-16'),
(8, 'gift@gmail.com', 6, NULL, NULL, 1715844048436, 'Pickup', 'complete', 'cash', 300, '2024-05-16'),
(9, 'gift@gmail.com', 6, NULL, NULL, 1715847980799, 'Pickup', 'complete', 'cash', 300, '2024-05-16'),
(10, 'gift@gmail.com', 6, NULL, NULL, 1715850823663, 'Pickup', 'complete', 'cash', 6000, '2024-05-16'),
(11, 'gift@gmail.com', 6, NULL, NULL, 1715851242173, 'Pickup', 'complete', 'cash', 6000, '2024-05-16'),
(12, 'gift@gmail.com', 6, NULL, NULL, 1715852606214, 'Pickup', 'complete', 'cash', 6000, '2024-05-16'),
(13, 'gift@gmail.com', 6, NULL, NULL, 1715853080175, 'Pickup', 'complete', 'cash', 6000, '2024-05-16'),
(14, 'gift@gmail.com', 6, NULL, NULL, 1715853242855, 'Pickup', 'complete', 'cash', 6000, '2024-05-16'),
(15, 'gift@gmail.com', 6, NULL, NULL, 1715853320706, 'Pickup', 'complete', 'cash', 6000, '2024-05-16'),
(16, 'gift@gmail.com', 6, NULL, NULL, 1715853971619, 'Pickup', 'complete', 'cash', 18000, '2024-05-16'),
(17, 'gift@gmail.com', 6, NULL, NULL, 1715854118249, 'Pickup', 'complete', 'cash', 6000, '2024-05-16'),
(18, 'gift@gmail.com', 6, NULL, NULL, 1715860449328, 'Pickup', 'complete', 'cash', 12000, '2024-05-16'),
(19, 'gift@gmail.com', 6, NULL, NULL, 1715861061379, 'Pickup', 'shipped', 'cash', 6000, '2024-05-16'),
(20, 'gift@gmail.com', 6, NULL, NULL, 1715863053561, 'Pickup', 'complete', 'Debit card', 6000, '2024-05-16');

-- --------------------------------------------------------

--
-- Table structure for table `Order_Products`
--

CREATE TABLE `Order_Products` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `store_id` int(11) DEFAULT NULL,
  `cart_id` bigint(20) NOT NULL,
  `sale_id` bigint(255) NOT NULL,
  `price_per_item` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `status` varchar(255) DEFAULT 'sold'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Order_Products`
--

INSERT INTO `Order_Products` (`id`, `product_id`, `store_id`, `cart_id`, `sale_id`, `price_per_item`, `name`, `status`) VALUES
(1, 1, NULL, 1715788860742, 1715788862338, 300, 'Indomie', 'sold'),
(2, 1, NULL, 1715788904238, 1715788909043, 300, 'Indomie', 'sold'),
(3, 1, NULL, 1715789120212, 1715789122264, 300, 'Indomie', 'sold'),
(4, 2, NULL, 1715789132490, 1715789135891, 700, 'Three crown', 'sold'),
(5, 1, NULL, 1715791537879, 1715791539030, 300, 'Indomie', 'sold'),
(6, 1, 1, 1715794924753, 1715794933137, 300, 'Indomie', 'sold'),
(7, 3, 1, 1715795386807, 1715795408266, 6000, 'big x1', 'sold'),
(8, 3, 1, 1715795391704, 1715795408266, 6000, 'big x1', 'sold'),
(9, 1, NULL, 1715840318904, 1715840319678, 300, 'Indomie', 'shipped'),
(10, 1, NULL, 1715840374603, 1715840379083, 300, 'Indomie', 'shipped'),
(11, 3, NULL, 1715841581656, 1715841584036, 6000, 'big x1', 'sold'),
(12, 1, 1, 1715843823907, 1715843825420, 300, 'Indomie', 'sold'),
(13, 1, 1, 1715843878615, 1715843879913, 300, 'Indomie', 'sold'),
(14, 1, NULL, 1715844047403, 1715844048436, 300, 'Indomie', 'sold'),
(15, 1, NULL, 1715847980245, 1715847980799, 300, 'Indomie', 'sold'),
(16, 1, NULL, 1715848769843, 1715848772205, 300, 'Indomie', 'sold'),
(17, 3, NULL, 1715850821589, 1715850823663, 6000, 'big x1', 'sold'),
(18, 3, NULL, 1715851240835, 1715851242173, 6000, 'big x1', 'sold'),
(19, 3, NULL, 1715851399080, 1715851401205, 6000, 'big x1', 'sold'),
(20, 3, NULL, 1715852587707, 1715852606214, 6000, 'big x1', 'sold'),
(21, 3, NULL, 1715852788818, 1715852790007, 6000, 'big x1', 'sold'),
(22, 3, NULL, 1715852795655, 1715852796622, 6000, 'big x1', 'sold'),
(23, 3, NULL, 1715853078259, 1715853080175, 6000, 'big x1', 'sold'),
(24, 3, NULL, 1715853241639, 1715853242855, 6000, 'big x1', 'sold'),
(25, 3, NULL, 1715853309531, 1715853320706, 6000, 'big x1', 'sold'),
(26, 3, NULL, 1715853967631, 1715853971619, 6000, 'big x1', 'sold'),
(27, 3, NULL, 1715853967838, 1715853971619, 6000, 'big x1', 'sold'),
(28, 3, NULL, 1715853968930, 1715853971619, 6000, 'big x1', 'sold'),
(29, 3, NULL, 1715854117578, 1715854118249, 6000, 'big x1', 'sold'),
(30, 3, NULL, 1715860299389, 1715860449328, 6000, 'big x1', 'returned'),
(31, 3, NULL, 1715860299543, 1715860449328, 6000, 'big x1', 'sold'),
(32, 3, NULL, 1715861060588, 1715861061379, 6000, 'big x1', 'shipped'),
(33, 3, NULL, 1715863049460, 1715863053561, 6000, 'big x1', 'sold'),
(34, 3, 1, 1715883333007, 1715883335064, 6000, 'big x1', 'sold'),
(35, 3, NULL, 1715883768943, 1715883772967, 6000, 'big x1', 'sold');

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
(1, 'Store manager', 30000, 'Hire and fire staffs, Accountability and store management'),
(3, 'Counter Attendant', 25000, 'attending to customers at the counter'),
(4, 'Security', 20000, 'Maintain orderliness in the store, handling safety and electricity of the building'),
(5, 'Logistics', 25000, 'Handle Logistics of the company running errands for the brand... must be a good driver and must have a license');

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
  `total_in_pack` int(11) DEFAULT NULL,
  `total_on_shelf` int(11) DEFAULT NULL,
  `created_date` date NOT NULL,
  `activate` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Products`
--

INSERT INTO `Products` (`id`, `ProductName`, `Brand_name`, `category`, `inventory_id`, `UnitPrice`, `StockQuantity`, `total_in_pack`, `total_on_shelf`, `created_date`, `activate`) VALUES
(1, 'Indomie', 'Dangote', 'food', 1, 300, 4, 24, 0, '2024-05-12', 'yes'),
(2, 'Three crown', 'Peak', 'Diaries & Eggs', 2, 700, 2, 20, 5, '2024-05-12', 'yes'),
(3, 'big x1', 'Smirnoff', 'alcohols', 3, 6000, 2, 12, 5, '2024-05-15', 'yes');

-- --------------------------------------------------------

--
-- Table structure for table `Return_order`
--

CREATE TABLE `Return_order` (
  `id` int(11) NOT NULL,
  `sale_id` bigint(20) NOT NULL,
  `store_id` bigint(20) NOT NULL,
  `store_name` varchar(255) NOT NULL,
  `attendant_id` bigint(20) NOT NULL,
  `attendant_name` varchar(255) NOT NULL,
  `refund_method` varchar(255) NOT NULL,
  `reason_for_return` varchar(255) NOT NULL,
  `created_date` date NOT NULL,
  `Status` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Sales`
--

CREATE TABLE `Sales` (
  `id` int(11) NOT NULL,
  `store_name` varchar(255) DEFAULT NULL,
  `store_id` int(11) DEFAULT NULL,
  `sale_type` varchar(255) NOT NULL,
  `sale_id` bigint(255) NOT NULL,
  `created_date` date NOT NULL,
  `Discount_applied` int(11) NOT NULL DEFAULT 0,
  `attendant_id` varchar(255) NOT NULL,
  `total_amount` int(255) NOT NULL,
  `Payment_type` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'unresolved'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Sales`
--

INSERT INTO `Sales` (`id`, `store_name`, `store_id`, `sale_type`, `sale_id`, `created_date`, `Discount_applied`, `attendant_id`, `total_amount`, `Payment_type`, `status`) VALUES
(1, NULL, NULL, 'counter', 1715788862338, '2024-05-15', 0, '1', 300, 'Cash', 'resolved'),
(2, NULL, 1, 'counter', 1715794933137, '2024-05-15', 0, '5', 300, 'Cash', 'resolved'),
(3, NULL, 1, 'counter', 1715795408266, '2024-05-15', 0, '5', 12000, 'Cash', 'resolved'),
(14, NULL, NULL, 'order', 1715791539030, '2024-05-16', 0, '0', 300, 'cash', 'resolved'),
(15, NULL, NULL, 'order', 1715840319678, '2024-05-16', 0, '0', 300, 'cash', 'shipped'),
(16, NULL, NULL, 'order', 1715789135891, '2024-05-16', 0, '0', 700, 'cash', 'resolved'),
(17, NULL, NULL, 'order', 1715788909043, '2024-05-16', 0, '0', 300, 'cash', 'resolved'),
(18, NULL, NULL, 'order', 1715840379083, '2024-05-16', 0, '0', 300, 'cash', 'shipped'),
(19, NULL, NULL, 'order', 1715841584036, '2024-05-16', 0, '0', 6000, 'cash', 'shipped'),
(20, NULL, NULL, 'order', 1715789122264, '2024-05-16', 0, '0', 300, 'cash', 'waiting'),
(21, NULL, 1, 'counter', 1715843825420, '2024-05-16', 0, '5', 300, 'Cash', 'resolved'),
(22, NULL, 1, 'counter', 1715843879913, '2024-05-16', 0, '5', 300, 'Cash', 'resolved'),
(23, NULL, NULL, 'order', 1715844048436, '2024-05-16', 0, '0', 300, 'cash', 'shipped'),
(24, NULL, NULL, 'order', 1715847980799, '2024-05-16', 0, '0', 300, 'cash', 'shipped'),
(25, NULL, NULL, 'counter', 1715848772205, '2024-05-16', 0, '1', 300, 'Cash', 'resolved'),
(26, NULL, NULL, 'order', 1715850823663, '2024-05-16', 0, '0', 6000, 'cash', 'resolved'),
(27, NULL, NULL, 'counter', 1715851401205, '2024-05-16', 0, '1', 6000, 'Cash', 'resolved'),
(28, NULL, NULL, 'order', 1715851242173, '2024-05-16', 0, '0', 6000, 'cash', 'shipped'),
(29, NULL, NULL, 'counter', 1715852790007, '2024-05-16', 0, '1', 6000, 'Cash', 'resolved'),
(30, NULL, NULL, 'counter', 1715852796622, '2024-05-16', 0, '1', 6000, 'Cash', 'resolved'),
(31, NULL, NULL, 'order', 1715852606214, '2024-05-16', 0, '0', 6000, 'cash', 'shipped'),
(32, NULL, NULL, 'order', 1715853080175, '2024-05-16', 0, '0', 6000, 'cash', 'resolved'),
(33, NULL, NULL, 'order', 1715853242855, '2024-05-16', 0, '0', 6000, 'cash', 'resolved'),
(34, NULL, NULL, 'order', 1715853320706, '2024-05-16', 0, '0', 6000, 'cash', 'resolved'),
(35, NULL, NULL, 'order', 1715853971619, '2024-05-16', 0, '0', 18000, 'cash', 'resolved'),
(36, NULL, NULL, 'order', 1715854118249, '2024-05-16', 0, '0', 6000, 'cash', 'resolved'),
(37, NULL, NULL, 'order', 1715860449328, '2024-05-16', 0, '0', 12000, 'cash', 'resolved'),
(38, NULL, NULL, 'order', 1715861061379, '2024-05-16', 0, '0', 6000, 'cash', 'resolved'),
(39, NULL, NULL, 'order', 1715863053561, '2024-05-16', 0, '0', 6000, 'Debit card', 'resolved'),
(40, NULL, 1, 'counter', 1715883335064, '2024-05-16', 0, '5', 6000, 'Cash', 'resolved'),
(41, NULL, NULL, 'counter', 1715883772967, '2024-05-16', 0, '1', 6000, 'Split Payment', 'resolved');

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
(2, 'Rubber Spoon ', 'No. 21, Uwanse, Calabar South', 'Cross River', 'Bekwarra'),
(7, 'Marian hotel', 'no. 45, check road', 'Delta', 'Aniocha North'),
(9, 'silvia stitches', '21 Atimbo', 'Cross River', 'Abi'),
(10, 'store 1 updated', 'no. 45, check road', 'Cross River', 'Akamkpa'),
(12, 'Store 3', '305 old odukpani road', 'Cross River', 'Calabar-Municipal');

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
(4, 'Supplier 1', 'first name', 'emai@email.com', 3232, '2323', 'last name', '2024-05-15'),
(5, 'Supplier 2', 'first 2', 'frr@gmail.com', 323, '13', 'ee', '2024-05-15');

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
-- Table structure for table `Users`
--

CREATE TABLE `Users` (
  `id` int(11) NOT NULL,
  `First_name` varchar(255) NOT NULL,
  `Last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `Phone` int(11) NOT NULL,
  `Address` varchar(50) DEFAULT NULL,
  `created_date` date NOT NULL,
  `Previous_visit` date NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'unverified',
  `spending` int(11) DEFAULT NULL,
  `userRole` varchar(244) NOT NULL DEFAULT 'user',
  `Password` int(11) NOT NULL,
  `state` varchar(255) DEFAULT NULL,
  `lga` varchar(255) DEFAULT NULL,
  `store_id` int(11) DEFAULT NULL,
  `store_name` varchar(255) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `salary` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Users`
--

INSERT INTO `Users` (`id`, `First_name`, `Last_name`, `email`, `Phone`, `Address`, `created_date`, `Previous_visit`, `status`, `spending`, `userRole`, `Password`, `state`, `lga`, `store_id`, `store_name`, `gender`, `salary`) VALUES
(1, 'Michael', 'Adariku', 'adarikumichael@gmail.com', 777666, '9098', '2024-04-22', '2024-04-22', 'verified', 0, 'super', 1234, NULL, NULL, 1, NULL, NULL, NULL),
(5, 'chinedu', 'emeka', 'chinedu@gmail.com', 777666, '9098', '2024-04-22', '2024-04-22', 'verified', 0, 'admin', 1234, NULL, NULL, 1, NULL, NULL, NULL),
(6, 'gift', 'emeka', 'gift@gmail.com', 777666, '9098', '2024-04-22', '2024-04-22', 'verified', 0, 'user', 1234, NULL, NULL, NULL, NULL, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Category`
--
ALTER TABLE `Category`
  ADD PRIMARY KEY (`CategoryID`);

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
-- Indexes for table `inventory`
--
ALTER TABLE `inventory`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Orders`
--
ALTER TABLE `Orders`
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
-- Indexes for table `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Category`
--
ALTER TABLE `Category`
  MODIFY `CategoryID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `Damaged`
--
ALTER TABLE `Damaged`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Discount`
--
ALTER TABLE `Discount`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `inventory`
--
ALTER TABLE `inventory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `Orders`
--
ALTER TABLE `Orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `Order_Products`
--
ALTER TABLE `Order_Products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `Positions`
--
ALTER TABLE `Positions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `Products`
--
ALTER TABLE `Products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `Sales`
--
ALTER TABLE `Sales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `Stores`
--
ALTER TABLE `Stores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `Suppliers`
--
ALTER TABLE `Suppliers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `Transactions`
--
ALTER TABLE `Transactions`
  MODIFY `TransactionID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Users`
--
ALTER TABLE `Users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

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
