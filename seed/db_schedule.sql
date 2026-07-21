-- phpMyAdmin SQL Dump
-- version 5.2.3deb1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jul 20, 2026 at 05:57 AM
-- Server version: 8.4.10-0ubuntu0.26.04.1
-- PHP Version: 8.5.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_schedule`
--

-- --------------------------------------------------------

--
-- Table structure for table `tb_employees`
--

CREATE TABLE `tb_employees` (
  `em_id` int UNSIGNED NOT NULL,
  `em_username` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `em_password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `em_email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `em_full_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `em_position` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `em_department` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `em_phone` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `em_status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tb_employees`
--

INSERT INTO `tb_employees` (`em_id`, `em_username`, `em_password_hash`, `em_email`, `em_full_name`, `em_position`, `em_department`, `em_phone`, `em_status`, `created_at`) VALUES
(1, 'admin', '$2y$12$/ExUK83EhcVMEq4kQ5sADuE0XA0IQZ6BpVD9oigMiSfQbmdDj3Jk2', 'admin@example.com', 'ผู้ดูแลระบบ (Administrator)', 'Software Engineer', 'IT Department', '123-456-7890', 'active', '2024-06-28 13:04:16'),
(2, 'asmith', '$2y$10$eW5JTI7TfJ10u5e7CZI8xeU6e1ZOBdVw/ZFV12hq2TbO.qs.xIhU2', 'asmith@example.com', 'Alice Smith', 'HR Manager', 'HR Department', '098-765-4321', 'inactive', '2024-06-28 13:04:16'),
(3, 'bmiller', '$2y$10$eW5JTI7TfJ10u5e7CZI8xeU6e1ZOBdVw/ZFV12hq2TbO.qs.xIhU2', 'bmiller@example.com', 'Bob Miller', 'Marketing Director', 'Marketing Department', '555-123-4567', 'active', '2024-06-28 13:04:16');

-- --------------------------------------------------------

--
-- Table structure for table `tb_programs`
--

CREATE TABLE `tb_programs` (
  `id` int UNSIGNED NOT NULL,
  `program_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `producer_type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `company_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `program_type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `broadcast_start` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `broadcast_end` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `summary` text COLLATE utf8mb4_unicode_ci,
  `rating_color` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contract_status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tb_programs`
--

INSERT INTO `tb_programs` (`id`, `program_name`, `producer_type`, `company_name`, `program_type`, `broadcast_start`, `broadcast_end`, `summary`, `rating_color`, `contract_status`, `created_at`) VALUES
(1, 'มุสลิมไทม์', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(2, 'สยามโสภา', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(3, 'วีถีธรรมวิถีไทย', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(4, 'วิชาฟาร์มรู้', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(5, 'Show me your kid', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(6, 'ซุปตาคิดส์ ติดดาว', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(7, 'ข่าวเด่น เช้านี้', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(8, 'เปิดเกมส์', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(9, 'ตี๋อ้วนชวนหิว', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(10, 'ทันข่าว', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(11, 'ล่องสราญจานสง่า', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(12, 'สบาย สไตล์ มยุรา', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(13, 'วาไรตี้ 4 ภาค', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(14, 'True Shoping', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(15, 'แซดทีวี', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(16, 'อัพเดท ไทนแลนด์', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(17, 'ที่นี่ชายแดนใต้', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(18, 'เอ็มเอ็มเอ็ม แมกกาซีน ออน แอร์', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(19, 'Race Society', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(20, 'บันทึกท่องเที่ยว', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(21, 'เกษตรช่อง 5 พัฒนาชุมชน', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(22, 'กอ.รมน.เพื่อประชาชน', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(23, 'กีฬากรุงเทพ', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(24, 'เพื่อประชาชน', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(25, 'ศึกท่อน้ำไทย TKO', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(26, 'ข่าวในพระราชสำนัก', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(27, 'ก้าวเพื่อชัยชนะ', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(28, 'ชิบเชื่อมโลก', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(29, 'จอย เดย์', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(30, 'ประเด็นสุดสัปดาห์', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(31, 'แอทไทม์', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(32, 'สารคดีโลกอัศจรรย์', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(33, 'ปิดสถานี', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(34, 'แผ่นดินธรรม', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(35, 'ข่าวเด่นเช้านี้', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(36, 'วงจรกีฬา', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(37, 'เช้านี้ประเทศไทย', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(38, 'Talk together', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(39, 'ละครพื้นบ้าน ปลาบู่ทอง/อุทัยเทวี', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(40, 'พลังงานไทยใหญ่อุดม SME มีให้ดู', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(41, 'ช่อง 5 รวมใจฟังชัดๆ ถนอมจัดให้', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(42, 'เกษตรไดเร็ค', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(43, 'เที่ยงวัน', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(44, 'สนามเป้าบรรเทาทุกข์', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(45, 'เปิดฟ้า', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(46, 'คุยกับช่าง', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(47, 'ทหารช่วยได้', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(48, 'ซีรีส์จีน', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(49, 'สนทนาปัญหาสุขภาพ', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(50, 'สารคดีเฉลิมพระเกียรติ 72 พรรษา', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(51, 'ข่าวเด่นทันสถานการณ์', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(52, 'วีอาร์โซลเยอร์', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(53, 'เกษตรไดเร็็ค', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(54, 'สารคดีโลกอัศจรรย์(re)', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(55, 'ชุมชนแชมเปี้ยน', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(56, 'Auto like TV', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(57, 'แชร์ยิ้มอิ่มบุญ', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(58, 'เดอะไดอารี่ มีดีที่เดินทาง', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(59, 'ทหาช่วยได้', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(60, 'รัชกับดุ๊กออนทัวร์', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(61, 'แต้มต่อ', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(62, 'สี่แผ่นดิน', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(63, 'พ่อมดรถยนต์', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(64, 'ไดร์ฟ แอนด์ไรด์ ขับขี่ด้วยกัน', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(65, '5 Minutes Mission Reels', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(66, 'อินไซด์อีสปอร์ต', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(67, 'แมกมอเตอร์', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(68, 'อินโนไลฟ์ เปิดความคิด สะกิดไอเดีย', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(69, 'ร้อยเรื่องราว วาไรตี้', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(70, 'อาสาพาสุข', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(71, 'ละครเยาวชน', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(72, 'Muay Thai Patong Fight Night', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(73, 'มอเตอร์รันนิ่ง', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(74, 'สุขแบบไทยใจพอเพียง', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(75, 'แฮปปี้ซีซัน ฤดูแห่งความสุข', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(76, 'คืนคุณให้แผ่นดิน', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(77, 'คนเปลี่ยนโลก', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(78, 'ไทยลาวภูเก็ตเตอร์', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(79, 'สร้างฝันเพิ่อสันติสุข', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(80, 'หมุนตามโลก', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(81, 'คิดดีแลนด์', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(82, 'Top of Thai', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(83, 'ส่องธรรม', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(84, 'เลิกบุหรีดีต่อใจ ปี 6', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(85, 'เดอะ พีเพิลโชว์สด', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(86, 'คินไทยหัวใจไม่ท้อ', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(87, 'กู๊ด เดย์', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(88, 'เฉลิมพระเกียรติ \"น้ำพระไทยในหลวง\"', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(89, 'อาสาหาเรื่องน่ารู้', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(90, 'วีลเจอร์นี่', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(91, '@Time \"It okay to be different\"', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(92, '5 บ่ายรอบรู้', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(93, 'UP TO โยม', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(94, 'สึกกำปั้น มวยไทยสะท้านโลก', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(95, 'ครอบครัวเดียวกัน', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(96, 'ข่าวเด่น ทันสถานการณ์', 'tv5hd', '', 'other', '2024-01-01', '2024-12-31', 'ข่าวประจำวัน ', 'green', 'success', '2024-07-03 11:17:32'),
(97, 'ฮอลลีวู๊ดซีรีส์', '', '', '', '', '', '', '', '', '2024-07-03 11:17:32'),
(98, 'ออโต้มอเตอร์', 'producer', 'ออโต้ บิสซิเนสเวิร์ค', 'renttime', '2024-01-01', '2024-12-31', 'ให้ความรู้เกี่ยวกับ รถยนต์ และเทคโนโลยีเครื่องยนต์ใหม่ๆ', 'yellow', 'success', '2024-07-03 11:17:32'),
(99, 'ทดสอบ (ชื่อรายการ)', 'producer', 'ทดสอบ (ชื่อบริษัท) 3', 'revenuesharing', '2027-07-03', '2030-12-03', 'ไม่มี', 'red', 'success', '2024-07-03 14:11:29');

-- --------------------------------------------------------

--
-- Table structure for table `tv_program_schedule`
--

CREATE TABLE `tv_program_schedule` (
  `id` int UNSIGNED NOT NULL,
  `program_id` int UNSIGNED NOT NULL,
  `day` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `time_start` int NOT NULL,
  `time_end` int NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tb_employees`
--
ALTER TABLE `tb_employees`
  ADD PRIMARY KEY (`em_id`),
  ADD UNIQUE KEY `uq_tb_employees_email` (`em_email`),
  ADD UNIQUE KEY `uq_tb_employees_username` (`em_username`);

--
-- Indexes for table `tb_programs`
--
ALTER TABLE `tb_programs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tv_program_schedule`
--
ALTER TABLE `tv_program_schedule`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_tv_program_schedule_day` (`day`),
  ADD KEY `idx_tv_program_schedule_program_id` (`program_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tb_employees`
--
ALTER TABLE `tb_employees`
  MODIFY `em_id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tb_programs`
--
ALTER TABLE `tb_programs`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=100;

--
-- AUTO_INCREMENT for table `tv_program_schedule`
--
ALTER TABLE `tv_program_schedule`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tv_program_schedule`
--
ALTER TABLE `tv_program_schedule`
  ADD CONSTRAINT `fk_tv_program_schedule_program` FOREIGN KEY (`program_id`) REFERENCES `tb_programs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
