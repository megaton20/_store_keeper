-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jun 01, 2024 at 08:38 PM
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
-- Table structure for table `Cart`
--

CREATE TABLE `Cart` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `user_email` varchar(255) DEFAULT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `price_per_item` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `uuid` bigint(20) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(1, 'Food', 'A variety of essential food items including fresh, packaged, and pantry staples.'),
(2, 'Diary', 'Essential dairy products for everyday \r\nCheese (Cheddar, Mozzarella, Brie)\r\nYogurt (Greek Yogurt, Flavored Yogurt)\r\nButter and Cream (Salted Butter, Heavy Cream)'),
(3, 'Non-Alcoholic Beverages', 'Non-alcoholic drinks to suit various tastes and preferences.'),
(4, 'Alcohol', 'A variety of alcoholic beverages for different occasions.'),
(5, 'Personal Care', 'Products for personal hygiene and grooming.'),
(6, 'Wines', ' selection of wines from different regions and varieties.'),
(7, 'Snacks and Confectioneries', 'Quick bites and sweet treats for any time of the day.'),
(8, 'Household Essentials', 'Non-food items necessary for maintaining a clean and functional home.'),
(9, 'Baked & Pastries', 'Freshly baked goods and items used for baking at home.');

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

-- --------------------------------------------------------

--
-- Table structure for table `inventory`
--

CREATE TABLE `inventory` (
  `id` int(11) NOT NULL,
  `Product_name` varchar(255) NOT NULL,
  `Brand_name` varchar(255) NOT NULL,
  `Category_name` varchar(255) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `Purchase_price` decimal(10,2) NOT NULL,
  `QTY_recieved` int(11) NOT NULL,
  `total_in_pack` int(11) NOT NULL,
  `created_date` date NOT NULL,
  `Supplier_name` varchar(255) NOT NULL,
  `supplier_id` int(11) DEFAULT NULL,
  `Reciever_name` varchar(255) NOT NULL,
  `Payment_method` varchar(255) NOT NULL,
  `Delivery_method` varchar(255) NOT NULL,
  `Cost_of_delivery` int(11) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `barcode` varchar(255) DEFAULT NULL,
  `Manufacture_date` date NOT NULL,
  `Expire_date` date NOT NULL,
  `Total_damaged` int(255) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'unverified',
  `activate` varchar(10) NOT NULL DEFAULT 'no',
  `expired` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inventory`
--

INSERT INTO `inventory` (`id`, `Product_name`, `Brand_name`, `Category_name`, `category_id`, `Purchase_price`, `QTY_recieved`, `total_in_pack`, `created_date`, `Supplier_name`, `supplier_id`, `Reciever_name`, `Payment_method`, `Delivery_method`, `Cost_of_delivery`, `image`, `barcode`, `Manufacture_date`, `Expire_date`, `Total_damaged`, `status`, `activate`, `expired`) VALUES
(1, 'Sachet gino tomato paste (70g)', 'Gino', 'Food', 1, 6400.00, 2, 25, '2024-05-31', 'Agro-a corporations ', 1, 'Michael Adariku ', 'Cash', 'by Supplier', 700, 'image-1717166437908.avif', NULL, '2024-05-16', '2024-07-12', 0, 'verified', 'yes', NULL),
(2, 'derica tomato (tin) 210g', 'derica', 'Food', 1, 12000.00, 2, 25, '2024-05-31', 'Agro-a corporations ', 1, 'Michael Adariku ', 'Cash', 'by comapany', 200, 'image-1717166826917.avif', NULL, '2024-05-08', '2024-07-20', 0, 'verified', 'yes', NULL),
(3, 'palm oil 1.5l', 'unknown', 'Food', 1, 23000.00, 1, 25, '2024-05-31', 'Agro-a corporations ', 1, 'Michael Adariku ', 'Cash', 'by Supplier', 1000, 'image-1717170263511.webp', NULL, '2024-04-11', '2026-02-21', 0, 'verified', 'yes', NULL),
(4, 'Chicken', 'unknown', 'Food', 1, 10000.00, 2, 5, '2024-05-31', 'Agro-a corporations ', 1, 'Michael Adariku ', 'Cash', 'by comapany', 100, 'image-1717170554521.JPG', NULL, '2024-05-15', '2024-07-13', 4, 'verified', 'yes', NULL),
(5, 'sonia tomato 400g (can)', 'Sonia', 'Food', 1, 12000.00, 3, 16, '2024-05-31', 'Agro-a corporations ', 1, 'Michael Adariku ', 'Cash', 'by comapany', 100, 'image-1717184130878.webp', NULL, '2024-05-09', '2024-07-12', 0, 'verified', 'yes', NULL),
(6, 'can gino tomato paste 2200g', 'Gino', 'Food', 1, 16000.00, 3, 16, '2024-05-31', 'Agro-a corporations ', 1, 'Michael Adariku ', 'Cash', 'by comapany', 100, 'image-1717184308920.jpeg', NULL, '2024-05-17', '2024-07-18', 0, 'verified', 'yes', NULL),
(7, 'fufu', 'unknown', 'Food', 1, 5000.00, 2, 12, '2024-05-31', 'Agro-a corporations ', 1, 'Michael Adariku ', 'Cash', 'by comapany', 100, 'image-1717184487958.webp', NULL, '2024-05-08', '2024-07-11', 0, 'verified', 'yes', NULL),
(8, 'crayfish', 'unknown', 'Food', 1, 15000.00, 1, 150, '2024-05-31', 'Agro-a corporations ', 1, 'Michael Adariku ', 'Cash', 'by comapany', 300, 'image-1717184602527.webp', NULL, '2024-05-03', '2024-10-18', 0, 'verified', 'yes', NULL),
(9, 'okra', 'okra', 'Food', 1, 4000.00, 3, 20, '2024-05-31', 'Agro-a corporations ', 1, 'Michael Adariku ', 'Cash', 'by comapany', 100, 'image-1717184713957.avif', NULL, '2024-05-12', '2024-07-12', 0, 'verified', 'yes', NULL),
(10, 'gino tomato paste (tin) 400g', 'Gino', 'Food', 1, 15000.00, 4, 12, '2024-05-31', 'Agro-a corporations ', 1, 'Michael Adariku ', 'Cash', 'by comapany', 100, 'image-1717184818683.webp', NULL, '2024-05-11', '2024-07-20', 0, 'verified', 'yes', NULL),
(11, 'gino (pepe & onion) 70g', 'Gino', 'Food', 1, 19000.00, 100, 16, '2024-05-31', 'Agro-a corporations ', 1, 'Michael Adariku ', 'Cash', 'by comapany', 500, 'image-1717184998613.webp', NULL, '2024-06-15', '2024-07-18', 0, 'verified', 'yes', NULL),
(12, 'onion (red)', 'unknown', 'Food', 1, 10000.00, 5, 1, '2024-05-31', 'Agro-a corporations ', 1, 'Michael Adariku ', 'Cash', 'by comapany', 0, 'image-1717185165267.avif', NULL, '2024-06-14', '2024-06-11', 0, 'verified', 'yes', NULL),
(13, 'Melon (Egusi)', 'unknown', 'Food', 1, 17000.00, 1, 30, '2024-05-31', 'Agro-a corporations ', 1, 'Michael Adariku ', 'Cash', 'by comapany', 1000, 'image-1717185342090.jpeg', NULL, '2024-05-08', '2024-06-21', 0, 'verified', 'yes', NULL),
(14, 'Melon Egusi (machine peeled)', 'unknown', 'Food', 1, 40000.00, 1, 40, '2024-05-31', 'Agro-a corporations ', 1, 'Michael Adariku ', 'Cash', 'by comapany', 1000, 'image-1717185641372.webp', NULL, '2024-05-16', '2024-07-17', 0, 'verified', 'yes', NULL),
(15, 'tomato jos 65g', 'unknown', 'Food', 1, 15000.00, 2, 16, '2024-05-31', 'Agro-a corporations ', 1, 'Michael Adariku ', 'Cash', 'by comapany', 1000, 'image-1717187538826.webp', NULL, '2024-05-16', '2024-06-30', 0, 'verified', 'yes', NULL),
(16, 'tasty tom tomato 70g', 'unknown', 'Food', 1, 15000.00, 2, 16, '2024-05-31', 'Agro-a corporations ', 1, 'Michael Adariku ', 'Cash', 'by comapany', 100, 'image-1717187685013.avif', NULL, '2024-05-04', '2024-07-12', 0, 'verified', 'yes', NULL),
(17, 'plantain x3', 'unknown', 'Food', 1, 3000.00, 1, 12, '2024-05-31', 'Agro-a corporations ', 1, 'Michael Adariku ', 'Cash', 'by comapany', 100, 'image-1717187823822.jpeg', NULL, '2024-05-26', '2024-08-08', 0, 'verified', 'yes', NULL),
(18, 'beef', 'unknown', 'Food', 1, 50000.00, 2, 50, '2024-05-31', 'Agro-a corporations ', 1, 'Michael Adariku ', 'Cash', 'by comapany', 1000, 'image-1717188116704.JPG', NULL, '2024-06-15', '2024-07-13', 0, 'verified', 'yes', NULL),
(19, 'Pepperoni Bread', 'Pepperoni', 'Baked & Pastries', 9, 7000.00, 1, 10, '2024-05-31', 'Agro-a corporations ', 1, 'Michael Adariku ', 'Cash', 'by comapany', 100, 'image-1717188946677.JPG', NULL, '2024-05-08', '2024-06-14', 0, 'verified', 'yes', NULL),
(20, 'digestive', 'unknown ', 'Snacks and Confectioneries', 7, 10000.00, 2, 10, '2024-05-31', 'Agro-a corporations ', 1, 'Michael Adariku ', 'Cash', 'by comapany', 100, 'image-1717189147674.JPG', NULL, '2024-05-17', '2024-07-19', 0, 'verified', 'yes', NULL),
(21, 'cornflakes', 'Kellogg\'s', 'Snacks and Confectioneries', 7, 12000.00, 1, 15, '2024-05-31', 'Agro-a corporations ', 1, 'Michael Adariku ', 'Cash', 'by comapany', 0, 'image-1717189304823.JPG', NULL, '2024-05-02', '2024-07-25', 0, 'verified', 'yes', NULL),
(22, 'cocopops', 'kallogg\'s', 'Snacks and Confectioneries', 7, 13000.00, 1, 13, '2024-05-31', 'Agro-a corporations ', 1, 'Michael Adariku ', 'Cash', 'by Supplier', 100, 'image-1717189488225.JPG', NULL, '2024-05-09', '2024-07-18', 0, 'verified', 'yes', NULL),
(23, 'oreos o\'s', 'oreos', 'Snacks and Confectioneries', 7, 8000.00, 1, 20, '2024-05-31', 'Agro-a corporations ', 1, 'Michael Adariku ', 'Cash', 'by comapany', 100, 'image-1717189772815.JPG', NULL, '2024-05-10', '2024-06-30', 0, 'verified', 'yes', NULL),
(24, 'pringles (black peper)', 'Pringles', 'Snacks and Confectioneries', 7, 15000.00, 1, 20, '2024-05-31', 'Agro-a corporations ', 1, 'Michael Adariku ', 'Cash', 'by comapany', 100, 'image-1717189950109.JPG', NULL, '2024-03-07', '2024-07-11', 0, 'verified', 'yes', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `Orders`
--

CREATE TABLE `Orders` (
  `id` int(11) NOT NULL,
  `customer_email` varchar(255) NOT NULL,
  `customer_phone` bigint(255) DEFAULT NULL,
  `customer_id` int(11) NOT NULL,
  `pick_up_store_id` int(255) DEFAULT NULL,
  `pick_up_store_name` varchar(255) DEFAULT NULL,
  `sale_id` bigint(20) NOT NULL,
  `Delivery` varchar(255) NOT NULL,
  `driver` varchar(255) DEFAULT NULL,
  `driver_email` varchar(255) DEFAULT NULL,
  `customer_address` varchar(255) DEFAULT NULL,
  `customer_state` varchar(255) DEFAULT NULL,
  `customer_lga` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `payment_type` varchar(255) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `shipping_fee` decimal(10,2) DEFAULT NULL,
  `created_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Orders`
--

INSERT INTO `Orders` (`id`, `customer_email`, `customer_phone`, `customer_id`, `pick_up_store_id`, `pick_up_store_name`, `sale_id`, `Delivery`, `driver`, `driver_email`, `customer_address`, `customer_state`, `customer_lga`, `status`, `payment_type`, `total_amount`, `shipping_fee`, `created_date`) VALUES
(1, 'gift@gmail.com', 7044724835, 2, NULL, NULL, 1717169022295, 'Delivery', NULL, NULL, '305 old odukpani road', 'Cross River', 'Calabar-Municipal', 'incomplete', 'cash', 700.00, 500.00, '2024-05-31'),
(2, 'gift@gmail.com', 7044724835, 2, NULL, NULL, 1717170851901, 'Delivery', NULL, NULL, '305 old odukpani road', 'Cross River', 'Calabar-Municipal', 'incomplete', 'cash', 8300.00, 500.00, '2024-05-31'),
(3, 'gift@gmail.com', 7044724835, 2, NULL, NULL, 1717185713919, 'Delivery', NULL, NULL, '305 old odukpani road', 'Cross River', 'Calabar-Municipal', 'incomplete', 'cash', 8500.00, 500.00, '2024-05-31'),
(4, 'emma@gmail.com', 7044724835, 3, NULL, NULL, 1717251877958, 'Delivery', NULL, NULL, NULL, 'Cross River', 'Calabar-Municipal', 'incomplete', 'cash', 200.00, 500.00, '2024-06-01'),
(5, 'emma@gmail.com', 7044724835, 3, NULL, NULL, 1717257806528, 'Delivery', 'mega tunez', 'mega@gmail.com', '305 old odukpani road', 'Cross River', 'Calabar-Municipal', 'complete', 'cash', 200.00, 500.00, '2024-06-01'),
(6, 'emma@gmail.com', 7044724835, 3, NULL, NULL, 1717257874063, 'Delivery', 'mega tunez', 'mega@gmail.com', '305 old odukpani road', 'Cross River', 'Calabar-Municipal', 'complete', 'cash', 12000.00, 500.00, '2024-06-01'),
(7, 'emma@gmail.com', 7044724835, 3, NULL, NULL, 1717261459927, 'Delivery', 'mega tunez', 'mega@gmail.com', '305 old odukpani road', NULL, NULL, 'complete', 'cash', 530.00, 500.00, '2024-06-01'),
(8, 'emma@gmail.com', 7044724835, 3, NULL, NULL, 1717261766705, 'Delivery', NULL, NULL, '305 old odukpani road', NULL, NULL, 'incomplete', 'cash', 700.00, 500.00, '2024-06-01'),
(9, 'emma@gmail.com', 7044724835, 3, NULL, NULL, 1717262066742, 'Delivery', 'mega tunez', 'mega@gmail.com', '305 old odukpani road', 'Cross River', 'Calabar-Municipal', 'complete', 'cash', 900.00, 500.00, '2024-06-01'),
(10, 'emma@gmail.com', 7044724835, 3, NULL, NULL, 1717263052665, 'Delivery', 'mega tunez', 'mega@gmail.com', '305 old odukpani road', 'Cross River', 'Calabar-Municipal', 'complete', 'cash', 2800.00, 500.00, '2024-06-01'),
(11, 'emma@gmail.com', 7044724835, 3, NULL, NULL, 1717264198040, 'Delivery', 'mega tunez', 'mega@gmail.com', '305 old odukpani road', 'Cross River', 'Calabar-Municipal', 'complete', 'cash', 200.00, 500.00, '2024-06-01'),
(12, 'frr@gmail.com', 7044724835, 6, NULL, NULL, 1717265458649, 'Delivery', 'mega tunez', 'mega@gmail.com', NULL, NULL, NULL, 'complete', 'cash', 1600.00, 500.00, '2024-06-01'),
(13, 'frr@gmail.com', 7044724835, 6, NULL, NULL, 1717265566807, 'Delivery', 'mega tunez', 'mega@gmail.com', NULL, NULL, NULL, 'complete', 'cash', 700.00, 500.00, '2024-06-01'),
(14, 'frr@gmail.com', 7044724835, 6, NULL, NULL, 1717265664769, 'Delivery', 'mega tunez', 'mega@gmail.com', '305 old odukpani road', 'Cross River', 'Calabar-Municipal', 'complete', 'cash', 900.00, 500.00, '2024-06-01'),
(15, 'frr@gmail.com', 7044724835, 6, NULL, NULL, 1717265741959, 'Delivery', 'mega tunez', 'mega@gmail.com', '305 old odukpani road', 'Cross River', 'Calabar-Municipal', 'complete', 'cash', 6000.00, 500.00, '2024-06-01'),
(16, 'Rose@gmail.com', 7044724835, 7, NULL, NULL, 1717265853915, 'Delivery', NULL, NULL, NULL, NULL, NULL, 'incomplete', 'cash', 900.00, 500.00, '2024-06-01'),
(17, 'Rose@gmail.com', 7044724835, 7, NULL, NULL, 1717265903872, 'Delivery', NULL, NULL, NULL, NULL, NULL, 'incomplete', 'cash', 200.00, 500.00, '2024-06-01'),
(18, 'Rose@gmail.com', 7044724835, 7, NULL, NULL, 1717265925571, 'Delivery', 'mega tunez', 'mega@gmail.com', NULL, NULL, NULL, 'complete', 'cash', 200.00, 500.00, '2024-06-01'),
(19, 'Rose@gmail.com', 7044724835, 7, NULL, NULL, 1717266003118, 'Delivery', NULL, NULL, NULL, NULL, NULL, 'incomplete', 'cash', 700.00, 500.00, '2024-06-01'),
(20, 'Rose@gmail.com', 7044724835, 7, NULL, NULL, 1717266482101, 'Delivery', 'mega tunez', 'mega@gmail.com', '305 old odukpani road', 'Cross River', 'Akamkpa', 'complete', 'cash', 700.00, 500.00, '2024-06-01'),
(21, 'tessy@gmail.com', 7044724835, 8, NULL, NULL, 1717266549965, 'Delivery', 'mega tunez', 'mega@gmail.com', '305 old odukpani road', 'Cross River', 'Calabar-Municipal', 'complete', 'cash', 6000.00, 500.00, '2024-06-01'),
(22, 'frr@gmail.com', 7044724835, 6, NULL, NULL, 1717266923336, 'Delivery', NULL, NULL, '305 old odukpani road', 'Cross River', 'Calabar-Municipal', 'incomplete', 'cash', 900.00, 500.00, '2024-06-01');

-- --------------------------------------------------------

--
-- Table structure for table `Order_Products`
--

CREATE TABLE `Order_Products` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `store_id` int(11) DEFAULT NULL,
  `cart_id` bigint(20) DEFAULT NULL,
  `sale_id` bigint(255) NOT NULL,
  `price_per_item` decimal(10,2) NOT NULL,
  `subTotal` decimal(10,2) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `status` varchar(255) DEFAULT 'sold',
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Order_Products`
--

INSERT INTO `Order_Products` (`id`, `product_id`, `store_id`, `cart_id`, `sale_id`, `price_per_item`, `subTotal`, `quantity`, `name`, `status`, `image`) VALUES
(1, 2, 1, NULL, 1717169022295, 700.00, 700.00, 1, 'derica tomato (tin) 210g', 'pending', 'image-1717166826917.avif'),
(2, 2, 1, NULL, 1717170851901, 700.00, 1400.00, 2, 'derica tomato (tin) 210g', 'pending', 'image-1717166826917.avif'),
(3, 3, 1, NULL, 1717170851901, 900.00, 900.00, 1, 'palm oil 1.5l', 'pending', 'image-1717170263511.webp'),
(4, 4, 1, NULL, 1717170851901, 6000.00, 6000.00, 1, 'Chicken', 'pending', 'image-1717170554521.JPG'),
(5, 1, NULL, 1717171111431, 1717171116758, 200.00, 200.00, 1, 'Sachet gino tomato paste (70g)', 'sold', 'image-1717166437908.avif'),
(6, 2, NULL, 1717171113545, 1717171116758, 700.00, 700.00, 1, 'derica tomato (tin) 210g', 'sold', 'image-1717166826917.avif'),
(7, 3, NULL, 1717171115974, 1717171116758, 900.00, 900.00, 1, 'palm oil 1.5l', 'sold', 'image-1717170263511.webp'),
(8, 4, 1, NULL, 1717185713919, 6000.00, 6000.00, 1, 'Chicken', 'pending', 'image-1717170554521.JPG'),
(9, 2, 1, NULL, 1717185713919, 700.00, 700.00, 1, 'derica tomato (tin) 210g', 'pending', 'image-1717166826917.avif'),
(10, 3, 1, NULL, 1717185713919, 900.00, 1800.00, 2, 'palm oil 1.5l', 'pending', 'image-1717170263511.webp'),
(11, 1, 1, NULL, 1717251877958, 200.00, 200.00, 1, 'Sachet gino tomato paste (70g)', 'pending', 'image-1717166437908.avif'),
(12, 1, 1, NULL, 1717257806528, 200.00, 200.00, 1, 'Sachet gino tomato paste (70g)', 'sold', 'image-1717166437908.avif'),
(13, 4, 1, NULL, 1717257874063, 6000.00, 12000.00, 2, 'Chicken', 'sold', 'image-1717170554521.JPG'),
(14, 11, 1, 1717258889398, 1717258915918, 150.00, 150.00, 1, 'gino (pepe & onion) 70g', 'sold', 'image-1717184998613.webp'),
(15, 9, 1, 1717258909651, 1717258915918, 200.00, 200.00, 1, 'okra', 'sold', 'image-1717184713957.avif'),
(16, 18, 1, 1717258912683, 1717258915918, 1000.00, 1000.00, 1, 'beef', 'sold', 'image-1717188116704.JPG'),
(17, 4, 1, 1717259671942, 1717259672550, 6000.00, 6000.00, 1, 'Chicken', 'sold', 'image-1717170554521.JPG'),
(18, 8, 1, NULL, 1717261459927, 200.00, 200.00, 1, 'crayfish', 'sold', 'image-1717184602527.webp'),
(19, 9, 1, NULL, 1717261459927, 200.00, 200.00, 1, 'okra', 'sold', 'image-1717184713957.avif'),
(20, 15, 1, NULL, 1717261459927, 130.00, 130.00, 1, 'tomato jos 65g', 'sold', 'image-1717187538826.webp'),
(21, 2, 1, NULL, 1717261766705, 700.00, 700.00, 1, 'derica tomato (tin) 210g', 'pending', 'image-1717166826917.avif'),
(22, 3, 1, NULL, 1717262066742, 900.00, 900.00, 1, 'palm oil 1.5l', 'sold', 'image-1717170263511.webp'),
(23, 9, 1, NULL, 1717263052665, 200.00, 400.00, 2, 'okra', 'sold', 'image-1717184713957.avif'),
(24, 8, 1, NULL, 1717263052665, 200.00, 200.00, 1, 'crayfish', 'sold', 'image-1717184602527.webp'),
(25, 7, 1, NULL, 1717263052665, 200.00, 200.00, 1, 'fufu', 'sold', 'image-1717184487958.webp'),
(26, 12, 1, NULL, 1717263052665, 100.00, 100.00, 1, 'onion (red)', 'sold', 'image-1717185165267.avif'),
(27, 3, 1, NULL, 1717263052665, 900.00, 900.00, 1, 'palm oil 1.5l', 'sold', 'image-1717170263511.webp'),
(28, 18, 1, NULL, 1717263052665, 1000.00, 1000.00, 1, 'beef', 'sold', 'image-1717188116704.JPG'),
(29, 1, 1, NULL, 1717264198040, 200.00, 200.00, 1, 'Sachet gino tomato paste (70g)', 'sold', 'image-1717166437908.avif'),
(30, 1, 1, NULL, 1717265458649, 200.00, 200.00, 1, 'Sachet gino tomato paste (70g)', 'sold', 'image-1717166437908.avif'),
(31, 2, 1, NULL, 1717265458649, 700.00, 700.00, 1, 'derica tomato (tin) 210g', 'sold', 'image-1717166826917.avif'),
(32, 5, 1, NULL, 1717265458649, 700.00, 700.00, 1, 'sonia tomato 400g (can)', 'sold', 'image-1717184130878.webp'),
(33, 2, 1, NULL, 1717265566807, 700.00, 700.00, 1, 'derica tomato (tin) 210g', 'sold', 'image-1717166826917.avif'),
(34, 3, 1, NULL, 1717265664769, 900.00, 900.00, 1, 'palm oil 1.5l', 'sold', 'image-1717170263511.webp'),
(35, 4, 1, NULL, 1717265741959, 6000.00, 6000.00, 1, 'Chicken', 'sold', 'image-1717170554521.JPG'),
(36, 3, 1, NULL, 1717265853915, 900.00, 900.00, 1, 'palm oil 1.5l', 'pending', 'image-1717170263511.webp'),
(37, 7, 1, NULL, 1717265903872, 200.00, 200.00, 1, 'fufu', 'pending', 'image-1717184487958.webp'),
(38, 1, 1, NULL, 1717265925571, 200.00, 200.00, 1, 'Sachet gino tomato paste (70g)', 'sold', 'image-1717166437908.avif'),
(39, 2, 1, NULL, 1717266003118, 700.00, 700.00, 1, 'derica tomato (tin) 210g', 'pending', 'image-1717166826917.avif'),
(40, 2, 1, NULL, 1717266482101, 700.00, 700.00, 1, 'derica tomato (tin) 210g', 'sold', 'image-1717166826917.avif'),
(41, 4, 1, NULL, 1717266549965, 6000.00, 6000.00, 1, 'Chicken', 'sold', 'image-1717170554521.JPG'),
(42, 3, 1, NULL, 1717266923336, 900.00, 900.00, 1, 'palm oil 1.5l', 'pending', 'image-1717170263511.webp');

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
(1, 'Attendant', 25000, 'Handle sales at the counter\r\n'),
(2, 'Logistics', 25000, 'make deliveries to customers');

-- --------------------------------------------------------

--
-- Table structure for table `Products`
--

CREATE TABLE `Products` (
  `id` int(11) NOT NULL,
  `ProductName` varchar(100) NOT NULL,
  `Brand_name` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `inventory_id` int(50) NOT NULL,
  `UnitPrice` decimal(10,2) DEFAULT NULL,
  `StockQuantity` int(100) NOT NULL,
  `total_in_pack` int(11) DEFAULT NULL,
  `total_on_shelf` int(11) DEFAULT NULL,
  `created_date` date NOT NULL,
  `activate` varchar(10) NOT NULL,
  `status` varchar(233) DEFAULT 'not-expired',
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Products`
--

INSERT INTO `Products` (`id`, `ProductName`, `Brand_name`, `category`, `category_id`, `inventory_id`, `UnitPrice`, `StockQuantity`, `total_in_pack`, `total_on_shelf`, `created_date`, `activate`, `status`, `image`) VALUES
(1, 'Sachet gino tomato paste (70g)', 'Gino', 'Food', 1, 1, 200.00, 2, 25, 45, '2024-05-31', 'yes', 'not-expired', 'image-1717166437908.avif'),
(2, 'derica tomato (tin) 210g', 'derica', 'Food', 1, 2, 700.00, 2, 25, 46, '2024-05-31', 'yes', 'not-expired', 'image-1717166826917.avif'),
(3, 'palm oil 1.5l', 'unknown', 'Food', 1, 3, 900.00, 1, 25, 21, '2024-05-31', 'yes', 'not-expired', 'image-1717170263511.webp'),
(4, 'Chicken', 'unknown', 'Food', 1, 4, 6000.00, 2, 5, 1, '2024-05-31', 'yes', 'not-expired', 'image-1717170554521.JPG'),
(5, 'sonia tomato 400g (can)', 'Sonia', 'Food', 1, 5, 700.00, 3, 16, 47, '2024-05-31', 'yes', 'not-expired', 'image-1717184130878.webp'),
(6, 'can gino tomato paste 2200g', 'Gino', 'Food', 1, 6, 1000.00, 3, 16, 48, '2024-05-31', 'yes', 'not-expired', 'image-1717184308920.jpeg'),
(7, 'fufu', 'unknown', 'Food', 1, 7, 200.00, 2, 12, 23, '2024-05-31', 'yes', 'not-expired', 'image-1717184487958.webp'),
(8, 'crayfish', 'unknown', 'Food', 1, 8, 200.00, 1, 150, 148, '2024-05-31', 'yes', 'not-expired', 'image-1717184602527.webp'),
(9, 'okra', 'okra', 'Food', 1, 9, 200.00, 3, 20, 56, '2024-05-31', 'yes', 'not-expired', 'image-1717184713957.avif'),
(10, 'gino tomato paste (tin) 400g', 'Gino', 'Food', 1, 10, 1200.00, 4, 12, 48, '2024-05-31', 'yes', 'not-expired', 'image-1717184818683.webp'),
(11, 'gino (pepe & onion) 70g', 'Gino', 'Food', 1, 11, 150.00, 100, 16, 1599, '2024-05-31', 'yes', 'not-expired', 'image-1717184998613.webp'),
(12, 'onion (red)', 'unknown', 'Food', 1, 12, 100.00, 5, 1, 4, '2024-05-31', 'yes', 'not-expired', 'image-1717185165267.avif'),
(13, 'Melon (Egusi)', 'unknown', 'Food', 1, 13, 700.00, 1, 30, 30, '2024-05-31', 'yes', 'not-expired', 'image-1717185342090.jpeg'),
(14, 'Melon Egusi (machine peeled)', 'unknown', 'Food', 1, 14, 600.00, 1, 40, 40, '2024-05-31', 'yes', 'not-expired', 'image-1717185641372.webp'),
(15, 'tomato jos 65g', 'unknown', 'Food', 1, 15, 130.00, 2, 16, 31, '2024-05-31', 'yes', 'not-expired', 'image-1717187538826.webp'),
(16, 'tasty tom tomato 70g', 'unknown', 'Food', 1, 16, 120.00, 2, 16, 32, '2024-05-31', 'yes', 'not-expired', 'image-1717187685013.avif'),
(17, 'plantain x3', 'unknown', 'Food', 1, 17, 250.00, 1, 12, 12, '2024-05-31', 'yes', 'not-expired', 'image-1717187823822.jpeg'),
(18, 'beef', 'unknown', 'Food', 1, 18, 1000.00, 2, 50, 98, '2024-05-31', 'yes', 'not-expired', 'image-1717188116704.JPG'),
(19, 'Pepperoni Bread', 'Pepperoni', 'Baked & Pastries', 9, 19, 1500.00, 1, 10, 10, '2024-05-31', 'yes', 'not-expired', 'image-1717188946677.JPG'),
(20, 'digestive', 'unknown ', 'Snacks and Confectioneries', 7, 20, 600.00, 2, 10, 20, '2024-05-31', 'yes', 'not-expired', 'image-1717189147674.JPG'),
(21, 'cornflakes', 'Kellogg\'s', 'Snacks and Confectioneries', 7, 21, 2500.00, 1, 15, 15, '2024-05-31', 'yes', 'not-expired', 'image-1717189304823.JPG'),
(22, 'cocopops', 'kallogg\'s', 'Snacks and Confectioneries', 7, 22, 1500.00, 1, 13, 13, '2024-05-31', 'yes', 'not-expired', 'image-1717189488225.JPG'),
(23, 'pringles (black peper)', 'Pringles', 'Snacks and Confectioneries', 7, 24, 4000.00, 1, 20, 20, '2024-05-31', 'yes', 'not-expired', 'image-1717189950109.JPG'),
(24, 'oreos o\'s', 'oreos', 'Snacks and Confectioneries', 7, 23, 4000.00, 1, 20, 20, '2024-05-31', 'yes', 'not-expired', 'image-1717189772815.JPG');

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
  `total_amount` decimal(10,2) NOT NULL,
  `shipping_fee` decimal(10,2) DEFAULT NULL,
  `Payment_type` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'unresolved'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Sales`
--

INSERT INTO `Sales` (`id`, `store_name`, `store_id`, `sale_type`, `sale_id`, `created_date`, `Discount_applied`, `attendant_id`, `total_amount`, `shipping_fee`, `Payment_type`, `status`) VALUES
(1, NULL, NULL, 'counter', 1717171116758, '2024-05-31', 0, '1', 1800.00, 0.00, 'Cash', 'resolved'),
(2, 'Branch A', 1, 'counter', 1717258915918, '2024-06-01', 0, '5', 1350.00, 0.00, 'Cash', 'resolved'),
(3, NULL, NULL, 'order', 1717257874063, '2024-06-01', 0, '0', 12000.00, 500.00, 'cash', 'resolved'),
(4, NULL, NULL, 'order', 1717257806528, '2024-06-01', 0, '0', 200.00, 500.00, 'cash', 'resolved'),
(5, 'Branch A', 1, 'counter', 1717259672550, '2024-06-01', 0, '5', 6000.00, 0.00, 'Cash', 'resolved'),
(6, NULL, NULL, 'order', 1717261459927, '2024-06-01', 0, '0', 530.00, 500.00, 'cash', 'resolved'),
(7, NULL, NULL, 'order', 1717262066742, '2024-06-01', 0, '0', 900.00, 500.00, 'cash', 'resolved'),
(8, NULL, NULL, 'order', 1717263052665, '2024-06-01', 0, '0', 2800.00, 500.00, 'cash', 'resolved'),
(9, NULL, NULL, 'order', 1717264198040, '2024-06-01', 0, '0', 200.00, 500.00, 'cash', 'resolved'),
(10, NULL, NULL, 'order', 1717265458649, '2024-06-01', 0, '0', 1600.00, 500.00, 'cash', 'resolved'),
(11, NULL, NULL, 'order', 1717265566807, '2024-06-01', 0, '0', 700.00, 500.00, 'cash', 'resolved'),
(12, NULL, NULL, 'order', 1717265664769, '2024-06-01', 0, '0', 900.00, 500.00, 'cash', 'resolved'),
(13, NULL, NULL, 'order', 1717265741959, '2024-06-01', 0, '0', 6000.00, 500.00, 'cash', 'resolved'),
(14, NULL, NULL, 'order', 1717265925571, '2024-06-01', 0, '0', 200.00, 500.00, 'cash', 'resolved'),
(15, NULL, NULL, 'order', 1717266549965, '2024-06-01', 0, '0', 6000.00, 500.00, 'cash', 'resolved'),
(16, NULL, NULL, 'order', 1717266482101, '2024-06-01', 0, '0', 700.00, 500.00, 'cash', 'resolved');

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
(1, 'Branch A', '305, old odukpani road', 'Cross River', 'Calabar-Municipal');

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
(1, 'Angela', 'Nandi', 'angelanandi@gmail.com', 810492208, '8 miles, MMHW, Calabarr', 'Agro-a corporations', '2024-05-31');

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
  `Phone` bigint(255) NOT NULL,
  `Address` varchar(250) DEFAULT NULL,
  `created_date` date NOT NULL,
  `Previous_visit` date NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'unverified',
  `spending` bigint(255) DEFAULT NULL,
  `userRole` varchar(244) NOT NULL DEFAULT 'user',
  `Password` varchar(255) NOT NULL,
  `state` varchar(255) DEFAULT NULL,
  `lga` varchar(255) DEFAULT NULL,
  `store_id` int(11) DEFAULT NULL,
  `store_name` varchar(255) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `salary` bigint(255) DEFAULT NULL,
  `position` varchar(255) DEFAULT NULL,
  `position_id` int(11) DEFAULT NULL,
  `land_mark` varchar(500) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Users`
--

INSERT INTO `Users` (`id`, `First_name`, `Last_name`, `email`, `Phone`, `Address`, `created_date`, `Previous_visit`, `status`, `spending`, `userRole`, `Password`, `state`, `lga`, `store_id`, `store_name`, `gender`, `salary`, `position`, `position_id`, `land_mark`, `image`) VALUES
(1, 'Michael', 'Adariku', 'adarikumichael@gmail.com', 9160209475, '305 old odukpani road', '2024-05-30', '2024-05-30', 'unverified', 0, 'super', '12345678Aa!', 'Cross River', 'Bekwarra', NULL, NULL, 'male', NULL, NULL, NULL, 'ikot ansa busstop', NULL),
(2, 'Michael', 'Adariku', 'gift@gmail.com', 7044724835, '305 old odukpani road', '2024-05-31', '2024-05-31', 'unverified', 0, 'user', '123456qwerTy', 'Cross River', 'Calabar-Municipal', NULL, NULL, 'female', NULL, NULL, NULL, 'ikot ansa busstop', NULL),
(3, 'Emmanuel', 'Osaha', 'emma@gmail.com', 7044724835, '305 old odukpani road', '2024-06-01', '2024-06-01', 'unverified', 4000, 'user', '11111111Qq', 'Cross River', 'Calabar-Municipal', NULL, NULL, 'male', NULL, NULL, 1, 'itu okon street', 'image-1717244638436.jpg'),
(4, 'mega', 'tunez', 'mega@gmail.com', 7044724835, NULL, '2024-06-01', '2024-06-01', 'unverified', 0, 'admin', '11111111Qq', NULL, NULL, 1, 'Branch A', NULL, 20000, 'Logistics', 2, NULL, NULL),
(5, 'vivian', 'john', 'vivianjohn@gmail.com', 7044724835, NULL, '2024-06-01', '2024-06-01', 'unverified', 0, 'admin', '11111111Qq', NULL, NULL, 1, 'Branch A', NULL, 20000, 'Attendant', 1, NULL, NULL),
(6, 'Francis', 'Adariku', 'frr@gmail.com', 7044724835, '305 old odukpani road', '2024-06-01', '2024-06-01', 'unverified', 11200, 'user', '111111Qq', 'Cross River', 'Calabar-Municipal', NULL, NULL, 'male', NULL, NULL, NULL, 'ikot ansa busstop', NULL),
(7, 'Rose', 'oko', 'Rose@gmail.com', 7044724835, '305 old odukpani road', '2024-06-01', '2024-06-01', 'unverified', 1900, 'user', '111111Qq', 'Cross River', 'Akamkpa', NULL, NULL, 'male', NULL, NULL, NULL, 'ikot ansa busstop', NULL),
(8, 'Tessy', 'Adariku', 'tessy@gmail.com', 7044724835, '305 old odukpani road', '2024-06-01', '2024-06-01', 'unverified', 6500, 'user', '111111Qq', 'Cross River', 'Calabar-Municipal', NULL, NULL, 'female', NULL, NULL, NULL, 'ikot ansa busstop', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Cart`
--
ALTER TABLE `Cart`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`);

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
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

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
  ADD KEY `CategoryID` (`inventory_id`),
  ADD KEY `category_id` (`category_id`);

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
-- AUTO_INCREMENT for table `Cart`
--
ALTER TABLE `Cart`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=904;

--
-- AUTO_INCREMENT for table `Category`
--
ALTER TABLE `Category`
  MODIFY `CategoryID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `Damaged`
--
ALTER TABLE `Damaged`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Discount`
--
ALTER TABLE `Discount`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `inventory`
--
ALTER TABLE `inventory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `Orders`
--
ALTER TABLE `Orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `Order_Products`
--
ALTER TABLE `Order_Products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `Positions`
--
ALTER TABLE `Positions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `Products`
--
ALTER TABLE `Products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `Sales`
--
ALTER TABLE `Sales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `Stores`
--
ALTER TABLE `Stores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `Suppliers`
--
ALTER TABLE `Suppliers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `Transactions`
--
ALTER TABLE `Transactions`
  MODIFY `TransactionID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Users`
--
ALTER TABLE `Users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Cart`
--
ALTER TABLE `Cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`),
  ADD CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `Products` (`id`);

--
-- Constraints for table `inventory`
--
ALTER TABLE `inventory`
  ADD CONSTRAINT `inventory_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `Category` (`CategoryID`);

--
-- Constraints for table `Products`
--
ALTER TABLE `Products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `Category` (`CategoryID`);

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
