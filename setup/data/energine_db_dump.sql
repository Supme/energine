SET FOREIGN_KEY_CHECKS=0;

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";

SET AUTOCOMMIT=0;
START TRANSACTION;


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Table structure for table `image_photo_gallery`
--

DROP TABLE IF EXISTS `image_photo_gallery`;
CREATE TABLE IF NOT EXISTS `image_photo_gallery` (
  `pg_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `smap_id` int(10) unsigned NOT NULL DEFAULT '0',
  `pg_thumb_img` varchar(250) NOT NULL DEFAULT '',
  `pg_photo_img` varchar(200) NOT NULL DEFAULT '',
  `pg_order_num` int(10) unsigned DEFAULT '1',
  PRIMARY KEY (`pg_id`),
  KEY `smap_id` (`smap_id`),
  KEY `pg_photo_img` (`pg_photo_img`),
  KEY `pg_order_num` (`pg_order_num`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=15 ;

--
-- Dumping data for table `image_photo_gallery`
--

INSERT INTO `image_photo_gallery` (`pg_id`, `smap_id`, `pg_thumb_img`, `pg_photo_img`, `pg_order_num`) VALUES
(11, 350, '', 'uploads/public/12665704674248.gif', 3),
(12, 350, '', 'uploads/public/12665745065727.gif', 2),
(13, 350, 'uploads/public/12671938143931.jpg', 'uploads/public/12671938143931.jpg', 1);

-- --------------------------------------------------------

--
-- Table structure for table `image_photo_gallery_translation`
--

DROP TABLE IF EXISTS `image_photo_gallery_translation`;
CREATE TABLE IF NOT EXISTS `image_photo_gallery_translation` (
  `pg_id` int(11) unsigned NOT NULL DEFAULT '0',
  `lang_id` int(11) unsigned NOT NULL DEFAULT '0',
  `pg_title` varchar(250) DEFAULT NULL,
  `pg_text` text,
  PRIMARY KEY (`pg_id`,`lang_id`),
  KEY `lang_id` (`lang_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `image_photo_gallery_translation`
--

INSERT INTO `image_photo_gallery_translation` (`pg_id`, `lang_id`, `pg_title`, `pg_text`) VALUES
(11, 1, 'Структура классов ядра Energine', NULL),
(11, 2, 'Структура классов ядра Energine', NULL),
(11, 3, 'Energine''s class structure ', NULL),
(12, 1, 'Опять слонопотам', NULL),
(12, 2, 'Слонопотам', NULL),
(12, 3, 'Heffalump', NULL),
(13, 1, 'Танцующий слонопотам', 'То еще зрелище'),
(13, 2, NULL, NULL),
(13, 3, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `share_access_level`
--

DROP TABLE IF EXISTS `share_access_level`;
CREATE TABLE IF NOT EXISTS `share_access_level` (
  `smap_id` int(10) unsigned NOT NULL DEFAULT '0',
  `group_id` int(10) unsigned NOT NULL DEFAULT '0',
  `right_id` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`smap_id`,`group_id`,`right_id`),
  KEY `group_id` (`group_id`),
  KEY `right_id` (`right_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `share_access_level`
--

INSERT INTO `share_access_level` (`smap_id`, `group_id`, `right_id`) VALUES
(7, 1, 3),
(80, 1, 3),
(324, 1, 3),
(327, 1, 3),
(329, 1, 3),
(330, 1, 3),
(331, 1, 3),
(336, 1, 3),
(337, 1, 3),
(350, 1, 3),
(351, 1, 1),
(352, 1, 3),
(353, 1, 3),
(354, 1, 3),
(355, 1, 3),
(356, 1, 3),
(381, 1, 3),
(383, 1, 3),
(388, 1, 3),
(389, 1, 3),
(390, 1, 3),
(391, 1, 3),
(392, 1, 3),
(393, 1, 3),
(394, 1, 3),
(395, 1, 3),
(396, 1, 3),
(397, 1, 3),
(80, 3, 1),
(324, 3, 1),
(327, 3, 1),
(329, 3, 1),
(330, 3, 1),
(331, 3, 1),
(336, 3, 1),
(350, 3, 1),
(351, 3, 1),
(352, 3, 1),
(388, 3, 1),
(389, 3, 1),
(390, 3, 1),
(391, 3, 1),
(392, 3, 1),
(393, 3, 1),
(394, 3, 1),
(395, 3, 1),
(396, 3, 1),
(80, 4, 1),
(324, 4, 1),
(327, 4, 1),
(329, 4, 1),
(330, 4, 1),
(331, 4, 2),
(336, 4, 1),
(350, 4, 1),
(351, 4, 1),
(352, 4, 1),
(388, 4, 1),
(389, 4, 1),
(390, 4, 1),
(391, 4, 1),
(392, 4, 1),
(393, 4, 1),
(394, 4, 1),
(395, 4, 1),
(396, 4, 1);

-- --------------------------------------------------------

--
-- Table structure for table `share_feedback`
--

DROP TABLE IF EXISTS `share_feedback`;
CREATE TABLE IF NOT EXISTS `share_feedback` (
  `feed_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `feed_date` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `feed_email` varchar(200) NOT NULL DEFAULT '',
  `feed_author` varchar(250) DEFAULT NULL,
  `feed_text` text NOT NULL,
  PRIMARY KEY (`feed_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- Dumping data for table `share_feedback`
--


-- --------------------------------------------------------

--
-- Table structure for table `share_languages`
--

DROP TABLE IF EXISTS `share_languages`;
CREATE TABLE IF NOT EXISTS `share_languages` (
  `lang_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `lang_abbr` varchar(2) NOT NULL DEFAULT '',
  `lang_name` varchar(20) NOT NULL DEFAULT '',
  `lang_default` tinyint(1) NOT NULL DEFAULT '0',
  `lang_order_num` int(10) unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`lang_id`),
  KEY `idx_abbr` (`lang_abbr`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4 ;

--
-- Dumping data for table `share_languages`
--

INSERT INTO `share_languages` (`lang_id`, `lang_abbr`, `lang_name`, `lang_default`, `lang_order_num`) VALUES
(1, 'ru', 'Русский', 1, 1),
(2, 'ua', 'Українська', 0, 2),
(3, 'en', 'English', 0, 3);

-- --------------------------------------------------------

--
-- Table structure for table `share_lang_tags`
--

DROP TABLE IF EXISTS `share_lang_tags`;
CREATE TABLE IF NOT EXISTS `share_lang_tags` (
  `ltag_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ltag_name` varchar(70) NOT NULL DEFAULT '',
  PRIMARY KEY (`ltag_id`),
  UNIQUE KEY `ltag_name` (`ltag_name`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=589 ;

--
-- Dumping data for table `share_lang_tags`
--

INSERT INTO `share_lang_tags` (`ltag_id`, `ltag_name`) VALUES
(493, 'BTN_ACTIVATE'),
(43, 'BTN_ADD'),
(313, 'BTN_ADD_DIR'),
(446, 'BTN_ADD_FILE'),
(426, 'BTN_ADD_NEWS'),
(57, 'BTN_ADD_PAGE'),
(495, 'BTN_ADD_PHOTO'),
(563, 'BTN_ADD_TO_BASKET'),
(464, 'BTN_ALIGN_CENTER'),
(465, 'BTN_ALIGN_JUSTIFY'),
(462, 'BTN_ALIGN_LEFT'),
(463, 'BTN_ALIGN_RIGHT'),
(327, 'BTN_APPLY_FILTER'),
(457, 'BTN_BOLD'),
(347, 'BTN_CANCEL'),
(55, 'BTN_CHANGE'),
(134, 'BTN_CLOSE'),
(47, 'BTN_DELETE'),
(428, 'BTN_DELETE_NEWS'),
(59, 'BTN_DELETE_PAGE'),
(497, 'BTN_DELETE_PHOTO'),
(448, 'BTN_DEL_FILE'),
(323, 'BTN_DIV_EDITOR'),
(546, 'BTN_DOWN'),
(46, 'BTN_EDIT'),
(56, 'BTN_EDIT_MODE'),
(427, 'BTN_EDIT_NEWS'),
(58, 'BTN_EDIT_PAGE'),
(496, 'BTN_EDIT_PHOTO'),
(466, 'BTN_FILE_LIBRARY'),
(357, 'BTN_FILE_REPOSITORY'),
(214, 'BTN_GO'),
(573, 'BTN_GO_BASKET'),
(459, 'BTN_HREF'),
(169, 'BTN_IMAGELIB'),
(171, 'BTN_IMAGE_MANAGER'),
(168, 'BTN_INSERT'),
(161, 'BTN_INSERT_IMAGE'),
(458, 'BTN_ITALIC'),
(489, 'BTN_LANG_EDITOR'),
(260, 'BTN_LOAD'),
(79, 'BTN_LOGIN'),
(15, 'BTN_LOGOUT'),
(251, 'BTN_MOVE_DOWN'),
(250, 'BTN_MOVE_UP'),
(461, 'BTN_OL'),
(312, 'BTN_OPEN'),
(572, 'BTN_ORDER'),
(525, 'BTN_PARAMS_LIST'),
(542, 'BTN_PRINT'),
(571, 'BTN_RECOUNT'),
(54, 'BTN_REGISTER'),
(314, 'BTN_RENAME'),
(45, 'BTN_RETURN_LIST'),
(491, 'BTN_ROLE_EDITOR'),
(42, 'BTN_SAVE'),
(330, 'BTN_SAVE_GO'),
(284, 'BTN_SEARCH'),
(237, 'BTN_SELECT'),
(269, 'BTN_SEND'),
(74, 'BTN_SET_RIGHTS'),
(62, 'BTN_SET_ROLE'),
(543, 'BTN_SHOW_PARAMS'),
(324, 'BTN_TMPL_EDITOR'),
(381, 'BTN_TRANS_EDITOR'),
(460, 'BTN_UL'),
(545, 'BTN_UP'),
(346, 'BTN_UPDATE'),
(490, 'BTN_USER_EDITOR'),
(157, 'BTN_VIEW'),
(60, 'BTN_VIEWMODESWITCHER'),
(61, 'BTN_VIEWSOURCE'),
(587, 'BTN_VIEW_DETAILS'),
(365, 'BTN_VIEW_PROFILE'),
(469, 'BTN_ZIP_UPLOAD'),
(422, 'DUMMY_EMAIL'),
(170, 'ERR_403'),
(96, 'ERR_404'),
(376, 'ERR_BAD_LOGIN'),
(468, 'ERR_BAD_URL'),
(65, 'ERR_CANT_DELETE_YOURSELF'),
(383, 'ERR_CANT_MOVE'),
(263, 'ERR_DATABASE_ERROR'),
(339, 'ERR_DEFAULT_GROUP'),
(389, 'ERR_DEV_NO_DATA'),
(303, 'ERR_NOT_UNIQUE_DATA'),
(544, 'ERR_NO_DIV_NAME'),
(295, 'ERR_NO_U_NAME'),
(569, 'FIELD_BASKET_COUNT'),
(372, 'FIELD_CHANGE_U_PASSWORD'),
(373, 'FIELD_CHANGE_U_PASSWORD2'),
(514, 'FIELD_CURR_ABBR'),
(515, 'FIELD_CURR_FORMAT'),
(559, 'FIELD_CURR_IS_MAIN'),
(512, 'FIELD_CURR_NAME'),
(513, 'FIELD_CURR_RATE'),
(437, 'FIELD_FEED_AUTHOR'),
(442, 'FIELD_FEED_DATE'),
(438, 'FIELD_FEED_EMAIL'),
(436, 'FIELD_FEED_TEXT'),
(67, 'FIELD_GROUP_DEFAULT'),
(340, 'FIELD_GROUP_DEFAULT_RIGHTS'),
(63, 'FIELD_GROUP_ID'),
(66, 'FIELD_GROUP_NAME'),
(68, 'FIELD_GROUP_USER_DEFAULT'),
(172, 'FIELD_IMG_ALIGN'),
(167, 'FIELD_IMG_ALTTEXT'),
(159, 'FIELD_IMG_DESCRIPTION'),
(162, 'FIELD_IMG_FILENAME'),
(158, 'FIELD_IMG_FILENAME_IMG'),
(164, 'FIELD_IMG_HEIGHT'),
(165, 'FIELD_IMG_HSPACE'),
(500, 'FIELD_IMG_MARGIN_BOTTOM'),
(501, 'FIELD_IMG_MARGIN_LEFT'),
(502, 'FIELD_IMG_MARGIN_RIGHT'),
(503, 'FIELD_IMG_MARGIN_TOP'),
(160, 'FIELD_IMG_THUMBNAIL_IMG'),
(166, 'FIELD_IMG_VSPACE'),
(163, 'FIELD_IMG_WIDTH'),
(69, 'FIELD_LANG_ABBR'),
(71, 'FIELD_LANG_DEFAULT'),
(70, 'FIELD_LANG_NAME'),
(73, 'FIELD_LANG_WIN_CODE'),
(305, 'FIELD_LTAG_DESCRIPTION'),
(49, 'FIELD_LTAG_NAME'),
(14, 'FIELD_LTAG_VALUE'),
(109, 'FIELD_LTAG_VALUE_RTF'),
(393, 'FIELD_NEWS_ANNOUNCE_RTF'),
(392, 'FIELD_NEWS_DATE'),
(394, 'FIELD_NEWS_TEXT_RTF'),
(391, 'FIELD_NEWS_TITLE'),
(367, 'FIELD_NEW_PASSWORD'),
(588, 'FIELD_ORDER_COMMENT'),
(585, 'FIELD_ORDER_CREATED'),
(579, 'FIELD_ORDER_DELIVERY_COMMENT'),
(584, 'FIELD_OS_ID'),
(519, 'FIELD_OS_NAME'),
(485, 'FIELD_PG_PHOTO_IMG'),
(483, 'FIELD_PG_TEXT'),
(498, 'FIELD_PG_THUMB_IMG'),
(484, 'FIELD_PG_TITLE'),
(547, 'FIELD_PPV_VALUE'),
(526, 'FIELD_PP_NAME'),
(527, 'FIELD_PP_TYPE'),
(537, 'FIELD_PRODUCER_ID'),
(521, 'FIELD_PRODUCER_NAME'),
(522, 'FIELD_PRODUCER_SEGMENT'),
(534, 'FIELD_PRODUCT_CODE'),
(536, 'FIELD_PRODUCT_COUNT'),
(541, 'FIELD_PRODUCT_DESCRIPTION_RTF'),
(532, 'FIELD_PRODUCT_NAME'),
(535, 'FIELD_PRODUCT_PRICE'),
(533, 'FIELD_PRODUCT_SEGMENT'),
(540, 'FIELD_PRODUCT_SHORT_DESCRIPTION_RTF'),
(568, 'FIELD_PRODUCT_SUMM'),
(531, 'FIELD_PS_ID'),
(517, 'FIELD_PS_IS_DEFAULT'),
(516, 'FIELD_PS_NAME'),
(539, 'FIELD_PT_ID'),
(524, 'FIELD_PT_NAME'),
(265, 'FIELD_REMEMBER_LOGIN'),
(518, 'FIELD_RIGHT_ID'),
(127, 'FIELD_SMAP_DEFAULT'),
(130, 'FIELD_SMAP_DESCRIPTION_RTF'),
(384, 'FIELD_SMAP_HTML_TITLE'),
(236, 'FIELD_SMAP_ID'),
(128, 'FIELD_SMAP_IS_DISABLED'),
(126, 'FIELD_SMAP_IS_FINAL'),
(300, 'FIELD_SMAP_LINK_ID'),
(133, 'FIELD_SMAP_META_DESCRIPTION'),
(131, 'FIELD_SMAP_META_KEYWORDS'),
(129, 'FIELD_SMAP_NAME'),
(125, 'FIELD_SMAP_ORDER_NUM'),
(122, 'FIELD_SMAP_PID'),
(467, 'FIELD_SMAP_REDIRECT_URL'),
(123, 'FIELD_SMAP_SEGMENT'),
(329, 'FIELD_TAGS'),
(348, 'FIELD_TEXTBLOCK_SOURCE'),
(77, 'FIELD_TMPL_CONTENT'),
(494, 'FIELD_TMPL_ICON'),
(124, 'FIELD_TMPL_ID'),
(78, 'FIELD_TMPL_IS_SYSTEM'),
(76, 'FIELD_TMPL_LAYOUT'),
(75, 'FIELD_TMPL_NAME'),
(444, 'FIELD_UPL_FILE'),
(336, 'FIELD_UPL_NAME'),
(397, 'FIELD_UPL_PATH'),
(368, 'FIELD_U_ADDRESS'),
(487, 'FIELD_U_AVATAR_PRFILE'),
(486, 'FIELD_U_FULLNAME'),
(506, 'FIELD_U_GROUP'),
(277, 'FIELD_U_ID'),
(492, 'FIELD_U_IS_ACTIVE'),
(345, 'FIELD_U_MAIN_PHONE'),
(50, 'FIELD_U_NAME'),
(52, 'FIELD_U_PASSWORD'),
(53, 'FIELD_U_PASSWORD2'),
(470, 'FIELD_ZIP_FILE'),
(556, 'MSG_BAD_CURR_ABBR'),
(144, 'MSG_BAD_EMAIL_FORMAT'),
(146, 'MSG_BAD_FLOAT_FORMAT'),
(178, 'MSG_BAD_FORMAT'),
(145, 'MSG_BAD_PHONE_FORMAT'),
(179, 'MSG_BAD_USER_NAME_FORMAT'),
(154, 'MSG_CONFIRM_DELETE'),
(499, 'MSG_DELETE_FILE'),
(343, 'MSG_EMPTY_SEARCH_RESULT'),
(136, 'MSG_FIELD_IS_NOT_NULL'),
(447, 'MSG_NO_ATTACHED_FILES'),
(261, 'MSG_NO_FILE'),
(578, 'MSG_ORDER_FAILED'),
(296, 'MSG_PASSWORD_SENT'),
(374, 'MSG_PWD_MISMATCH'),
(424, 'MSG_REQUEST_SENT'),
(331, 'MSG_START_EDITING'),
(558, 'MSG_SWITCHER_TIP'),
(445, 'TAB_ATTACHED_FILES'),
(510, 'TAB_PAGE_RIGHTS'),
(538, 'TAB_PRODUCT_PARAMS'),
(320, 'TXT_ACCESS_EDIT'),
(319, 'TXT_ACCESS_FULL'),
(321, 'TXT_ACCESS_READ'),
(456, 'TXT_ADDRESS'),
(549, 'TXT_ADD_MANUFACTURER'),
(508, 'TXT_AFTER_SAVE_ACTION'),
(173, 'TXT_ALIGN_BOTTOM'),
(176, 'TXT_ALIGN_LEFT'),
(174, 'TXT_ALIGN_MIDDLE'),
(177, 'TXT_ALIGN_RIGHT'),
(175, 'TXT_ALIGN_TOP'),
(564, 'TXT_ANOTHER_PRODUCTS'),
(429, 'TXT_BACK_TO_LIST'),
(302, 'TXT_BAD_SEGMENT_FORMAT'),
(566, 'TXT_BASKET_CONTENTS'),
(567, 'TXT_BASKET_EMPTY'),
(565, 'TXT_BASKET_SUMM'),
(570, 'TXT_BASKET_SUMM2'),
(505, 'TXT_BODY_REGISTER'),
(294, 'TXT_BODY_RESTORE_PASSWORD'),
(421, 'TXT_CLOSE_FIELD'),
(432, 'TXT_CONTACTS'),
(419, 'TXT_CONTACTS_TITLE'),
(560, 'TXT_CURRENCY_RATE'),
(82, 'TXT_DETAIL_INFO'),
(507, 'TXT_DIVISIONS'),
(238, 'TXT_DIVISION_EDITOR'),
(121, 'TXT_DIV_EDITOR'),
(205, 'TXT_DOWNLOAD_FILE'),
(112, 'TXT_EDIT_ITEM'),
(371, 'TXT_ENTER_PASSWORD'),
(64, 'TXT_ERRORS'),
(443, 'TXT_FEEDBACKLIST'),
(440, 'TXT_FEEDBACK_SUCCESS_SEND'),
(396, 'TXT_FILELIBRARY'),
(326, 'TXT_FILTER'),
(297, 'TXT_FORGOT_PWD'),
(450, 'TXT_H1'),
(451, 'TXT_H2'),
(452, 'TXT_H3'),
(453, 'TXT_H4'),
(454, 'TXT_H5'),
(455, 'TXT_H6'),
(344, 'TXT_HOME'),
(255, 'TXT_IMAGE_LIBRARY'),
(279, 'TXT_LANGUAGE_EDITOR'),
(471, 'TXT_MONTH_1'),
(480, 'TXT_MONTH_10'),
(481, 'TXT_MONTH_11'),
(482, 'TXT_MONTH_12'),
(472, 'TXT_MONTH_2'),
(473, 'TXT_MONTH_3'),
(474, 'TXT_MONTH_4'),
(475, 'TXT_MONTH_5'),
(476, 'TXT_MONTH_6'),
(477, 'TXT_MONTH_7'),
(478, 'TXT_MONTH_8'),
(479, 'TXT_MONTH_9'),
(156, 'TXT_NO_RIGHTS'),
(420, 'TXT_OPEN_FIELD'),
(548, 'TXT_OR'),
(83, 'TXT_ORDER'),
(586, 'TXT_ORDERHISTORY'),
(581, 'TXT_ORDER_CLIENT_MAIL_BODY'),
(576, 'TXT_ORDER_CLIENT_SUBJECT'),
(580, 'TXT_ORDER_FORM'),
(583, 'TXT_ORDER_MANAGER_MAIL_BODY'),
(575, 'TXT_ORDER_MANAGER_SUBJECT'),
(582, 'TXT_ORDER_NEW_CLIENT_MAIL_BODY'),
(574, 'TXT_ORDER_SEND'),
(216, 'TXT_PAGES'),
(529, 'TXT_PARAM_TYPE_INT'),
(528, 'TXT_PARAM_TYPE_STRING'),
(530, 'TXT_PARAM_TYPE_TEXT'),
(385, 'TXT_PREVIEW'),
(520, 'TXT_PRODUCEREDITOR'),
(523, 'TXT_PRODUCTTYPEEDITOR'),
(561, 'TXT_PRODUCT_PARAMS'),
(562, 'TXT_PRODUCT_PRICE'),
(81, 'TXT_PROPERTIES'),
(135, 'TXT_REGISTRATION_SUCCESS'),
(439, 'TXT_REQUIRED_FIELDS'),
(449, 'TXT_RESET'),
(328, 'TXT_RESET_FILTER'),
(341, 'TXT_ROLE_DIV_RIGHTS'),
(274, 'TXT_ROLE_EDITOR'),
(488, 'TXT_ROLE_TEXT'),
(511, 'TXT_SEARCH_CATALOGUE'),
(342, 'TXT_SEARCH_RESULT'),
(143, 'TXT_SHIT_HAPPENS'),
(431, 'TXT_SITEMAP'),
(504, 'TXT_SUBJ_REGISTER'),
(293, 'TXT_SUBJ_RESTORE_PASSWORD'),
(80, 'TXT_SUCCESS'),
(186, 'TXT_TEMPLATE_EDITOR'),
(322, 'TXT_THUMB'),
(273, 'TXT_USER_EDITOR'),
(287, 'TXT_USER_GREETING'),
(304, 'TXT_USER_GROUPS'),
(286, 'TXT_USER_NAME'),
(325, 'TXT_USER_PROFILE_SAVED'),
(375, 'TXT_USER_PROFILE_WRONG_PWD'),
(441, 'TXT_USER_REGISTRED'),
(110, 'TXT_VIEW_ITEM');

-- --------------------------------------------------------

--
-- Table structure for table `share_lang_tags_translation`
--

DROP TABLE IF EXISTS `share_lang_tags_translation`;
CREATE TABLE IF NOT EXISTS `share_lang_tags_translation` (
  `ltag_id` int(10) unsigned NOT NULL DEFAULT '0',
  `lang_id` int(10) unsigned NOT NULL DEFAULT '0',
  `ltag_value_rtf` text NOT NULL,
  PRIMARY KEY (`ltag_id`,`lang_id`),
  KEY `FK_tranaslatelv_language` (`lang_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `share_lang_tags_translation`
--

INSERT INTO `share_lang_tags_translation` (`ltag_id`, `lang_id`, `ltag_value_rtf`) VALUES
(14, 1, 'Значение'),
(14, 2, 'Значення'),
(14, 3, 'Value'),
(15, 1, 'Выйти'),
(15, 2, 'Вийти'),
(15, 3, 'Exit'),
(42, 1, 'Сохранить'),
(42, 2, 'Зберегти'),
(42, 3, 'Save'),
(43, 1, 'Добавить'),
(43, 2, 'Додати'),
(43, 3, 'Add'),
(45, 1, 'Просмотреть список'),
(45, 2, 'Продивитися список'),
(45, 3, 'View list'),
(46, 1, 'Редактировать'),
(46, 2, 'Редагувати'),
(46, 3, 'Edit'),
(47, 1, 'Удалить'),
(47, 2, 'Видалити'),
(47, 3, 'Delete'),
(49, 1, 'Имя тега'),
(49, 2, 'Назва тега'),
(49, 3, 'Tag name'),
(50, 1, 'Логин (e-mail)'),
(50, 2, 'Логін (e-mail)'),
(50, 3, 'Login (e-mail)'),
(52, 1, 'Пароль'),
(52, 2, 'Пароль'),
(52, 3, 'Password'),
(53, 1, 'Повторите пароль'),
(53, 2, 'Повторіть пароль'),
(53, 3, 'Repeat password'),
(54, 1, 'Зарегистрироваться'),
(54, 2, 'Зареєструватись'),
(54, 3, 'Register'),
(55, 1, 'Сохранить изменения'),
(55, 2, 'Зберегти зміни'),
(55, 3, 'Save changes'),
(56, 1, 'Режим редактирования'),
(56, 2, 'Режим редагування'),
(56, 3, 'Edit mode'),
(57, 1, 'Добавить страницу'),
(57, 2, 'Додати сторінку'),
(57, 3, 'Add page'),
(58, 1, 'Редактировать страницу'),
(58, 2, 'Редагувати сторінку'),
(58, 3, 'Edit page'),
(59, 1, 'Удалить страницу'),
(59, 2, 'Видалити сторінку'),
(59, 3, 'Delete page'),
(60, 1, 'Режим просмотра'),
(60, 2, 'Режим перегляду'),
(60, 3, 'View mode'),
(61, 1, 'Исходный код'),
(61, 2, 'Вихідний код'),
(61, 3, 'View source'),
(62, 1, 'Назначить группы'),
(62, 2, 'Призначити групи'),
(62, 3, 'Set roles'),
(63, 1, 'Группы'),
(63, 2, 'Групи'),
(63, 3, 'Groups'),
(64, 1, 'В процессе работы возникли ошибки'),
(64, 2, 'В процесі роботи виникли помилки'),
(64, 3, 'The errors occurred'),
(65, 1, 'Невозможно удалить себя самого.'),
(65, 2, 'Неможливо видалити самого себе.'),
(65, 3, 'You cannot delete yourself.'),
(66, 1, 'Имя группы'),
(66, 2, 'Назва групи'),
(66, 3, 'Group name'),
(67, 1, 'По умолчанию для гостей'),
(67, 2, 'За замовчанням для гостей'),
(67, 3, 'Default for guests'),
(68, 1, 'По умолчанию для пользователей'),
(68, 2, 'За замовчанням для користувачів'),
(68, 3, 'Default for users'),
(69, 1, 'Аббревиатура языка'),
(69, 2, 'Абревіатура мови'),
(69, 3, 'Language abbreviation'),
(70, 1, 'Название языка'),
(70, 2, 'Назва мови'),
(70, 3, 'Language name'),
(71, 1, 'Язык по умолчанию'),
(71, 2, 'Мова за замовчанням'),
(71, 3, 'Default language'),
(73, 1, 'Локаль для Windows'),
(73, 2, 'Локаль для Windows'),
(73, 3, 'Local for Windows'),
(74, 1, 'Назначить права'),
(74, 2, 'Призначити права'),
(74, 3, 'Set rights'),
(75, 1, 'Название шаблона'),
(75, 2, 'Назва шаблону'),
(75, 3, 'Template name'),
(76, 1, 'Layout'),
(76, 2, 'Layout'),
(76, 3, 'Layout'),
(77, 1, 'Content'),
(77, 2, 'Content'),
(77, 3, 'Content'),
(78, 1, 'Системный шаблон'),
(78, 2, 'Системний шаблон'),
(78, 3, 'System template'),
(79, 1, 'Войти'),
(79, 2, 'Увійти'),
(79, 3, 'Enter'),
(80, 1, 'Регистрация прошла успешно'),
(80, 2, 'Реєстрація пройшла успішно'),
(80, 3, 'Registration was successful'),
(81, 1, 'Свойства'),
(81, 2, 'Властивості'),
(81, 3, 'Properties'),
(82, 1, 'Подробнее'),
(82, 2, 'Детальніше'),
(82, 3, 'Details'),
(83, 1, 'Заказать'),
(83, 2, 'Замовити'),
(83, 3, 'Order'),
(96, 1, 'Ошибка 404: документ не найден.'),
(96, 2, 'Помилка 404: документ не знайдено.'),
(96, 3, 'Error 404: document not found.'),
(109, 1, 'Перевод'),
(109, 2, 'Переклад'),
(109, 3, 'Translation'),
(110, 1, 'Просмотр'),
(110, 2, 'Перегляд'),
(110, 3, 'View'),
(112, 1, 'Редактирование'),
(112, 2, 'Редактування'),
(112, 3, 'Edit'),
(121, 1, 'Редактор разделов'),
(121, 2, 'Редактор розділів'),
(121, 3, 'Divisions editor'),
(122, 1, 'Родительский раздел'),
(122, 2, 'Батьківський розділ'),
(122, 3, 'Parent division'),
(123, 1, 'Сегмент URI'),
(123, 2, 'Сегмент URI'),
(123, 3, 'URI segment'),
(124, 1, 'Шаблон'),
(124, 2, 'Шаблон'),
(124, 3, 'Template'),
(125, 1, 'Порядок следования'),
(125, 2, 'Порядок слідування'),
(125, 3, 'Consecution'),
(126, 1, 'Конечный раздел'),
(126, 2, 'Кінцевий розділ'),
(126, 3, 'Final division'),
(127, 1, 'Раздел по умолчанию'),
(127, 2, 'Розділ за замовчанням'),
(127, 3, 'Default division'),
(128, 1, 'Отключен'),
(128, 2, 'Відключена'),
(128, 3, 'Off'),
(129, 1, 'Название раздела'),
(129, 2, 'Назва розділу'),
(129, 3, 'Division name'),
(130, 1, 'Описание раздела'),
(130, 2, 'Опис розділу'),
(130, 3, 'Division description'),
(131, 1, 'Ключевые слова (meta keywords)'),
(131, 2, 'Ключові слова (meta keywords)'),
(131, 3, 'Meta keywords'),
(133, 1, 'Мета-описание (meta description)'),
(133, 2, 'Мета-опис (meta description)'),
(133, 3, 'Meta description'),
(134, 1, 'Закрыть'),
(134, 2, 'Закрити'),
(134, 3, 'Close'),
(135, 1, 'Успешная регистрация'),
(135, 2, 'Успішна реєстрація'),
(135, 3, 'Successful registration'),
(136, 1, 'Поле не может быть пустым.'),
(136, 2, 'Поле не може бути порожнім.'),
(136, 3, 'Field cannot be empty.'),
(143, 1, 'При сохранении произошли ошибки'),
(143, 2, 'При збереженні сталися помилки'),
(143, 3, 'Errors occurred while saving'),
(144, 1, 'Неправильный формат e-mail.'),
(144, 2, 'Неправильний формат e-mail.'),
(144, 3, 'Incorrect e-mail.'),
(145, 1, 'Неправильный формат телефонного номера. Он должен содержать только цифры, знак "-", или пробел.'),
(145, 2, 'Неправильний формат телефонного номера. Він повинен містити тільки цифри, знак "-", або пробіл.'),
(145, 3, 'Incorrect format of phone number.'),
(146, 1, 'Неправильный формат числа.'),
(146, 2, 'Неправильний формат числа.'),
(146, 3, 'Incorrect number format.'),
(154, 1, 'Вы уверены, что хотите удалить запись? Восстановить данные потом будет невозможно.'),
(154, 2, 'Ви впевнені, що хочете видалити запис? Відновити дані потім буде неможливо.'),
(154, 3, 'Are you sure you want to delete the record? You would not be able to restore data.'),
(156, 1, 'Права отсутствуют'),
(156, 2, 'Права відсутні'),
(156, 3, 'No rights'),
(157, 1, 'Просмотреть'),
(157, 2, 'Продивитись'),
(157, 3, 'View'),
(158, 1, 'Изображение'),
(158, 2, 'Зображення'),
(158, 3, 'Image'),
(159, 1, 'Описание изображения'),
(159, 2, 'Опис зображення'),
(159, 3, 'Image description'),
(160, 1, 'Маленькое изображение'),
(160, 2, 'Маленьке зображення'),
(160, 3, 'Small image'),
(161, 1, 'Вставить изображение'),
(161, 2, 'Вставити зображення'),
(161, 3, 'Insert image'),
(162, 1, 'Имя файла'),
(162, 2, 'Назва файла'),
(162, 3, 'File name'),
(163, 1, 'Ширина'),
(163, 2, 'Ширина'),
(163, 3, 'Width'),
(164, 1, 'Высота'),
(164, 2, 'Висота'),
(164, 3, 'Height'),
(165, 1, 'Горизонтальный отступ'),
(165, 2, 'Горизонтальний відступ'),
(165, 3, 'Horizontal indent'),
(166, 1, 'Вертикальный отступ'),
(166, 2, 'Вертикальний відступ'),
(166, 3, 'Vertical indent'),
(167, 1, 'Альтернативный текст'),
(167, 2, 'Альтернативний текст'),
(167, 3, 'Alternative text'),
(168, 1, 'Вставить изображение'),
(168, 2, 'Вставити зображення'),
(168, 3, 'Insert image'),
(169, 1, 'Библиотека изображений'),
(169, 2, 'Бібліотека зображень'),
(169, 3, 'Image library'),
(170, 1, 'У Вас недостаточно прав на просмотр этой страницы.'),
(170, 2, 'У Вас недостатньо прав для перегляду цієї сторінки.'),
(170, 3, 'Access allowed only for registered users.'),
(171, 1, 'Менеджер изображений'),
(171, 2, 'Менеджер зображень'),
(171, 3, 'Image manager'),
(172, 1, 'Выравнивание'),
(172, 2, 'Вирівнювання'),
(172, 3, 'Align'),
(173, 1, 'Внизу'),
(173, 2, 'Внизу'),
(173, 3, 'Bottom'),
(174, 1, 'Посередине'),
(174, 2, 'Посередині'),
(174, 3, 'Center'),
(175, 1, 'Вверху'),
(175, 2, 'Зверху'),
(175, 3, 'Top'),
(176, 1, 'Слева'),
(176, 2, 'Зліва'),
(176, 3, 'Left'),
(177, 1, 'Справа'),
(177, 2, 'Справа'),
(177, 3, 'Right'),
(178, 1, 'Неправильный формат'),
(178, 2, 'Неправильний формат'),
(178, 3, 'Incorrect format'),
(179, 1, 'Неправильный формат имени пользователя. В поле должны быть только латинские буквы и цифры.'),
(179, 2, 'Неправильний формат імені користувача. У полі повинні бути тільки латинські літери і цифри.'),
(179, 3, 'Incorrect format of user name. There are have to be only latin letters and figures in this field.'),
(186, 1, 'Редактор шаблонов'),
(186, 2, 'Редактор шаблонів'),
(186, 3, 'Template editor'),
(205, 1, 'Загрузить в формате PDF'),
(205, 2, 'Завантажити в форматі PDF'),
(205, 3, 'Load in PDF format'),
(214, 1, 'Перейти'),
(214, 2, 'Перейти'),
(214, 3, 'Go'),
(216, 1, 'Страницы'),
(216, 2, 'Сторінки'),
(216, 3, 'Pages'),
(236, 1, 'Категория'),
(236, 2, 'Категорія'),
(236, 3, 'Category'),
(237, 1, 'Выбрать'),
(237, 2, 'Обрати'),
(237, 3, 'Choose'),
(238, 1, 'Список разделов'),
(238, 2, 'Список розділів'),
(238, 3, 'Divisions list'),
(250, 1, 'Поднять'),
(250, 2, 'Підняти'),
(250, 3, 'Up'),
(251, 1, 'Опустить'),
(251, 2, 'Опустити'),
(251, 3, 'Down'),
(255, 1, 'Библиотека изображений'),
(255, 2, 'Бібліотека зображень'),
(255, 3, 'Images library'),
(260, 1, 'Загрузить'),
(260, 2, 'Завантажити'),
(260, 3, 'Load'),
(261, 1, 'Файл не выбран'),
(261, 2, 'Файл не обрано'),
(261, 3, 'File is not chosen'),
(263, 1, 'Произошла ошибка при работе с базой данных.'),
(263, 2, 'Сталася помилка при роботі з базою даних.'),
(263, 3, 'An error occurred while working with database.'),
(265, 1, 'Запомнить'),
(265, 2, 'Запам''ятати'),
(265, 3, 'Remember'),
(269, 1, 'Отправить'),
(269, 2, 'Відправити'),
(269, 3, 'Send'),
(273, 1, 'Редактор пользователей'),
(273, 2, 'Редактор користувачів'),
(273, 3, 'User editor'),
(274, 1, 'Редактор ролей'),
(274, 2, 'Редактор ролей'),
(274, 3, 'Role editor'),
(277, 1, 'Пользователь'),
(277, 2, 'Користувач'),
(277, 3, 'User'),
(279, 1, 'Редактор языков'),
(279, 2, 'Редактор мов'),
(279, 3, 'Language editor'),
(284, 1, 'Искать'),
(284, 2, 'Шукати'),
(284, 3, 'Search'),
(286, 1, 'Вы вошли в систему как'),
(286, 2, 'Ви увійшли до системи як'),
(286, 3, 'You have authorized as'),
(287, 1, 'Здравствуйте!'),
(287, 2, 'Доброго дня!'),
(287, 3, 'Hello!'),
(293, 1, 'Восстановление пароля'),
(293, 2, 'Відновлення пароля'),
(293, 3, 'Restore password'),
(294, 1, '<p> Здравствуйте.</p><p> Вами был подан запрос на восстановление пароля.<br/>\r\n Ваш новый пароль: $password.</p><p> В качестве имени пользователя используйте адрес электронной почты, на которое поступило это письмо.</p><p> С уважением, разработчики Energine.</p>'),
(294, 2, '<p> Доброго дня.</p><p> Вами було подано запит на відновлення пароля.<br/>\r\n Ваш новый пароль: $password.</p><p> В якості імені користувача використовуйте адресу електронної пошти, на яку надійшов цей лист.</p><p> С повагою, розробники Energine.</p>'),
(294, 3, '<p> Hello.</p><p> You have sent an order to restore password.<br/>\r\n Your new password is: $password.</p><p> Use e-mail address on which you have received this message as login.</p>'),
(295, 1, 'Неправильное имя пользователя'),
(295, 2, 'Невірне ім''я користувача'),
(295, 3, 'Incorrect user name'),
(296, 1, 'На указанный вами адрес электронной почты был отправлен новый пароль.'),
(296, 2, 'На вказану вами адресу електронної пошти було відправлено новий пароль.'),
(296, 3, 'New password was send on your e-mail address.'),
(297, 1, 'Забыли пароль?'),
(297, 2, 'Забули пароль?'),
(297, 3, 'Forgot password?'),
(300, 1, 'Ссылка на раздел'),
(300, 2, 'Посилання на розділ'),
(300, 3, 'Link on division'),
(302, 1, 'Неправильный формат сегмента URL'),
(302, 2, 'Неправильний формат сегмента URL'),
(302, 3, 'Incorrect format of URL segment'),
(303, 1, '<P><STRONG>Пользователь с такими данными уже существует.</STRONG></P>\n<P>Скорее всего вы уже зарегистрированы в нашем магазине. </P>\n<P>Вам необходимо авторизоваться , перейдя на форму авторизации. </P>\n<P>Если вы забыли свой пароль, воспользуйтесь формой восстановления пароля, расположенной на той же странице.</P>'),
(303, 2, '<P><STRONG>Користувач з такими даними уже існує.</STRONG></P>\n<P>Скоріш за все, ви вже зареєстровані у нашому магазині. </P>\n<P>Вам необхідно авторизуватися за допомогою форми авторизації. </P>\n<P>Якщо ви забули свій пароль, скористайтесь формою відновлення пароля, що знаходиться на тій же сторінці.</P>'),
(303, 3, '<P><STRONG>User with such data already exists.</STRONG></P>\n<P>Probably you have registered yet in our shop.</P>'),
(304, 1, 'Группы'),
(304, 2, 'Групи'),
(304, 3, 'Groups'),
(305, 1, 'Комментарий'),
(305, 2, 'Коментар'),
(305, 3, 'Comment'),
(312, 1, 'Открыть'),
(312, 2, 'Відкрити'),
(312, 3, 'Open'),
(313, 1, 'Создать папку'),
(313, 2, 'Створити папку'),
(313, 3, 'Add folder'),
(314, 1, 'Переименовать'),
(314, 2, 'Перейменувати'),
(314, 3, 'Rename'),
(319, 1, 'Полный доступ'),
(319, 2, 'Повний доступ'),
(319, 3, 'Full access'),
(320, 1, 'Редактирование'),
(320, 2, 'Редактування'),
(320, 3, 'Editing'),
(321, 1, 'Только чтение'),
(321, 2, 'Тільки перегляд'),
(321, 3, 'Read only'),
(322, 1, 'Маленькое изображение для: '),
(322, 2, 'Маленьке зображення для: '),
(322, 3, 'Small image for:'),
(323, 1, 'Структура сайта'),
(323, 2, 'Структура сайту'),
(323, 3, 'Site structure'),
(324, 1, 'Шаблоны'),
(324, 2, 'Шаблони'),
(324, 3, 'Templates'),
(325, 1, '<p>Пользовательские настройки сохранены.</p>'),
(325, 2, '<p>Налаштування користувача збережено.</p>'),
(325, 3, '<p>User settings are saved.</p>'),
(326, 1, 'Фильтр'),
(326, 2, 'Фільтр'),
(326, 3, 'Filter'),
(327, 1, 'Применить'),
(327, 2, 'Застосувати'),
(327, 3, 'Apply'),
(328, 1, 'Сбросить фильтр'),
(328, 2, 'Скинути фільтр'),
(328, 3, 'Reset filter'),
(329, 1, 'Теги'),
(329, 2, 'Теги'),
(329, 3, 'Tags'),
(330, 1, 'Сохранить и перейти к редактированию'),
(330, 2, 'Зберегти і перейти до редагування'),
(330, 3, 'Save and go to edit'),
(331, 1, 'Вы хотите перейти на новосозданную страницу?'),
(331, 2, 'Ви хочете перейти до нової сторінки?'),
(331, 3, 'Do you want to move to the new page?'),
(336, 1, 'Название'),
(336, 2, 'Назва'),
(336, 3, 'Name'),
(339, 1, 'Нельзя удалить группу по умолчанию'),
(339, 2, 'Неможливо видалити групу за замовчанням'),
(339, 3, 'You cannot delete default group '),
(340, 1, 'Права группы по умолчанию'),
(340, 2, 'Права групи за замовчанням'),
(340, 3, 'Default group rights'),
(341, 1, 'Права на разделы'),
(341, 2, 'Права на розділи'),
(341, 3, 'Rights for divisions'),
(342, 1, 'Результаты поиска'),
(342, 2, 'Результати пошуку'),
(342, 3, 'Search results'),
(343, 1, 'По вашему запросу товар не найден.'),
(343, 2, 'За вашим запитом товар не знайдено.'),
(343, 3, 'Goods not found.'),
(344, 1, 'Главная'),
(344, 2, 'Головна'),
(344, 3, 'Main page'),
(345, 1, 'Телефон'),
(345, 2, 'Телефон'),
(345, 3, 'Phone'),
(346, 1, 'Сохранить'),
(346, 2, 'Зберегти'),
(346, 3, 'Save'),
(347, 1, 'Отменить'),
(347, 2, 'Відмінити'),
(347, 3, 'Cancel'),
(348, 1, 'Исходный код текстового блока'),
(348, 2, 'Вихідний код текстового блоку'),
(348, 3, 'Source code of the text block'),
(357, 1, 'Файловый репозиторий'),
(357, 2, 'Файловий репозиторій'),
(357, 3, 'File repository'),
(365, 1, 'Изменить персональные данные'),
(365, 2, 'Змінити персональні дані'),
(365, 3, 'Change personal data'),
(367, 1, 'Новый пароль'),
(367, 2, 'Новий пароль'),
(367, 3, 'New password'),
(368, 1, 'Адрес'),
(368, 2, 'Адреса'),
(368, 3, 'Address'),
(371, 1, 'Для сохранения необходимо ввести пароль'),
(371, 2, 'Для збереження необхідно ввести пароль'),
(371, 3, 'Enter password to save'),
(372, 1, 'Новый пароль'),
(372, 2, 'Новий пароль'),
(372, 3, 'New password'),
(373, 1, 'Подтвердите пароль'),
(373, 2, 'Підтвердіть пароль'),
(373, 3, 'Confirm password'),
(374, 1, 'Новый пароль и его подтверждение должны быть одинаковыми.'),
(374, 2, 'Новий пароль і його підтвердження повинні бути однакові.'),
(374, 3, 'A new password and its confirmation have to be equal.'),
(375, 1, 'Вы ввели неверный пароль'),
(375, 2, 'Ви ввели невірний пароль'),
(375, 3, 'Incorrect password'),
(376, 1, 'Неверный логин или пароль'),
(376, 2, 'Невірний логін або пароль'),
(376, 3, 'Incorrect login or password'),
(381, 1, 'Переводы'),
(381, 2, 'Переклади'),
(381, 3, 'Translations'),
(383, 1, 'Невозможно изменить порядок следования'),
(383, 2, 'Неможливо змінити порядок слідування'),
(383, 3, 'Cannot move'),
(384, 1, 'Альтернативный title страницы'),
(384, 2, 'Альтернативний title сторінки'),
(384, 3, 'Alternative page title'),
(385, 1, 'Режим просмотра'),
(385, 2, 'Режим перегляду'),
(385, 3, 'View mode'),
(389, 1, 'Неправильные данные.'),
(389, 2, 'Неправильні дані.'),
(389, 3, 'Incorrect data.'),
(391, 1, 'Заголовок новости'),
(391, 2, 'Заголовок новини'),
(391, 3, 'News title'),
(392, 1, 'Дата новости'),
(392, 2, 'Дата новини'),
(392, 3, 'News date'),
(393, 1, 'Анонс новости '),
(393, 2, 'Анонс новини'),
(393, 3, 'News anounce'),
(394, 1, 'Текст новости'),
(394, 2, 'Текст новини'),
(394, 3, 'News text'),
(396, 1, 'Файловый репозиторий'),
(396, 2, 'Файловий репозиторій'),
(396, 3, 'File repository'),
(397, 1, 'Имя папки (сегмент URI)'),
(397, 2, 'Назва папки (сегмент URI)'),
(397, 3, 'Folder name (URI segment)'),
(419, 1, 'Контакты'),
(419, 2, 'Контакти'),
(419, 3, 'Contacts'),
(420, 1, 'Открыть поле'),
(420, 2, 'Відкрити поле'),
(420, 3, 'Open field'),
(421, 1, 'Скрыть поле'),
(421, 2, 'Сховати поле'),
(421, 3, 'Hide field'),
(422, 1, '/^(([^()<>@,;:\\\\\\".\\[\\] ]+)|("[^"\\\\\\\\\\r]*"))((\\.[^()<>@,;:\\\\\\".\\[\\] ]+)|(\\."[^"\\\\\\\\\\r]*"))*@(([a-z0-9][a-z0-9\\-]+)*[a-z0-9]+\\.)+[a-z]{2,}$/i'),
(422, 2, '/^(([^()<>@,;:\\\\\\".\\[\\] ]+)|("[^"\\\\\\\\\\r]*"))((\\.[^()<>@,;:\\\\\\".\\[\\] ]+)|(\\."[^"\\\\\\\\\\r]*"))*@(([a-z0-9][a-z0-9\\-]+)*[a-z0-9]+\\.)+[a-z]{2,}$/i'),
(422, 3, '/^(([^()<>@,;:\\\\\\".\\[\\] ]+)|("[^"\\\\\\\\\\r]*"))((\\.[^()<>@,;:\\\\\\".\\[\\] ]+)|(\\."[^"\\\\\\\\\\r]*"))*@(([a-z0-9][a-z0-9\\-]+)*[a-z0-9]+\\.)+[a-z]{2,}$/i'),
(424, 1, 'Спасибо за внимание к нашим продуктам. Ваша заявка отправлена. В ближайшее время мы свяжемся с Вами.'),
(424, 2, 'Дякуємо за інтерес до наших продуктів. Ваше замовлення відправлено. Найближчим часом ми звяжемось з вами. '),
(424, 3, 'Your request has been sent. We''ll contact you, soon.'),
(426, 1, 'Добавить новость'),
(426, 2, 'Додати новину'),
(426, 3, 'Add news'),
(427, 1, 'Редактировать новость'),
(427, 2, 'Редагувати новину'),
(427, 3, 'Edit news '),
(428, 1, 'Удалить новость'),
(428, 2, 'Видалити новину'),
(428, 3, 'Delete news'),
(429, 1, 'Вернуться к списку'),
(429, 2, 'Повернутись до списку'),
(429, 3, 'Back to the list'),
(431, 1, 'Карта сайта'),
(431, 2, 'Карта сайту'),
(431, 3, 'Sitemap'),
(432, 1, 'Контакты'),
(432, 2, 'Контакти'),
(432, 3, 'Contacts'),
(436, 1, 'Текст сообщения'),
(436, 2, 'Текст повідомлення'),
(436, 3, 'Message text'),
(437, 1, 'Автор сообщения'),
(437, 2, 'Автор повідомлення'),
(437, 3, 'Message author'),
(438, 1, 'Контактный e-mail'),
(438, 2, 'Контактний e-mail'),
(438, 3, 'Contact e-mail'),
(439, 1, '<span class="mark">*</span> - поля, обязательные для заполнения'),
(439, 2, '<span class="mark">*</span> - поля, обов''язкові для заповнення'),
(439, 3, '<span class="mark">*</span> - fields must be filled'),
(440, 1, 'Ваше сообщение успешно отправлено.'),
(440, 2, 'Ваше повідомлення успішно відправлено.'),
(440, 3, 'Your message has been successfully sent.'),
(441, 1, 'Поздравляем, Вы удачно зарегистрировались. На указанный Вами адрес электронной почты отправлено письмо с параметрими доступа.'),
(441, 2, 'Вітаємо, Ви вдало зареєструвалися.'),
(441, 3, 'Congratulations, you have successfully registered.'),
(442, 1, 'Дата сообщения'),
(442, 2, 'Дата повідомлення'),
(442, 3, 'Message date'),
(443, 1, 'Список сообщений'),
(443, 2, 'Список повідомлень'),
(443, 3, 'List of messages'),
(444, 1, 'Файл'),
(444, 2, 'Файл'),
(444, 3, 'File'),
(445, 1, 'Дополнительные файлы'),
(445, 2, 'Додаткові файли'),
(445, 3, 'Additional files'),
(446, 1, 'Добавить файл'),
(446, 2, 'Додати файл'),
(446, 3, 'Add file'),
(447, 1, 'Дополнительные файлы отсутствуют'),
(447, 2, 'Додаткові файли відсутні'),
(447, 3, 'No additional files'),
(448, 1, 'Удалить'),
(448, 2, 'Видалити'),
(448, 3, 'Delete'),
(449, 1, 'Очистить форматирование'),
(449, 2, 'Очистити форматування'),
(449, 3, 'Clear formatting'),
(450, 1, 'Заголовок 1'),
(450, 2, 'Заголовок 1'),
(450, 3, 'Heading 1'),
(451, 1, 'Заголовок 2'),
(451, 2, 'Заголовок 2'),
(451, 3, 'Heading 2'),
(452, 1, 'Заголовок 3'),
(452, 2, 'Заголовок 3'),
(452, 3, 'Heading 3'),
(453, 1, 'Заголовок 4'),
(453, 2, 'Заголовок 4'),
(453, 3, 'Heading 4'),
(454, 1, 'Заголовок 5'),
(454, 2, 'Заголовок 5'),
(454, 3, 'Heading 5'),
(455, 1, 'Заголовок 6'),
(455, 2, 'Заголовок 6'),
(455, 3, 'Heading 6'),
(456, 1, 'Адрес'),
(456, 2, 'Адреса'),
(456, 3, 'Address'),
(457, 1, 'Полужирный шрифт'),
(457, 2, 'Напівжирний '),
(457, 3, 'Bold'),
(458, 1, 'Курсив'),
(458, 2, 'Курсив'),
(458, 3, 'Italic'),
(459, 1, 'Вставить ссылку'),
(459, 2, 'Вставити посилання'),
(459, 3, 'Insert link'),
(460, 1, 'Ненумерованный список'),
(460, 2, 'Ненумерований список'),
(460, 3, 'Unordered list'),
(461, 1, 'Нумерованный список'),
(461, 2, 'Нумерований перелiк'),
(461, 3, 'Ordered list'),
(462, 1, 'Выравнивание по левому краю'),
(462, 2, 'Вирiвнювання злiва'),
(462, 3, 'Align left'),
(463, 1, 'Выравнивание по правому краю'),
(463, 2, 'Вирiвнювання справа'),
(463, 3, 'Align right'),
(464, 1, 'Выравнивание по центру'),
(464, 2, 'Вирiвнювання по центру'),
(464, 3, 'Align center'),
(465, 1, 'Выравнивание по ширине'),
(465, 2, 'Вирiвнювання по ширинi'),
(465, 3, 'Align justify'),
(466, 1, 'Вставить ссылку на файл'),
(466, 2, 'Вставити посилання на файл'),
(466, 3, 'Insert download link'),
(467, 1, 'Перенаправлять по адресу'),
(467, 2, 'Перенаправляти за адресою'),
(467, 3, 'Redirect to  URL'),
(468, 1, 'Неправильный формат УРЛ'),
(468, 2, 'Невiрний формат УРЛ'),
(468, 3, 'Illegal URL format'),
(469, 1, 'Загрузить архив'),
(469, 2, 'Завантажити архiв'),
(469, 3, 'Load archive'),
(470, 1, 'Архив содержащий  файлы для загрузки'),
(470, 2, 'Архів, що містить файли для завантаження'),
(470, 3, 'Archive file'),
(471, 1, 'января'),
(471, 2, 'сiчня'),
(471, 3, 'January'),
(472, 1, 'февраля'),
(472, 2, 'лютого'),
(472, 3, 'Febrary'),
(473, 1, 'марта'),
(473, 2, 'березня'),
(473, 3, 'March'),
(474, 1, 'апреля'),
(474, 2, 'квiтня'),
(474, 3, 'April'),
(475, 1, 'мая'),
(475, 2, 'травня'),
(475, 3, 'May'),
(476, 1, 'июня'),
(476, 2, 'червня'),
(476, 3, 'June'),
(477, 1, 'июля'),
(477, 2, 'липня'),
(477, 3, 'July'),
(478, 1, 'августа'),
(478, 2, 'серпня'),
(478, 3, 'August'),
(479, 1, 'сентября'),
(479, 2, 'вересня'),
(479, 3, 'September'),
(480, 1, 'октября'),
(480, 2, 'жовтня'),
(480, 3, 'October'),
(481, 1, 'ноября'),
(481, 2, 'листопада'),
(481, 3, 'November'),
(482, 1, 'декабря'),
(482, 2, 'грудня'),
(482, 3, 'December'),
(483, 1, 'Описание'),
(483, 2, 'Опис'),
(483, 3, 'Description'),
(484, 1, 'Название'),
(484, 2, 'Назва'),
(484, 3, 'Title'),
(485, 1, 'Фотография'),
(485, 2, 'Фотографiя'),
(485, 3, 'Photo'),
(486, 1, 'Полное имя'),
(486, 2, 'Повне iм''я'),
(486, 3, 'Full name'),
(487, 1, 'Аватар'),
(487, 2, 'Аватар'),
(487, 3, 'Avatar'),
(488, 1, 'Роль'),
(488, 2, 'Роль'),
(488, 3, 'Role'),
(489, 1, 'Языки'),
(489, 2, 'Мови'),
(489, 3, 'Languages'),
(490, 1, 'Пользователи'),
(490, 2, 'Користувачі'),
(490, 3, 'Users'),
(491, 1, 'Роли'),
(491, 2, 'Ролі'),
(491, 3, 'Groups'),
(492, 1, 'Активизирован'),
(492, 2, 'Активований'),
(492, 3, 'Activated'),
(493, 1, 'Активизировать'),
(493, 2, 'Активувати'),
(493, 3, 'Activate'),
(494, 1, 'Иконка'),
(494, 2, 'Іконка'),
(494, 3, 'Icon'),
(495, 1, 'Добавить фотографию'),
(495, 2, 'Додати фотографію'),
(495, 3, 'Add photo'),
(496, 1, 'Редактировать'),
(496, 2, 'Редагувати'),
(496, 3, 'Edit'),
(497, 1, 'Удалить'),
(497, 2, 'Видалити'),
(497, 3, 'Delete'),
(498, 1, 'Маленькое изображение'),
(498, 2, 'Маленьке зображення'),
(498, 3, 'Thumbnail'),
(499, 1, 'Удалить файл'),
(499, 2, 'Видалити'),
(499, 3, 'Delete file'),
(500, 1, 'Отступ снизу'),
(500, 2, 'Відступ знизу'),
(500, 3, 'Margin bottom<br/>\r\n'),
(501, 1, 'Отступ слева'),
(501, 2, 'Відступ зліва'),
(501, 3, 'Margin left'),
(502, 1, 'Оступ справа'),
(502, 2, 'Відступ справа'),
(502, 3, 'Margin right'),
(503, 1, 'Отступ сверху'),
(503, 2, 'Відступ зверху'),
(503, 3, 'Margin top'),
(504, 1, 'Уведомление о регистрации'),
(504, 2, 'Повідомлення про реєстрацію'),
(504, 3, 'Registration succeed'),
(505, 1, '<p> Здравствуйте, $name.<br/>\r\n Вы были зарегистрированы на сайте.</p><p> Ваш логин: $login<br/>\r\n Пароль: $password</p>'),
(505, 2, '<div> <p> Здравствуйте, $name.<br/>\r\n Вы были зарегистрированы на сайте. </p> <p> Ваш логин: $login<br/>\r\n Пароль: $password </p></div>'),
(505, 3, '<div> <p> Hello, $name.<br/>\r\n You had been registered on our site. </p> <p> Login: $login<br/>\r\n Password: $password </p></div>'),
(506, 1, 'Группы'),
(506, 2, 'Групи'),
(506, 3, 'Roles'),
(507, 1, 'Структура сайта'),
(507, 2, 'Структура сайту'),
(507, 3, 'Site tree'),
(508, 1, 'и'),
(508, 2, 'та'),
(508, 3, 'and'),
(510, 1, 'Права на страницу'),
(510, 2, 'Права на сторінку'),
(510, 3, 'Page rights'),
(511, 1, 'Поиск по каталогу'),
(511, 2, 'Пошук по каталогу'),
(511, 3, 'Search in catalogue'),
(512, 1, 'Валюта'),
(512, 2, 'Валюта'),
(512, 3, 'Currency'),
(513, 1, 'Курс'),
(513, 2, 'Курс'),
(513, 3, 'Rate'),
(514, 1, 'Аббревиатура'),
(514, 2, 'Абревіатура'),
(514, 3, 'Abbreviation'),
(515, 1, 'Формат'),
(515, 2, 'Формат'),
(515, 3, 'Format'),
(516, 1, 'Статус товара'),
(516, 2, 'Статус товару'),
(516, 3, 'Product status'),
(517, 1, 'Статус по-умолчанию'),
(517, 2, 'Статус за замовчанням'),
(517, 3, 'Default status'),
(518, 1, 'Уровень прав, необходимый для просмотра товаров с этим статусом'),
(518, 2, 'Рівень прав, необхідний для перегляду товарів з цим статусом'),
(518, 3, 'Level of rights, which is necessary to view products in this status'),
(519, 1, 'Статус заказа'),
(519, 2, 'Статус замовлення'),
(519, 3, 'Order status'),
(520, 1, 'Редактор производителей'),
(520, 2, 'Редактор виробників'),
(520, 3, 'Producer editor'),
(521, 1, 'Производитель'),
(521, 2, 'Виробник'),
(521, 3, 'Producer'),
(522, 1, 'Сегмент URI'),
(522, 2, 'Сегмент URI'),
(522, 3, 'URI segment'),
(523, 1, 'Редактор типов товара'),
(523, 2, 'Редактор типів товару'),
(523, 3, 'Product type editor'),
(524, 1, 'Тип товара'),
(524, 2, 'Тип товару'),
(524, 3, 'Product type'),
(525, 1, 'Параметры'),
(525, 2, 'Параметри'),
(525, 3, 'Parameters'),
(526, 1, 'Параметр'),
(526, 2, 'Параметр'),
(526, 3, 'Parameter'),
(527, 1, 'Тип'),
(527, 2, 'Тип'),
(527, 3, 'Type'),
(528, 1, 'Строка'),
(528, 2, 'Рядок'),
(528, 3, 'String'),
(529, 1, 'Число'),
(529, 2, 'Число'),
(529, 3, 'Integer'),
(530, 1, 'Текст'),
(530, 2, 'Текст'),
(530, 3, 'Text'),
(531, 1, 'Статус'),
(531, 2, 'Статус'),
(531, 3, 'Status'),
(532, 1, 'Товар'),
(532, 2, 'Товар'),
(532, 3, 'Product'),
(533, 1, 'Сегмент URI'),
(533, 2, 'Сегмент URI'),
(533, 3, 'URI segment'),
(534, 1, 'Код товара'),
(534, 2, 'Код товару'),
(534, 3, 'Product code'),
(535, 1, 'Цена'),
(535, 2, 'Ціна'),
(535, 3, 'Price'),
(536, 1, 'Количество'),
(536, 2, 'Кількість'),
(536, 3, 'Quantity'),
(537, 1, 'Производитель'),
(537, 2, 'Виробник'),
(537, 3, 'Producer'),
(538, 1, 'Параметры'),
(538, 2, 'Параметри'),
(538, 3, 'Parameters'),
(539, 1, 'Тип товара'),
(539, 2, 'Тип товару'),
(539, 3, 'Product type'),
(540, 1, 'Краткое описание'),
(540, 2, 'Короткий опис'),
(540, 3, 'Short description'),
(541, 1, 'Полное описание'),
(541, 2, 'Повний опис'),
(541, 3, 'Full description'),
(542, 1, 'Печатать'),
(542, 2, 'Друкувати'),
(542, 3, 'Print'),
(543, 1, 'Параметры'),
(543, 2, 'Параметри'),
(543, 3, 'Parameters'),
(544, 1, 'Необходимо указать название раздела для всех не отключенных языковых версий'),
(544, 2, 'Необхідно вказати назву розділу для всіх активних мов'),
(544, 3, 'You need to set division name for all active languages'),
(545, 1, 'Поднять'),
(545, 2, 'Підняти'),
(545, 3, 'Up'),
(546, 1, 'Опустить'),
(546, 2, 'Опустити'),
(546, 3, 'Down'),
(547, 1, 'Значение параметра'),
(547, 2, 'Значення параметру'),
(547, 3, 'Param value'),
(548, 1, 'или'),
(548, 2, 'або'),
(548, 3, 'or'),
(549, 1, 'Создать производителя'),
(549, 2, 'Створити виробника'),
(549, 3, 'Create manyfacturer'),
(556, 1, 'Аббревиатура валюты должна состоять из трех латинских букв'),
(556, 2, 'Абревіатура валюти повинна складатися з трьох латинських букв'),
(556, 3, 'Currency abbreviation must consist of three letters'),
(558, 1, 'Показать цены в'),
(558, 2, 'Відобразити ціни у'),
(558, 3, 'Current currency'),
(559, 1, 'Базовая валюта'),
(559, 2, 'Базова валюта'),
(559, 3, 'Main currency'),
(560, 1, 'Курс валют'),
(560, 2, 'Курс валют'),
(560, 3, 'Currencies rate'),
(561, 1, 'Параметры'),
(561, 2, 'Параметри'),
(561, 3, 'Product params'),
(562, 1, 'Цена'),
(562, 2, 'Ціна'),
(562, 3, 'Price'),
(563, 1, 'Добавить в корзину'),
(563, 2, 'Покласти до кошика'),
(563, 3, 'Add to basket'),
(564, 1, 'Другие товары этого производителя'),
(564, 2, 'Інші товари цього виробника'),
(564, 3, 'Manufacturer'),
(565, 1, 'Итого'),
(565, 2, 'Всього'),
(565, 3, 'Total'),
(566, 1, 'В корзине'),
(566, 2, 'Вміст кошику'),
(566, 3, 'Basket'),
(567, 1, 'Корзина пуста'),
(567, 2, 'Кошик порожній'),
(567, 3, 'Basket is empty'),
(568, 1, 'Сумма'),
(568, 2, 'Сума'),
(568, 3, 'Summ'),
(569, 1, 'Количество'),
(569, 2, 'Кількість'),
(569, 3, 'Count'),
(570, 1, 'Общая сумма'),
(570, 2, 'Загальна сума'),
(570, 3, 'Total summ'),
(571, 1, 'Пересчитать'),
(571, 2, 'Перерахувати'),
(571, 3, 'Recalculate'),
(572, 1, 'Заказать'),
(572, 2, 'Замовити'),
(572, 3, 'Order'),
(573, 1, 'Перейти в корзину'),
(573, 2, 'Перейти до кошику'),
(573, 3, 'Basket'),
(574, 1, 'Ваш заказ отправлен'),
(574, 2, 'Ваше замовлення відправлено'),
(574, 3, 'Your order has been sent'),
(575, 1, 'Сообщение системы электронного магазина'),
(575, 2, 'Повідомлення системи електронного магазину'),
(575, 3, 'Message from e-shop'),
(576, 1, 'Уведомление о оформлении заказа'),
(576, 2, 'Повідомлення про відправку замолення'),
(576, 3, 'Order has been sent'),
(578, 1, 'Оформление заказа не увенчалось успехом Свяжитесь с администратором магазина для решения проблем'),
(578, 2, 'Оформлення замовлення зазнало невдачі'),
(578, 3, 'Order is failed'),
(579, 1, 'Комментарий'),
(579, 2, 'Коментар'),
(579, 3, 'Comment'),
(580, 1, 'Форма заказа'),
(580, 2, 'Форма замовлення'),
(580, 3, 'Order form'),
(581, 1, '<p> Здравствуйте, $u_fullname.<br/>\r\n Вы оформили заказ в магазине Energine.</p>Номер заказа: <strong>$order_id</strong><br/>\r\n<p> Комментарий к заказу: $order_delivery_comment</p>Содержание заказа: $basket'),
(581, 2, '<p> Здравствуйте, $u_fullname.<br/>\r\n Вы оформили заказ в магазине Energine.</p>Номер заказа: <strong>$order_id</strong><br/>\r\n<p> Комментарий к заказу: $order_delivery_comment</p>Содержание заказа: $basket'),
(581, 3, '<p> Здравствуйте, $u_fullname.<br/>\r\n Вы оформили заказ в магазине Energine.</p>Номер заказа: <strong>$order_id</strong><br/>\r\n<p> Комментарий к заказу: $order_delivery_comment</p>Содержание заказа: $basket'),
(582, 1, '<p> Здравствуйте, $u_fullname.<br/>\r\n Вы оформили заказ в магазине Energine.</p>Номер заказа: <strong>$order_id</strong><br/>\r\n<p> Комментарий к заказу: $order_delivery_comment</p><p> Содержание заказа: $basket</p>Теперь вы зарегистрированы в нашем магазине:<ul> <li>Логин: $u_name </li> <li>Пароль: $u_password </li></ul>'),
(582, 2, '<p> Здравствуйте, $u_fullname.<br/>\r\n Вы оформили заказ в магазине Energine.</p>Номер заказа: <strong>$order_id</strong><br/>\r\n<p> Комментарий к заказу: $order_delivery_comment</p><p> Содержание заказа: $basket</p>Теперь вы зарегистрированы в нашем магазине:<ul> <li>Логин: $u_name </li> <li>Пароль: $u_password </li></ul>'),
(582, 3, '<p> Здравствуйте, $u_fullname.<br/>\r\n Вы оформили заказ в магазине Energine.</p>Номер заказа: <strong>$order_id</strong><br/>\r\n<p> Комментарий к заказу: $order_delivery_comment</p><p> Содержание заказа: $basket</p>Теперь вы зарегистрированы в нашем магазине:<ul> <li>Логин: $u_name </li> <li>Пароль: $u_password </li></ul>'),
(583, 1, '<p> Здравствуйте, администратор.<br/>\r\n В наш електронный магазин поступил новый заказ:<br/>\r\n Номер заказа: <strong>$order_id</strong><br/>\r\n</p><p> Пользователь: $u_fullname ($u_name)<br/>\r\n Комментарий к заказу: $order_delivery_comment</p><p> Содержание заказа: $basket</p>'),
(583, 2, '<p> Здравствуйте, администратор.<br/>\r\n В наш електронный магазин поступил новый заказ:<br/>\r\n Номер заказа: <strong>$order_id</strong><br/>\r\n</p><p> Пользователь: $u_fullname ($u_name)<br/>\r\n Комментарий к заказу: $order_delivery_comment</p><p> Содержание заказа: $basket</p>'),
(583, 3, '<p> Здравствуйте, администратор.<br/>\r\n В наш електронный магазин поступил новый заказ:<br/>\r\n Номер заказа: <strong>$order_id</strong><br/>\r\n</p><p> Пользователь: $u_fullname ($u_name)<br/>\r\n Комментарий к заказу: $order_delivery_comment</p><p> Содержание заказа: $basket</p>'),
(584, 1, 'Статус заказа'),
(584, 2, 'Статус замовлення'),
(584, 3, 'Order status'),
(585, 1, 'Дата заказа'),
(585, 2, 'Дата замовлення'),
(585, 3, 'Order date'),
(586, 1, 'Список заказов'),
(586, 2, 'Список заказов'),
(586, 3, 'Список заказов'),
(587, 1, 'Детали заказа'),
(587, 2, 'Деталі замовлення'),
(587, 3, 'Order details'),
(588, 1, 'Комментарии администратора'),
(588, 2, 'Коментарі адмінстратора'),
(588, 3, 'Comments');

-- --------------------------------------------------------

--
-- Table structure for table `share_news`
--

DROP TABLE IF EXISTS `share_news`;
CREATE TABLE IF NOT EXISTS `share_news` (
  `news_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `news_date` date NOT NULL DEFAULT '0000-00-00',
  `smap_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`news_id`),
  KEY `smap_id` (`smap_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=15 ;

--
-- Dumping data for table `share_news`
--


-- --------------------------------------------------------

--
-- Table structure for table `share_news_translation`
--

DROP TABLE IF EXISTS `share_news_translation`;
CREATE TABLE IF NOT EXISTS `share_news_translation` (
  `news_id` int(10) unsigned NOT NULL DEFAULT '0',
  `lang_id` int(10) unsigned NOT NULL DEFAULT '0',
  `news_title` varchar(250) DEFAULT NULL,
  `news_announce_rtf` text NOT NULL,
  `news_text_rtf` text,
  PRIMARY KEY (`news_id`,`lang_id`),
  KEY `lang_id` (`lang_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `share_news_translation`
--


-- --------------------------------------------------------

--
-- Table structure for table `share_session`
--

DROP TABLE IF EXISTS `share_session`;
CREATE TABLE IF NOT EXISTS `share_session` (
  `session_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `session_native_id` varchar(40) NOT NULL DEFAULT '',
  `session_last_impression` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `session_created` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `session_user_agent` varchar(255) NOT NULL DEFAULT '',
  `session_data` text,
  PRIMARY KEY (`session_id`),
  UNIQUE KEY `session_native_id` (`session_native_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3030 ;

--
-- Dumping data for table `share_session`
--


-- --------------------------------------------------------

--
-- Table structure for table `share_sitemap`
--

DROP TABLE IF EXISTS `share_sitemap`;
CREATE TABLE IF NOT EXISTS `share_sitemap` (
  `smap_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `tmpl_id` int(10) unsigned NOT NULL DEFAULT '0',
  `smap_pid` int(10) unsigned DEFAULT NULL,
  `smap_segment` char(50) NOT NULL DEFAULT '',
  `smap_is_final` tinyint(1) NOT NULL DEFAULT '0',
  `smap_order_num` int(10) unsigned DEFAULT '1',
  `smap_modified` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `smap_default` tinyint(1) NOT NULL DEFAULT '0',
  `smap_is_system` tinyint(1) NOT NULL DEFAULT '0',
  `smap_redirect_url` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`smap_id`),
  KEY `ref_sitemap_template_FK` (`tmpl_id`),
  KEY `ref_sitemap_parent_FK` (`smap_pid`),
  KEY `idx_order` (`smap_order_num`),
  KEY `smap_is_system` (`smap_is_system`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=398 ;

--
-- Dumping data for table `share_sitemap`
--

INSERT INTO `share_sitemap` (`smap_id`, `tmpl_id`, `smap_pid`, `smap_segment`, `smap_is_final`, `smap_order_num`, `smap_modified`, `smap_default`, `smap_is_system`, `smap_redirect_url`) VALUES
(7, 3, NULL, 'admin', 0, 18, '2008-02-13 17:46:14', 0, 0, NULL),
(80, 30, NULL, 'main', 0, 5, '2010-01-19 15:59:06', 1, 0, NULL),
(324, 15, NULL, 'login', 1, 12, '2008-02-13 17:22:54', 0, 0, NULL),
(327, 14, NULL, 'news', 0, 6, '2008-02-14 18:02:39', 0, 0, NULL),
(329, 17, NULL, 'sitemap', 0, 9, '2008-04-02 19:24:45', 0, 0, NULL),
(330, 18, NULL, 'restore-password', 1, 17, '2008-04-02 19:20:45', 0, 0, NULL),
(331, 19, NULL, 'registration', 0, 8, '2008-04-02 19:29:37', 0, 0, NULL),
(336, 16, NULL, 'feedback', 0, 7, '2009-10-05 16:46:37', 0, 0, NULL),
(337, 21, 7, 'feedback-list', 0, 8, '2008-04-08 14:52:50', 0, 0, NULL),
(350, 20, NULL, 'gallery', 0, 4, '2009-08-14 18:43:25', 0, 0, NULL),
(351, 22, NULL, 'google-sitemap', 1, 11, '2009-10-05 16:55:19', 0, 1, NULL),
(352, 23, NULL, 'shop', 0, 3, '2010-01-14 14:40:06', 0, 0, NULL),
(353, 24, 7, 'product-editor', 0, 6, '2010-01-11 14:17:33', 0, 0, NULL),
(354, 27, 7, 'product-type', 0, 5, '2010-01-11 15:58:28', 0, 0, NULL),
(355, 25, 7, 'manufacturer-editor', 0, 4, '2010-01-11 16:14:34', 0, 0, NULL),
(356, 28, 7, 'status-editor', 0, 3, '2010-01-12 18:42:52', 0, 0, NULL),
(381, 26, 7, 'product-status-editor', 0, 2, '2010-01-21 12:55:58', 0, 0, NULL),
(383, 29, 7, 'currency', 0, 1, '2010-01-15 17:03:11', 0, 0, NULL),
(388, 31, 352, 'order', 1, 4, '2010-02-09 13:12:27', 0, 0, NULL),
(389, 32, 352, 'basket', 1, 3, '2010-02-09 14:28:58', 0, 0, NULL),
(390, 23, 352, 'fat-slonopotam', 0, 1, '2010-02-18 17:40:46', 0, 0, NULL),
(391, 13, 392, 'text-block', 0, 1, '2010-02-25 11:53:29', 0, 0, NULL),
(392, 3, NULL, 'text-pages', 0, 1, '2010-02-28 13:40:26', 0, 0, NULL),
(393, 13, 392, 'text-block-2', 0, 2, '2010-02-19 11:05:31', 0, 0, NULL),
(394, 13, 392, 'text-block-3', 0, 3, '2010-02-24 18:45:16', 0, 0, NULL),
(395, 13, 392, 'text-block-redirect', 0, 5, '2010-02-19 12:00:54', 0, 0, 'text-pages/'),
(396, 23, 352, 'etc', 0, 2, '2010-02-19 12:34:20', 0, 0, NULL),
(397, 33, 7, 'order-history', 0, 7, '2010-02-28 15:08:57', 0, 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `share_sitemap_translation`
--

DROP TABLE IF EXISTS `share_sitemap_translation`;
CREATE TABLE IF NOT EXISTS `share_sitemap_translation` (
  `smap_id` int(10) unsigned NOT NULL DEFAULT '0',
  `lang_id` int(10) unsigned NOT NULL DEFAULT '0',
  `smap_name` varchar(200) DEFAULT NULL,
  `smap_description_rtf` text,
  `smap_html_title` varchar(250) DEFAULT NULL,
  `smap_meta_keywords` text,
  `smap_meta_description` text,
  `smap_is_disabled` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`lang_id`,`smap_id`),
  KEY `sitemaplv_sitemap_FK` (`smap_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `share_sitemap_translation`
--

INSERT INTO `share_sitemap_translation` (`smap_id`, `lang_id`, `smap_name`, `smap_description_rtf`, `smap_html_title`, `smap_meta_keywords`, `smap_meta_description`, `smap_is_disabled`) VALUES
(7, 1, 'Управление сайтом', NULL, 'Управление сайтом', NULL, NULL, 0),
(80, 1, 'Демонстрационная версия CMF Energine', NULL, NULL, NULL, NULL, 0),
(324, 1, 'Вход', NULL, NULL, NULL, NULL, 0),
(327, 1, 'Новости', NULL, NULL, NULL, NULL, 0),
(329, 1, 'Карта сайта', NULL, NULL, NULL, NULL, 0),
(330, 1, 'Восстановление пароля', NULL, NULL, NULL, NULL, 0),
(331, 1, 'Форма регистрации', NULL, NULL, NULL, NULL, 0),
(336, 1, 'Форма контакта', NULL, NULL, NULL, NULL, 0),
(337, 1, 'Список сообщений', 'Архив сообщений формы контакта', NULL, NULL, NULL, 0),
(350, 1, 'Фотогалерея', NULL, NULL, NULL, NULL, 0),
(351, 1, 'Google sitemap page', NULL, NULL, NULL, NULL, 0),
(352, 1, 'Магазин', NULL, NULL, NULL, NULL, 0),
(353, 1, 'Редактор товаров', NULL, NULL, NULL, NULL, 0),
(354, 1, 'Редактор типов', NULL, NULL, NULL, NULL, 0),
(355, 1, 'Редактор производителей', NULL, NULL, NULL, NULL, 0),
(356, 1, 'Редактор статусов заказа', NULL, NULL, NULL, NULL, 0),
(381, 1, 'Редактор статусов товара', NULL, NULL, NULL, NULL, 0),
(383, 1, 'Редактор валюты', NULL, NULL, NULL, NULL, 0),
(388, 1, 'Форма заказа', NULL, NULL, NULL, NULL, 0),
(389, 1, 'Корзина', NULL, NULL, NULL, NULL, 0),
(390, 1, 'Толстые слонопотамы', NULL, NULL, NULL, NULL, 0),
(391, 1, 'Просто текстовая страница', NULL, NULL, NULL, NULL, 0),
(392, 1, 'Раздел состоящий из текстовых страниц', NULL, NULL, NULL, NULL, 0),
(393, 1, 'Еще одна текстовая страница', NULL, NULL, NULL, NULL, 0),
(394, 1, 'И еще одна текстовая страница', NULL, NULL, NULL, NULL, 0),
(395, 1, 'Эта страница - пример переадресации', NULL, NULL, NULL, NULL, 0),
(396, 1, 'Разное', NULL, NULL, NULL, NULL, 0),
(397, 1, 'История заказов', NULL, NULL, NULL, NULL, 0),
(7, 2, 'Управління сайтом', NULL, NULL, NULL, NULL, 0),
(80, 2, 'Демонстраційна версія CMS Energine', NULL, NULL, NULL, NULL, 1),
(324, 2, 'Вхід', NULL, NULL, NULL, NULL, 0),
(327, 2, 'Новини', NULL, NULL, NULL, NULL, 0),
(329, 2, 'Карта сайту', NULL, NULL, NULL, NULL, 0),
(330, 2, 'Поновлення паролю', NULL, NULL, NULL, NULL, 0),
(331, 2, 'Форма реєстрації', NULL, NULL, NULL, NULL, 0),
(336, 2, 'Форма контакту', NULL, NULL, NULL, NULL, 0),
(337, 2, 'Список повідомлень', NULL, NULL, NULL, NULL, 0),
(350, 2, 'Фотогалерея', NULL, NULL, NULL, NULL, 0),
(351, 2, 'Google sitemap page', NULL, NULL, NULL, NULL, 0),
(352, 2, 'Магазин', NULL, NULL, NULL, NULL, 0),
(353, 2, 'Редактор товарів', NULL, NULL, NULL, NULL, 0),
(354, 2, 'Редактор типів', NULL, NULL, NULL, NULL, 0),
(355, 2, 'Редактор виробників', NULL, NULL, NULL, NULL, 0),
(356, 2, 'Редактор статусів замовлення', NULL, NULL, NULL, NULL, 0),
(381, 2, 'Редактор статусів товару', NULL, NULL, NULL, NULL, 0),
(383, 2, 'Редаткор валюти', NULL, NULL, NULL, NULL, 0),
(388, 2, 'Форма замовлення', NULL, NULL, NULL, NULL, 0),
(389, 2, 'Кошик', NULL, NULL, NULL, NULL, 0),
(390, 2, 'Огрядні слонопотами', NULL, NULL, NULL, NULL, 0),
(391, 2, 'Звичайна текстова сторінка', NULL, NULL, NULL, NULL, 0),
(392, 2, 'Розділ з текстових сторінок', NULL, NULL, NULL, NULL, 0),
(393, 2, 'Ще одна текстова сторінка', NULL, NULL, NULL, NULL, 0),
(394, 2, 'І ще одна текстова сторінка', NULL, NULL, NULL, NULL, 0),
(395, 2, 'Ця сторінка - приклад переадресування', NULL, NULL, NULL, NULL, 0),
(396, 2, 'Різне', NULL, NULL, NULL, NULL, 0),
(397, 2, 'Замовлення', NULL, NULL, NULL, NULL, 0),
(7, 3, 'Site management', NULL, NULL, NULL, NULL, 0),
(80, 3, 'Energine demo version', NULL, NULL, NULL, NULL, 0),
(324, 3, 'Entrance', NULL, NULL, NULL, NULL, 0),
(327, 3, 'News', NULL, NULL, NULL, NULL, 0),
(329, 3, 'Sitemap', NULL, NULL, NULL, NULL, 0),
(330, 3, 'Restore password', NULL, NULL, NULL, NULL, 0),
(331, 3, 'Registration form', NULL, NULL, NULL, NULL, 0),
(336, 3, 'Contact form', NULL, NULL, NULL, NULL, 0),
(337, 3, 'Feedback list', NULL, NULL, NULL, NULL, 0),
(350, 3, 'Gallery', NULL, NULL, NULL, NULL, 0),
(351, 3, 'Google sitemap page', NULL, NULL, NULL, NULL, 0),
(352, 3, 'Shop', NULL, NULL, NULL, NULL, 0),
(353, 3, 'Product editor', NULL, NULL, NULL, NULL, 0),
(354, 3, 'Type editor', NULL, NULL, NULL, NULL, 0),
(355, 3, 'Manufacturer editor', NULL, NULL, NULL, NULL, 0),
(356, 3, 'Order status editor', NULL, NULL, NULL, NULL, 0),
(381, 3, 'Product status editor', NULL, NULL, NULL, NULL, 0),
(383, 3, 'Currency editor', NULL, NULL, NULL, NULL, 0),
(388, 3, 'Order form', NULL, NULL, NULL, NULL, 0),
(389, 3, 'Basket', NULL, NULL, NULL, NULL, 0),
(390, 3, 'Fat Heffalumps', NULL, NULL, NULL, NULL, 0),
(391, 3, 'Simple text page', NULL, NULL, NULL, NULL, 0),
(392, 3, 'Text pages', NULL, NULL, NULL, NULL, 0),
(393, 3, 'Another text page', NULL, NULL, NULL, NULL, 0),
(394, 3, 'Another one text page', NULL, NULL, NULL, NULL, 0),
(395, 3, 'Redirect example', NULL, NULL, NULL, NULL, 0),
(396, 3, 'Etc', NULL, NULL, NULL, NULL, 0),
(397, 3, 'Orders', NULL, NULL, NULL, NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `share_sitemap_uploads`
--

DROP TABLE IF EXISTS `share_sitemap_uploads`;
CREATE TABLE IF NOT EXISTS `share_sitemap_uploads` (
  `smap_id` int(10) unsigned NOT NULL,
  `upl_id` int(10) unsigned NOT NULL,
  `upl_is_main` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`smap_id`,`upl_id`,`upl_is_main`),
  KEY `upl_id` (`upl_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `share_sitemap_uploads`
--

INSERT INTO `share_sitemap_uploads` (`smap_id`, `upl_id`, `upl_is_main`) VALUES
(391, 45, 0),
(394, 45, 0),
(391, 46, 0),
(391, 48, 0);

-- --------------------------------------------------------

--
-- Table structure for table `share_templates`
--

DROP TABLE IF EXISTS `share_templates`;
CREATE TABLE IF NOT EXISTS `share_templates` (
  `tmpl_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `tmpl_name` char(150) NOT NULL DEFAULT '',
  `tmpl_icon` varchar(255) DEFAULT NULL,
  `tmpl_layout` char(50) NOT NULL DEFAULT '',
  `tmpl_content` char(50) NOT NULL DEFAULT '',
  `tmpl_is_system` tinyint(1) NOT NULL DEFAULT '0',
  `tmpl_order_num` int(10) unsigned DEFAULT '1',
  PRIMARY KEY (`tmpl_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=34 ;

--
-- Dumping data for table `share_templates`
--

INSERT INTO `share_templates` (`tmpl_id`, `tmpl_name`, `tmpl_icon`, `tmpl_layout`, `tmpl_content`, `tmpl_is_system`, `tmpl_order_num`) VALUES
(3, 'Список подразделов', 'templates/icons/divisions_list.icon.gif', 'default.layout.xml', 'childs.content.xml', 0, 13),
(13, 'Текстовая страница', 'templates/icons/text_page.icon.gif', 'default.layout.xml', 'textblock.content.xml', 0, 12),
(14, 'Лента новостей', 'templates/icons/feed.icon.gif', 'default.layout.xml', 'news.content.xml', 0, 15),
(15, 'Форма авторизации', 'templates/icons/login_form.icon.gif', 'default.layout.xml', 'login.content.xml', 0, 17),
(16, 'Форма контакта', 'templates/icons/feedback_form.icon.gif', 'default.layout.xml', 'feedback_form.content.xml', 0, 16),
(17, 'Карта сайта', 'templates/icons/sitemap.icon.gif', 'default.layout.xml', 'map.content.xml', 0, 21),
(18, 'Форма восстановления пароля', 'templates/icons/restore_password_form.icon.gif', 'default.layout.xml', 'restore_password.content.xml', 0, 22),
(19, 'Форма регистрации/Редактор профиля', 'templates/icons/profile_form.icon.gif', 'default.layout.xml', 'register.content.xml', 0, 23),
(20, 'Фотогалерея', 'templates/icons/gallery.icon.gif', 'default.layout.xml', 'gallery.content.xml', 0, 14),
(21, 'Список сообщений', 'templates/icons/editor.icon.gif', 'admin.layout.xml', 'feedback_list.content.xml', 0, 24),
(22, 'Google sitemap', 'templates/icons/google.icon.gif', 'empty.layout.xml', 'google_sitemap.content.xml', 1, 20),
(23, 'Список товаров', 'templates/icons/divisions_list.icon.gif', 'catalogue.layout.xml', 'product_division_list.content.xml', 0, 11),
(24, 'Редактор товаров', 'templates/icons/editor.icon.gif', 'admin.layout.xml', 'product_editor.content.xml', 0, 10),
(25, 'Редактор производителей', 'templates/icons/editor.icon.gif', 'admin.layout.xml', 'producer_editor.content.xml', 0, 9),
(26, 'Редактор статусов товара', 'templates/icons/editor.icon.gif', 'admin.layout.xml', 'product_status_editor.content.xml', 0, 8),
(27, 'Редактор типов', 'templates/icons/editor.icon.gif', 'admin.layout.xml', 'product_type_editor.content.xml', 0, 7),
(28, 'Редактор статусов', 'templates/icons/editor.icon.gif', 'admin.layout.xml', 'order_status.content.xml', 0, 6),
(29, 'Редактор валюты', 'templates/icons/editor.icon.gif', 'admin.layout.xml', 'curr_editor.content.xml', 0, 5),
(30, 'Главная страница', 'templates/icons/home_page.icon.gif', 'default.layout.xml', 'main.content.xml', 0, 4),
(31, 'Форма заказа', 'templates/icons/form.icon.gif', 'order.layout.xml', 'order.content.xml', 0, 3),
(32, 'Корзина', 'templates/icons/form.icon.gif', 'order.layout.xml', 'basket.content.xml', 0, 2),
(33, 'История заказов', 'templates/icons/editor.icon.gif', 'admin.layout.xml', 'order_history.content.xml', 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `share_textblocks`
--

DROP TABLE IF EXISTS `share_textblocks`;
CREATE TABLE IF NOT EXISTS `share_textblocks` (
  `tb_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `smap_id` int(10) unsigned DEFAULT NULL,
  `tb_num` char(50) NOT NULL DEFAULT '1',
  PRIMARY KEY (`tb_id`),
  UNIQUE KEY `smap_id` (`smap_id`,`tb_num`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=118 ;

--
-- Dumping data for table `share_textblocks`
--

INSERT INTO `share_textblocks` (`tb_id`, `smap_id`, `tb_num`) VALUES
(70, NULL, '1'),
(73, NULL, 'ContactTextBlock'),
(74, NULL, 'FeedbackTextBlock'),
(65, NULL, 'FooterTextBlock'),
(77, NULL, 'InfoTextBlock'),
(108, NULL, 'PartnersTextBlock'),
(72, NULL, 'PaymentTextBlock'),
(105, NULL, 'SidebarTextBlock'),
(89, 7, '1'),
(16, 80, '1'),
(83, 80, '2'),
(104, 80, '3'),
(109, 327, '1'),
(111, 331, '1'),
(112, 331, '2'),
(113, 331, '3'),
(110, 350, '1'),
(114, 391, '1'),
(116, 392, '1'),
(115, 393, '1'),
(117, 394, '1');

-- --------------------------------------------------------

--
-- Table structure for table `share_textblocks_translation`
--

DROP TABLE IF EXISTS `share_textblocks_translation`;
CREATE TABLE IF NOT EXISTS `share_textblocks_translation` (
  `tb_id` int(10) unsigned NOT NULL DEFAULT '0',
  `lang_id` int(10) unsigned NOT NULL DEFAULT '0',
  `tb_content` text NOT NULL,
  UNIQUE KEY `tb_id` (`tb_id`,`lang_id`),
  KEY `lang_id` (`lang_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `share_textblocks_translation`
--

INSERT INTO `share_textblocks_translation` (`tb_id`, `lang_id`, `tb_content`) VALUES
(16, 1, 'И вот наконец долгожданная версия Energine 2.3.6.<br/>\r\nКак всегда — старые ошибки исправили, новые добавили :)<br/>\r\nНо кроме ошибок добавился еще и <strong>модуль интернет магазина</strong>.<br/>\r\n<br/>\r\n2.3.6.1 — исправлены проблемы с формой заказа<br/>\r\n2.3.7 — произведена оптимизация производительности (число запросов к базе уменьшилось в среднем в 5 раз, скорость отработки страницы увеличилась процентов на 20%)<br/>\r\n<br/>\r\nВход в режим администратора:<br/>\r\n<ul> <li>Логин: <strong>demo@energine.org</strong> </li> <li>Пароль: <strong>demo</strong> </li></ul>'),
(16, 2, '<ul> <li>Ім''я користувача: <strong>demo@energine.org</strong> </li> <li>Пароль: <strong>demo</strong> </li></ul>'),
(16, 3, '<div> <ul> <li>Login: <strong>demo@energine.org</strong> </li> <li>Password: <strong>demo</strong> </li> </ul> <p> Energine is a content management system which allows to support web-applications (including websites) of any level of complexity. Energine is based on Energine CMF — a power full toolkit for web-application development using XML/XSLT transformations. </p> <p> Main features of Energine are: </p> <ol> <li>Multi-language support. Energine supports unbounded quantity of languages with ability to translate not only content of a site, but buttons, emails, captions too. </li> <li>User''s access delimitation. User''s access control system allows to edit user''s rights to access and edit different parts of a website. </li> <li>Visual text editor. A built in WYSIWYG (what you see is what you get) editor is a handy tool to edit web site''s content and preview it. </li> <li>Files. Common file storage allows to use one method to work with files in forms and with a help of text editor. </li> <li>Structure site management. Web site''s structure represented as a tree. User can add, edit and delete it''s nodes to modify parts of a site. </li> </ol></div>'),
(65, 1, '<span class="copyright">Powered by <a href= "http://energine.org/">Energine</a></span>'),
(65, 2, '<span class="copyright">Powered by <a href="http://energine.org/">Energine</a></span> '),
(65, 3, '<span class="copyright">Powered by <a href= "http://energine.org/">Energine</a></span>'),
(70, 1, '<p>\n  Существует два способа создания\n  страницы.\n</p>\n<ol>\n  <li>\n    <div>\n      Создание страницы из панели\n      управления.\n    </div>\n  </li>\n  <li>\n    <div>\n      Создание страницы с помощью\n      редактора разделов.\n    </div>\n  </li>\n</ol>\n<p>\n  Для создания страницы из панели\n  управления необходимо зайти на\n  раздел, в котором будет находиться\n  новая страница, и нажать на кнопку\n  Добавить страницу в панели\n  управления.\n</p><img src="uploads/public/control-panel/1207829716.jpg" alt= "iz-1" align="" border="0" height="142" hspace="0" vspace="0" width="500" />\n<p>\n  После нажатия кнопки открывается\n  окно создания страницы.На форме\n  находятся несколько\n  вкладок(Свойства, Русский,\n  Украинский, Английский, Права на\n  страницу).\n</p>\n<p>\n  <strong>Вкладка Свойства</strong> - тут\n  находятся основные поля,\n  определяющие поведение и положение\n  страницы в иерархии сайта.\n</p>\n<p>\n  <img alt=   "Создание страницы - вкладка Свойства"   src="uploads/how-to-create-page/1174390903.jpg" border="0"   height="301" hspace="0" width="400" />\n</p>\n<p>\n  Родительский раздел. Указывает на\n  раздел в котором будет находиться\n  страница. При нажатии на кнопку "..."\n  открывается окно выбора разделов, в\n  котором необходимо выбрать\n  необходимый раздел.\n</p>\n<p>\n  <img alt="Выбор родительского раздела"   src="uploads/how-to-create-page/1174392215.jpg" border="0"   height="305" hspace="0" width="400" />\n</p>\n<p>\n  По умолчанию - указан текущий\n  раздел.\n</p>\n<p>\n  Сегмент URI. Это часть адреса\n  страницы, которая однозначно\n  идентифицирует эту страницу.\n  Например сегмент URI текущей\n  страницы - "how-to-create-new-page". Сегмент URI\n  может содержать только маленькие\n  латинские бувы, цифры и знак "-".\n</p>\n<p>\n  Шаблон страницы - перечень\n  компонентов на этой странице. Дл%\n</p>'),
(83, 1, ''),
(83, 2, ''),
(89, 1, '<p>\n  Раздел "Управление сайтом"\n  предоставляет администратору\n  сайта возможность управлять\n  пользователями, языковыми\n  версиями, интернет-магазином и\n  другими функциональностями.\n</p>'),
(89, 2, '<p>\n  Розділ "Управління сайтом" надає\n  адміністратору сайту можливість\n  керувати користувачами, мовними\n  версіями, інтернет-магазином та\n  іншими функціональностями.\n</p>'),
(89, 3, '<br/>\r\n'),
(109, 1, '<p> <strong>Для редактирования списка новостей вам необходимо (в режиме администратора) перейти в режим редактирования страницы и воспользоваться дополнительной панелью редактирования новостей.</strong></p>'),
(110, 1, '<p> <strong>Для редактирования фотогалереи вам необходимо (в режиме администратора) перейти в режим редактирования страницы и воспользоваться дополнительной панелью редактирования фотогалереи.</strong></p>'),
(111, 1, '<p> Введите Ваш логин (в качестве логина используется адрес электронной почты ) и полное имя. Система автоматически сгенерит пароль и отправит вам по указанному адресу.<br/>\r\n</p>'),
(112, 1, '<p> В режиме администратора на этой странице отображается и форма регистрации нового пользователя и форма редактирования профиля пользователя.</p><p> В режиме пользователя — отображается только форма редактирования профиля.</p>'),
(113, 1, '<strong>Примечание для администратора:</strong><div> Для того чтобы изменить текст письма приходящего при регистрации, вам необходимо в редакторе переводов изменить значение констант <strong>TXT_BODY_REGISTER</strong> (для тела письма) и <strong>TXT_SUBJ_REGISTER</strong> (для темы письма).<br/>\r\n <br/>\r\n В теле письма вы можете использовать переменные $login, $password, $name — вместо них будут подставлены данные пользователя.<br/>\r\n <br/>\r\n</div>'),
(114, 1, '<p> Это текст на текстовой странице. А внизу — список страниц того же уровня что и текущая.</p>'),
(115, 1, '<div> <p> Energine is a content management system which allows to support web-applications (including websites) of any level of complexity. Energine is based on Energine CMF — a power full toolkit for web-application development using XML/XSLT transformations. </p> <p> Main features of Energine are: </p> <ol> <li>Multi-language support. Energine supports unbounded quantity of languages with ability to translate not only content of a site, but buttons, emails, captions too. </li> <li>User''s access delimitation. User''s access control system allows to edit user''s rights to access and edit different parts of a website. </li> <li>Visual text editor. A built in WYSIWYG (what you see is what you get) editor is a handy tool to edit web site''s content and preview it. </li> <li>Files. Common file storage allows to use one method to work with files in forms and with a help of text editor. </li> <li>Structure site management. Web site''s structure represented as a tree. User can add, edit and delete it''s nodes to modify parts of a site. </li> <li>Shop module. Additional module which allows to create and use eShop. </li> </ol></div>'),
(116, 1, '<p> Это — список дочерних страниц, то есть всех страниц находящихся под текущим разделом.<br/>\r\n</p>'),
(117, 1, '<p> Я не знаю что написать на этой странице.<br/>\r\n</p>');

-- --------------------------------------------------------

--
-- Table structure for table `share_uploads`
--

DROP TABLE IF EXISTS `share_uploads`;
CREATE TABLE IF NOT EXISTS `share_uploads` (
  `upl_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `upl_path` varchar(250) NOT NULL,
  `upl_name` varchar(250) NOT NULL DEFAULT '',
  `upl_data` text,
  PRIMARY KEY (`upl_id`),
  UNIQUE KEY `upl_path` (`upl_path`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=53 ;

--
-- Dumping data for table `share_uploads`
--

INSERT INTO `share_uploads` (`upl_id`, `upl_path`, `upl_name`, `upl_data`) VALUES
(45, 'uploads/public/12665704674248.gif', 'Energine core', NULL),
(46, 'uploads/public/12665745065727.gif', 'heffalump.gif', NULL),
(47, 'uploads/public/12665754338542.png', 'Heffalump-2.png', NULL),
(48, 'uploads/public/12665754906067.png', 'Heffalump-3.png', NULL),
(49, 'uploads/public/12671938041279.jpg', 'Huffalump-Lumpy-Dance.jpg', NULL),
(50, 'uploads/public/12671938143931.jpg', 'Huffalump-Lumpy-Roo.jpg', NULL),
(51, 'uploads/public/skrinshoty', 'Скриншоты', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `shop_basket`
--

DROP TABLE IF EXISTS `shop_basket`;
CREATE TABLE IF NOT EXISTS `shop_basket` (
  `basket_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `product_id` int(10) unsigned NOT NULL DEFAULT '0',
  `session_id` int(10) unsigned NOT NULL DEFAULT '0',
  `basket_count` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`basket_id`),
  UNIQUE KEY `product_id` (`product_id`,`session_id`),
  KEY `basket_ibfk_2` (`session_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=10 ;

--
-- Dumping data for table `shop_basket`
--


-- --------------------------------------------------------

--
-- Table structure for table `shop_currency`
--

DROP TABLE IF EXISTS `shop_currency`;
CREATE TABLE IF NOT EXISTS `shop_currency` (
  `curr_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `curr_is_main` tinyint(1) DEFAULT NULL,
  `curr_abbr` char(3) NOT NULL DEFAULT '',
  `curr_rate` float unsigned NOT NULL DEFAULT '0',
  `curr_order_num` tinyint(4) DEFAULT '1',
  PRIMARY KEY (`curr_id`),
  UNIQUE KEY `curr_abbr` (`curr_abbr`),
  UNIQUE KEY `curr_is_main` (`curr_is_main`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=9 ;

--
-- Dumping data for table `shop_currency`
--

INSERT INTO `shop_currency` (`curr_id`, `curr_is_main`, `curr_abbr`, `curr_rate`, `curr_order_num`) VALUES
(2, NULL, 'UAH', 1, 1),
(3, NULL, 'RUR', 3.7, 4),
(4, 1, 'USD', 0.12, 2),
(8, NULL, 'EUR', 0.0897, 3);

-- --------------------------------------------------------

--
-- Table structure for table `shop_currency_translation`
--

DROP TABLE IF EXISTS `shop_currency_translation`;
CREATE TABLE IF NOT EXISTS `shop_currency_translation` (
  `curr_id` int(10) unsigned NOT NULL DEFAULT '0',
  `lang_id` int(10) unsigned NOT NULL DEFAULT '0',
  `curr_name` char(50) NOT NULL DEFAULT '',
  `curr_format` char(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`curr_id`,`lang_id`),
  KEY `lang_id` (`lang_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `shop_currency_translation`
--

INSERT INTO `shop_currency_translation` (`curr_id`, `lang_id`, `curr_name`, `curr_format`) VALUES
(2, 1, 'Гривна наличная', '%s грн.'),
(2, 2, 'Гривня готівкова', '%s грн.'),
(2, 3, 'Hryvna', '%s hrn'),
(3, 1, 'Русский рубль', '%s руб.'),
(3, 2, 'Російський рубль', '%s руб.'),
(3, 3, 'Russian rouble', '%s roub'),
(4, 1, 'Доллар США', '$%s'),
(4, 2, 'Долар США', '$%s'),
(4, 3, 'US Dollar', '$%s'),
(8, 1, 'Евро', '%s евро'),
(8, 2, 'Євро', '%s євро'),
(8, 3, 'Euro', '€%s');

-- --------------------------------------------------------

--
-- Table structure for table `shop_discounts`
--

DROP TABLE IF EXISTS `shop_discounts`;
CREATE TABLE IF NOT EXISTS `shop_discounts` (
  `dscnt_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `group_id` int(10) unsigned NOT NULL DEFAULT '0',
  `dscnt_name` char(100) NOT NULL DEFAULT '',
  `dscnt_percent` tinyint(3) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`dscnt_id`),
  KEY `group_id` (`group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- Dumping data for table `shop_discounts`
--


-- --------------------------------------------------------

--
-- Table structure for table `shop_orders`
--

DROP TABLE IF EXISTS `shop_orders`;
CREATE TABLE IF NOT EXISTS `shop_orders` (
  `order_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `u_id` int(10) unsigned DEFAULT NULL,
  `os_id` int(10) unsigned NOT NULL DEFAULT '0',
  `order_comment` text,
  `order_delivery_comment` text,
  `order_detail` text,
  `user_detail` text NOT NULL,
  `order_created` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`order_id`),
  KEY `u_id` (`u_id`),
  KEY `os_id` (`os_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=12 ;

--
-- Dumping data for table `shop_orders`
--

INSERT INTO `shop_orders` (`order_id`, `u_id`, `os_id`, `order_comment`, `order_delivery_comment`, `order_detail`, `user_detail`, `order_created`) VALUES
(3, 1, 1, NULL, NULL, 'a:1:{i:0;a:11:{s:9:"basket_id";s:2:"14";s:10:"product_id";s:1:"1";s:10:"session_id";s:3:"325";s:12:"basket_count";s:1:"1";s:12:"product_name";s:29:"Название товара";s:13:"product_price";s:3:"$12";s:12:"product_summ";s:3:"$12";s:26:"product_summ_with_discount";N;s:7:"curr_id";s:1:"2";s:15:"product_segment";s:16:"nazvanije-tovara";s:12:"product_code";s:9:"126766767";}}', 'a:4:{s:4:"u_id";s:1:"1";s:6:"u_name";s:17:"demo@energine.org";s:10:"u_fullname";s:4:"demo";s:22:"order_delivery_comment";s:0:"";}', '2010-02-09 13:23:34'),
(11, 1, 1, NULL, NULL, 'a:2:{i:0;a:10:{s:9:"basket_id";s:1:"8";s:10:"product_id";s:1:"4";s:10:"session_id";s:4:"3029";s:12:"basket_count";s:1:"1";s:12:"product_name";s:35:"Розовый слонопотам";s:13:"product_price";s:13:"12000 грн.";s:12:"product_summ";s:13:"12000 грн.";s:7:"curr_id";s:1:"2";s:15:"product_segment";s:18:"rozovyj-slonopotam";s:12:"product_code";s:3:"123";}i:1;a:10:{s:9:"basket_id";s:1:"9";s:10:"product_id";s:1:"5";s:10:"session_id";s:4:"3029";s:12:"basket_count";s:1:"1";s:12:"product_name";s:37:"Плюшевый слонопотам";s:13:"product_price";s:12:"4500 грн.";s:12:"product_summ";s:12:"4500 грн.";s:7:"curr_id";s:1:"2";s:15:"product_segment";s:21:"plyushevyj-slonopotam";s:12:"product_code";s:6:"211212";}}', 'a:4:{s:4:"u_id";s:1:"1";s:6:"u_name";s:17:"demo@energine.org";s:10:"u_fullname";s:10:"Павка";s:22:"order_delivery_comment";s:0:"";}', '2010-02-28 14:05:10');

-- --------------------------------------------------------

--
-- Table structure for table `shop_order_statuses`
--

DROP TABLE IF EXISTS `shop_order_statuses`;
CREATE TABLE IF NOT EXISTS `shop_order_statuses` (
  `os_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `os_priority` smallint(5) unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`os_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `shop_order_statuses`
--

INSERT INTO `shop_order_statuses` (`os_id`, `os_priority`) VALUES
(1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `shop_order_statuses_translation`
--

DROP TABLE IF EXISTS `shop_order_statuses_translation`;
CREATE TABLE IF NOT EXISTS `shop_order_statuses_translation` (
  `os_id` int(10) unsigned NOT NULL DEFAULT '0',
  `lang_id` int(10) unsigned NOT NULL DEFAULT '0',
  `os_name` varchar(200) NOT NULL DEFAULT '',
  PRIMARY KEY (`os_id`,`lang_id`),
  KEY `order_status_translation_ibfk_2` (`lang_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `shop_order_statuses_translation`
--

INSERT INTO `shop_order_statuses_translation` (`os_id`, `lang_id`, `os_name`) VALUES
(1, 1, 'Заказан'),
(1, 2, 'Замовлений'),
(1, 3, 'Ordered');

-- --------------------------------------------------------

--
-- Table structure for table `shop_producers`
--

DROP TABLE IF EXISTS `shop_producers`;
CREATE TABLE IF NOT EXISTS `shop_producers` (
  `producer_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `producer_name` char(150) NOT NULL DEFAULT '',
  `producer_segment` char(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`producer_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=14 ;

--
-- Dumping data for table `shop_producers`
--

INSERT INTO `shop_producers` (`producer_id`, `producer_name`, `producer_segment`) VALUES
(12, 'Slonopotam Inc.', 'slonopotam-inc'),
(13, 'Heffalump factory LTD.', 'heffalump-factory-ltd');

-- --------------------------------------------------------

--
-- Table structure for table `shop_products`
--

DROP TABLE IF EXISTS `shop_products`;
CREATE TABLE IF NOT EXISTS `shop_products` (
  `product_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `smap_id` int(10) unsigned NOT NULL DEFAULT '0',
  `pt_id` int(10) unsigned DEFAULT NULL,
  `producer_id` int(10) unsigned DEFAULT NULL,
  `product_code` char(100) NOT NULL DEFAULT '',
  `product_segment` char(50) DEFAULT NULL,
  `ps_id` int(10) unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`product_id`),
  UNIQUE KEY `product_code` (`product_code`),
  KEY `smap_id` (`smap_id`),
  KEY `pt_id` (`pt_id`),
  KEY `producer_id` (`producer_id`),
  KEY `ps_id` (`ps_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=7 ;

--
-- Dumping data for table `shop_products`
--

INSERT INTO `shop_products` (`product_id`, `smap_id`, `pt_id`, `producer_id`, `product_code`, `product_segment`, `ps_id`) VALUES
(4, 390, 41, 13, '123', 'rozovyj-slonopotam', 1),
(5, 390, 41, 12, '211212', 'plyushevyj-slonopotam', 1),
(6, 396, 41, NULL, '23444', 'zapasnoj-khobot-dlya-slonopotama', 1);

-- --------------------------------------------------------

--
-- Table structure for table `shop_products_translation`
--

DROP TABLE IF EXISTS `shop_products_translation`;
CREATE TABLE IF NOT EXISTS `shop_products_translation` (
  `product_id` int(10) unsigned NOT NULL DEFAULT '0',
  `lang_id` int(10) unsigned NOT NULL DEFAULT '0',
  `product_name` varchar(200) NOT NULL DEFAULT '',
  `product_short_description_rtf` text NOT NULL,
  `product_description_rtf` text NOT NULL,
  PRIMARY KEY (`product_id`,`lang_id`),
  KEY `lang_id` (`lang_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `shop_products_translation`
--

INSERT INTO `shop_products_translation` (`product_id`, `lang_id`, `product_name`, `product_short_description_rtf`, `product_description_rtf`) VALUES
(4, 1, 'Розовый слонопотам', 'Вся информация о повадках и облике слонопотамов известна лишь из высказываний и снов двух персонажей этих рассказов — <a href="http://ru.wikipedia.org/wiki/%D0%92%D0%B8%D0%BD%D0%BD%D0%B8-%D0%9F%D1%83%D1%85">Винни-Пуха</a> и <a href="http://ru.wikipedia.org/wiki/%D0%9F%D1%8F%D1%82%D0%B0%D1%87%D0%BE%D0%BA">Пятачка</a>. Согласно этим персонажам, слонопотамы представляют собой огромных клыкастых рычащих существ, обожающих <a href="http://ru.wikipedia.org/wiki/%D0%9C%D1%91%D0%B4">мёд</a> и <a href="http://ru.wikipedia.org/wiki/%D0%96%D1%91%D0%BB%D1%83%D0%B4%D1%8C">жёлуди</a>. Считается, что слонопотамы любят гулять и при этом мурлыкают себе под нос песенку и постоянно смотрят на небо, а при встрече они говорят «Хо-Хо».<br/>\r\n', 'Вся информация о повадках и облике слонопотамов известна лишь из высказываний и снов двух персонажей этих рассказов — <a href="http://ru.wikipedia.org/wiki/%D0%92%D0%B8%D0%BD%D0%BD%D0%B8-%D0%9F%D1%83%D1%85">Винни-Пуха</a> и <a href="http://ru.wikipedia.org/wiki/%D0%9F%D1%8F%D1%82%D0%B0%D1%87%D0%BE%D0%BA">Пятачка</a>. Согласно этим персонажам, слонопотамы представляют собой огромных клыкастых рычащих существ, обожающих <a href="http://ru.wikipedia.org/wiki/%D0%9C%D1%91%D0%B4">мёд</a> и <a href="http://ru.wikipedia.org/wiki/%D0%96%D1%91%D0%BB%D1%83%D0%B4%D1%8C">жёлуди</a>. Считается, что слонопотамы любят гулять и при этом мурлыкают себе под нос песенку и постоянно смотрят на небо, а при встрече они говорят «Хо-Хо». В настоящее время слонопотамы встречаются редко, особенно весной, однако их всё-таки можно поймать в западню, в виде очень глубокой ямы с приманкой из горшочка с мёдом. Некоторые повадки слонопотамов в книге упоминаются лишь вскользь, поэтому остаётся загадкой, идут ли слонопотамы на свист, едят ли они <a href="http://ru.wikipedia.org/wiki/%D0%A1%D1%8B%D1%80">сыр</a>, и любят ли они поросят.'),
(4, 2, 'Рожевий слонопотам', 'In the fifth chapter of <a href="http://en.wikipedia.org/wiki/Winnie-the-Pooh_%28book%29">Winnie-the-Pooh</a>, Pooh and <a href="http://en.wikipedia.org/wiki/Piglet_%28Winnie_the_Pooh%29">Piglet</a> attempt bravely to capture a heffalump in a trap. However, no heffalumps are ever caught in their trap, and indeed they never meet a heffalump in the course of the books. The sole actual appearance of heffalumps in the books come as Pooh tries to put himself to sleep: &quot;[H]e tried counting Heffalumps [but] every Heffalump that he counted was making straight for a pot of Pooh''s honey… [and] when the five hundred and eighty-seventh Heffalumps were licking their jaws, and saying to themselves, ''Very good honey this, I don''t know when I''ve tasted better'', Pooh could bear it no longer.&quot; We learn nothing more about the nature of the beasts in the writings.', 'In the fifth chapter of <a href="http://en.wikipedia.org/wiki/Winnie-the-Pooh_%28book%29">Winnie-the-Pooh</a>, Pooh and <a href="http://en.wikipedia.org/wiki/Piglet_%28Winnie_the_Pooh%29">Piglet</a> attempt bravely to capture a heffalump in a trap. However, no heffalumps are ever caught in their trap, and indeed they never meet a heffalump in the course of the books. The sole actual appearance of heffalumps in the books come as Pooh tries to put himself to sleep: &quot;[H]e tried counting Heffalumps [but] every Heffalump that he counted was making straight for a pot of Pooh''s honey… [and] when the five hundred and eighty-seventh Heffalumps were licking their jaws, and saying to themselves, ''Very good honey this, I don''t know when I''ve tasted better'', Pooh could bear it no longer.&quot; We learn nothing more about the nature of the beasts in the writings.'),
(4, 3, 'Pink heffalump', 'In the fifth chapter of <a href="http://en.wikipedia.org/wiki/Winnie-the-Pooh_%28book%29">Winnie-the-Pooh</a>, Pooh and <a href="http://en.wikipedia.org/wiki/Piglet_%28Winnie_the_Pooh%29">Piglet</a> attempt bravely to capture a heffalump in a trap. However, no heffalumps are ever caught in their trap, and indeed they never meet a heffalump in the course of the books. The sole actual appearance of heffalumps in the books come as Pooh tries to put himself to sleep: &quot;[H]e tried counting Heffalumps [but] every Heffalump that he counted was making straight for a pot of Pooh''s honey… [and] when the five hundred and eighty-seventh Heffalumps were licking their jaws, and saying to themselves, ''Very good honey this, I don''t know when I''ve tasted better'', Pooh could bear it no longer.&quot; We learn nothing more about the nature of the beasts in the writings.', 'In the fifth chapter of <a href="http://en.wikipedia.org/wiki/Winnie-the-Pooh_%28book%29">Winnie-the-Pooh</a>, Pooh and <a href="http://en.wikipedia.org/wiki/Piglet_%28Winnie_the_Pooh%29">Piglet</a> attempt bravely to capture a heffalump in a trap. However, no heffalumps are ever caught in their trap, and indeed they never meet a heffalump in the course of the books. The sole actual appearance of heffalumps in the books come as Pooh tries to put himself to sleep: &quot;[H]e tried counting Heffalumps [but] every Heffalump that he counted was making straight for a pot of Pooh''s honey… [and] when the five hundred and eighty-seventh Heffalumps were licking their jaws, and saying to themselves, ''Very good honey this, I don''t know when I''ve tasted better'', Pooh could bear it no longer.&quot; We learn nothing more about the nature of the beasts in the writings.'),
(5, 1, 'Плюшевый слонопотам', 'В пятой главе книги «Винни-Пух и все-все-все» <a href="http://ru.wikipedia.org/w/index.php?title=%D0%9A%D1%80%D0%B8%D1%81%D1%82%D0%BE%D1%84%D0%B5%D1%80_%D0%A0%D0%BE%D0%B1%D0%B8%D0%BD&amp;amp;amp;action=edit&amp;amp;amp;redlink=1">Кристофер Робин</a> во время еды рассказывает с набитым ртом <a href="http://ru.wikipedia.org/wiki/%D0%92%D0%B8%D0%BD%D0%BD%D0%B8-%D0%9F%D1%83%D1%85">Винни-Пуху</a> и <a href="http://ru.wikipedia.org/wiki/%D0%9F%D1%8F%D1%82%D0%B0%D1%87%D0%BE%D0%BA">Пятачку</a>, что он видел слона, однако вместо слова «слон» он произносит слово «слонопотам».', 'В пятой главе книги «Винни-Пух и все-все-все» <a href="http://ru.wikipedia.org/w/index.php?title=%D0%9A%D1%80%D0%B8%D1%81%D1%82%D0%BE%D1%84%D0%B5%D1%80_%D0%A0%D0%BE%D0%B1%D0%B8%D0%BD&amp;amp;amp;action=edit&amp;amp;amp;redlink=1">Кристофер Робин</a> во время еды рассказывает с набитым ртом <a href="http://ru.wikipedia.org/wiki/%D0%92%D0%B8%D0%BD%D0%BD%D0%B8-%D0%9F%D1%83%D1%85">Винни-Пуху</a> и <a href="http://ru.wikipedia.org/wiki/%D0%9F%D1%8F%D1%82%D0%B0%D1%87%D0%BE%D0%BA">Пятачку</a>, что он видел слона, однако вместо слова «слон» он произносит слово «слонопотам». Пятачок с Винни-Пухом делают вид, что они знают кто такие слонопотамы, и чтобы не показать свою неосведомлённость, говорят даже, что каждый из них тоже видел это животное. В итоге, Пятачок с Винни-Пухом сами начинают верить в существование слонопотамов, и даже решают поймать одного из них. Они устраивают ловушку в виде глубокой ямы с приманкой из горшочка с остатками мёда, куда вместо слонопотама попадается сам Винни-Пух.'),
(5, 2, 'Слонопотам', 'В пятой главе книги «Винни-Пух и все-все-все» <a href="http://ru.wikipedia.org/w/index.php?title=%D0%9A%D1%80%D0%B8%D1%81%D1%82%D0%BE%D1%84%D0%B5%D1%80_%D0%A0%D0%BE%D0%B1%D0%B8%D0%BD&amp;amp;amp;action=edit&amp;amp;amp;redlink=1">Кристофер Робин</a> во время еды рассказывает с набитым ртом <a href="http://ru.wikipedia.org/wiki/%D0%92%D0%B8%D0%BD%D0%BD%D0%B8-%D0%9F%D1%83%D1%85">Винни-Пуху</a> и <a href="http://ru.wikipedia.org/wiki/%D0%9F%D1%8F%D1%82%D0%B0%D1%87%D0%BE%D0%BA">Пятачку</a>, что он видел слона, однако вместо слова «слон» он произносит слово «слонопотам».', 'В пятой главе книги «Винни-Пух и все-все-все» <a href="http://ru.wikipedia.org/w/index.php?title=%D0%9A%D1%80%D0%B8%D1%81%D1%82%D0%BE%D1%84%D0%B5%D1%80_%D0%A0%D0%BE%D0%B1%D0%B8%D0%BD&amp;amp;amp;action=edit&amp;amp;amp;redlink=1">Кристофер Робин</a> во время еды рассказывает с набитым ртом <a href="http://ru.wikipedia.org/wiki/%D0%92%D0%B8%D0%BD%D0%BD%D0%B8-%D0%9F%D1%83%D1%85">Винни-Пуху</a> и <a href="http://ru.wikipedia.org/wiki/%D0%9F%D1%8F%D1%82%D0%B0%D1%87%D0%BE%D0%BA">Пятачку</a>, что он видел слона, однако вместо слова «слон» он произносит слово «слонопотам». Пятачок с Винни-Пухом делают вид, что они знают кто такие слонопотамы, и чтобы не показать свою неосведомлённость, говорят даже, что каждый из них тоже видел это животное. В итоге, Пятачок с Винни-Пухом сами начинают верить в существование слонопотамов, и даже решают поймать одного из них. Они устраивают ловушку в виде глубокой ямы с приманкой из горшочка с остатками мёда, куда вместо слонопотама попадается сам Винни-Пух.'),
(5, 3, 'Heffalump', '<p> Although this is never explicitly stated, it is generally thought that heffalumps are <a href="http://en.wikipedia.org/wiki/Elephant">elephants</a> from a child''s viewpoint (the word «heffalump» being a child''s attempt at pronouncing «elephant»)<sup><a href="http://en.wikipedia.org/wiki/Heffalump#cite_note-OED-0"><span>[</span>1<span>]</span></a></sup>: <a href="http://en.wikipedia.org/wiki/E._H._Shepard">E. H. Shepard</a>''s illustrations in <a href="http://en.wikipedia.org/wiki/A._A._Milne">A. A. Milne</a>''s original books depict heffalumps (as seen in Piglet''s dreams) as looking very much like elephants.</p>', '<p> Although this is never explicitly stated, it is generally thought that heffalumps are <a href="http://en.wikipedia.org/wiki/Elephant">elephants</a> from a child''s viewpoint (the word «heffalump» being a child''s attempt at pronouncing «elephant»)<sup><a href="http://en.wikipedia.org/wiki/Heffalump#cite_note-OED-0"><span>[</span>1<span>]</span></a></sup>: <a href="http://en.wikipedia.org/wiki/E._H._Shepard">E. H. Shepard</a>''s illustrations in <a href="http://en.wikipedia.org/wiki/A._A._Milne">A. A. Milne</a>''s original books depict heffalumps (as seen in Piglet''s dreams) as looking very much like elephants.</p><p> In Disney''s adaptations of the stories, Heffalumps are first mentioned in the 1968 featurette <em><a href="http://en.wikipedia.org/wiki/Winnie_the_Pooh_and_the_Blustery_Day">Winnie the Pooh and the Blustery Day</a></em>, and seem to be a product of <a href="http://en.wikipedia.org/wiki/Tigger">Tigger</a>''s imagination. Heffalumps first actual appearance was in the television series <em><a href="http://en.wikipedia.org/wiki/The_New_Adventures_of_Winnie_the_Pooh">The New Adventures of Winnie the Pooh</a></em>. In both the animated films and all subsequent television series, they are also depicted as looking like elephants, albeit slightly cuddlier and less fierce than those Pooh imagines in the books and with rabbit-like tails.</p>'),
(6, 1, 'Запасной хобот для слонопотама', 'Хобот как хобот<br/>\r\n', '<strong>Хобот</strong>, или <strong>хоботок</strong> — непарный вырост на переднем конце тела <a href="http://ru.wikipedia.org/wiki/%D0%9C%D0%BD%D0%BE%D0%B3%D0%BE%D0%BA%D0%BB%D0%B5%D1%82%D0%BE%D1%87%D0%BD%D1%8B%D0%B5">животного</a>, обычно обладающий подвижностью (способностью изгибаться и/или втягиваться). Термин используется в качестве общего названия для <a href="http://ru.wikipedia.org/wiki/%D0%93%D0%BE%D0%BC%D0%BE%D0%BB%D0%BE%D0%B3%D0%B8%D1%8F_%28%D0%B1%D0%B8%D0%BE%D0%BB%D0%BE%D0%B3%D0%B8%D1%8F%29">негомологичных</a> <a href="http://ru.wikipedia.org/wiki/%D0%9E%D1%80%D0%B3%D0%B0%D0%BD_%28%D0%B1%D0%B8%D0%BE%D0%BB%D0%BE%D0%B3%D0%B8%D1%8F%29">органов</a> у многих групп организмов.'),
(6, 2, 'Запасний хобот', '<strong>Хобот</strong>, или <strong>хоботок</strong> — непарный вырост на переднем конце тела <a href="http://ru.wikipedia.org/wiki/%D0%9C%D0%BD%D0%BE%D0%B3%D0%BE%D0%BA%D0%BB%D0%B5%D1%82%D0%BE%D1%87%D0%BD%D1%8B%D0%B5">животного</a>, обычно обладающий подвижностью (способностью изгибаться и/или втягиваться). Термин используется в качестве общего названия для <a href="http://ru.wikipedia.org/wiki/%D0%93%D0%BE%D0%BC%D0%BE%D0%BB%D0%BE%D0%B3%D0%B8%D1%8F_%28%D0%B1%D0%B8%D0%BE%D0%BB%D0%BE%D0%B3%D0%B8%D1%8F%29">негомологичных</a> <a href="http://ru.wikipedia.org/wiki/%D0%9E%D1%80%D0%B3%D0%B0%D0%BD_%28%D0%B1%D0%B8%D0%BE%D0%BB%D0%BE%D0%B3%D0%B8%D1%8F%29">органов</a> у многих групп организмов.', '<strong>Хобот</strong>, или <strong>хоботок</strong> — непарный вырост на переднем конце тела <a href="http://ru.wikipedia.org/wiki/%D0%9C%D0%BD%D0%BE%D0%B3%D0%BE%D0%BA%D0%BB%D0%B5%D1%82%D0%BE%D1%87%D0%BD%D1%8B%D0%B5">животного</a>, обычно обладающий подвижностью (способностью изгибаться и/или втягиваться). Термин используется в качестве общего названия для <a href="http://ru.wikipedia.org/wiki/%D0%93%D0%BE%D0%BC%D0%BE%D0%BB%D0%BE%D0%B3%D0%B8%D1%8F_%28%D0%B1%D0%B8%D0%BE%D0%BB%D0%BE%D0%B3%D0%B8%D1%8F%29">негомологичных</a> <a href="http://ru.wikipedia.org/wiki/%D0%9E%D1%80%D0%B3%D0%B0%D0%BD_%28%D0%B1%D0%B8%D0%BE%D0%BB%D0%BE%D0%B3%D0%B8%D1%8F%29">органов</a> у многих групп организмов.'),
(6, 3, 'Trunk', '<p> The correct Greek plural is <em>proboscides</em>, but in English it is more common to simply add <em>-es</em>, forming <em>proboscises</em>.</p><p> Although the word derives from the Greek «pro-boskein», the Latin spelling «proboscis» is taken in favor of the Greek «proboskis».</p>', '<p> The correct Greek plural is <em>proboscides</em>, but in English it is more common to simply add <em>-es</em>, forming <em>proboscises</em>.</p><p> Although the word derives from the Greek «pro-boskein», the Latin spelling «proboscis» is taken in favor of the Greek «proboskis».</p>');

-- --------------------------------------------------------

--
-- Table structure for table `shop_product_external_properties`
--

DROP TABLE IF EXISTS `shop_product_external_properties`;
CREATE TABLE IF NOT EXISTS `shop_product_external_properties` (
  `product_code` char(200) NOT NULL DEFAULT '',
  `product_price` decimal(10,2) DEFAULT '0.00',
  `product_count` int(11) DEFAULT NULL,
  `curr_id` int(10) unsigned DEFAULT '1',
  PRIMARY KEY (`product_code`),
  KEY `curr_id` (`curr_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `shop_product_external_properties`
--

INSERT INTO `shop_product_external_properties` (`product_code`, `product_price`, `product_count`, `curr_id`) VALUES
('123', '12000.00', 2, 2),
('211212', '4500.00', 1, 2),
('23444', '12.00', 3, 2);

-- --------------------------------------------------------

--
-- Table structure for table `shop_product_params`
--

DROP TABLE IF EXISTS `shop_product_params`;
CREATE TABLE IF NOT EXISTS `shop_product_params` (
  `pp_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `pt_id` int(10) unsigned NOT NULL DEFAULT '0',
  `pp_type` char(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`pp_id`),
  KEY `pt_id` (`pt_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=8 ;

--
-- Dumping data for table `shop_product_params`
--

INSERT INTO `shop_product_params` (`pp_id`, `pt_id`, `pp_type`) VALUES
(4, 41, 'string'),
(5, 41, 'string'),
(6, 41, 'string'),
(7, 41, 'string');

-- --------------------------------------------------------

--
-- Table structure for table `shop_product_params_translation`
--

DROP TABLE IF EXISTS `shop_product_params_translation`;
CREATE TABLE IF NOT EXISTS `shop_product_params_translation` (
  `pp_id` int(10) unsigned NOT NULL DEFAULT '0',
  `lang_id` int(10) unsigned NOT NULL DEFAULT '0',
  `pp_name` char(150) NOT NULL DEFAULT '',
  PRIMARY KEY (`pp_id`,`lang_id`),
  KEY `lang_id` (`lang_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `shop_product_params_translation`
--

INSERT INTO `shop_product_params_translation` (`pp_id`, `lang_id`, `pp_name`) VALUES
(4, 1, 'Вес'),
(4, 2, 'Вага'),
(4, 3, 'Weight'),
(5, 1, 'Цвет'),
(5, 2, 'Колір'),
(5, 3, 'Color'),
(6, 1, 'Слонопотамистость'),
(6, 2, 'Слонопотамність'),
(6, 3, 'Heffalumpability'),
(7, 1, 'Длина хобота'),
(7, 2, 'Довжина хоботу'),
(7, 3, 'Trunk length');

-- --------------------------------------------------------

--
-- Table structure for table `shop_product_param_values`
--

DROP TABLE IF EXISTS `shop_product_param_values`;
CREATE TABLE IF NOT EXISTS `shop_product_param_values` (
  `product_id` int(10) unsigned NOT NULL DEFAULT '0',
  `pp_id` int(10) unsigned NOT NULL DEFAULT '0',
  `pp_value` text,
  PRIMARY KEY (`product_id`,`pp_id`),
  KEY `product_id` (`product_id`),
  KEY `pp_id` (`pp_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `shop_product_param_values`
--

INSERT INTO `shop_product_param_values` (`product_id`, `pp_id`, `pp_value`) VALUES
(4, 4, '12'),
(4, 5, 'зеленый'),
(4, 6, '345'),
(4, 7, '435'),
(5, 4, '345'),
(5, 5, 'хммм'),
(5, 6, '45'),
(5, 7, '123');

-- --------------------------------------------------------

--
-- Table structure for table `shop_product_statuses`
--

DROP TABLE IF EXISTS `shop_product_statuses`;
CREATE TABLE IF NOT EXISTS `shop_product_statuses` (
  `ps_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ps_is_default` tinyint(1) NOT NULL DEFAULT '0',
  `right_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`ps_id`),
  KEY `gr_id` (`right_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4 ;

--
-- Dumping data for table `shop_product_statuses`
--

INSERT INTO `shop_product_statuses` (`ps_id`, `ps_is_default`, `right_id`) VALUES
(1, 1, 1),
(2, 0, 1),
(3, 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `shop_product_statuses_translation`
--

DROP TABLE IF EXISTS `shop_product_statuses_translation`;
CREATE TABLE IF NOT EXISTS `shop_product_statuses_translation` (
  `ps_id` int(10) unsigned NOT NULL DEFAULT '0',
  `lang_id` int(10) unsigned NOT NULL DEFAULT '0',
  `ps_name` varchar(200) NOT NULL DEFAULT '',
  PRIMARY KEY (`ps_id`,`lang_id`),
  KEY `lang_id` (`lang_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `shop_product_statuses_translation`
--

INSERT INTO `shop_product_statuses_translation` (`ps_id`, `lang_id`, `ps_name`) VALUES
(1, 1, 'В наличии'),
(1, 2, 'В наявності'),
(1, 3, 'Available'),
(2, 1, 'Под заказ'),
(2, 2, 'На замовлення'),
(2, 3, 'Order'),
(3, 1, 'Ожидается'),
(3, 2, 'Очікується'),
(3, 3, 'Expected');

-- --------------------------------------------------------

--
-- Table structure for table `shop_product_types`
--

DROP TABLE IF EXISTS `shop_product_types`;
CREATE TABLE IF NOT EXISTS `shop_product_types` (
  `pt_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `pt_name` char(100) NOT NULL DEFAULT '',
  PRIMARY KEY (`pt_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=42 ;

--
-- Dumping data for table `shop_product_types`
--

INSERT INTO `shop_product_types` (`pt_id`, `pt_name`) VALUES
(41, 'Слонопотам');

-- --------------------------------------------------------

--
-- Table structure for table `shop_product_uploads`
--

DROP TABLE IF EXISTS `shop_product_uploads`;
CREATE TABLE IF NOT EXISTS `shop_product_uploads` (
  `product_id` int(11) unsigned NOT NULL,
  `upl_id` int(11) unsigned NOT NULL,
  `upl_is_main` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`product_id`,`upl_id`,`upl_is_main`),
  KEY `upl_id` (`upl_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `shop_product_uploads`
--

INSERT INTO `shop_product_uploads` (`product_id`, `upl_id`, `upl_is_main`) VALUES
(4, 46, 0),
(6, 46, 0),
(5, 47, 0),
(5, 48, 0),
(6, 48, 0);

-- --------------------------------------------------------

--
-- Table structure for table `user_groups`
--

DROP TABLE IF EXISTS `user_groups`;
CREATE TABLE IF NOT EXISTS `user_groups` (
  `group_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `group_name` char(50) NOT NULL DEFAULT '',
  `group_default` tinyint(1) NOT NULL DEFAULT '0',
  `group_user_default` tinyint(1) NOT NULL DEFAULT '0',
  `group_default_rights` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`group_id`),
  KEY `group_default` (`group_default`),
  KEY `default_access_level` (`group_default_rights`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

--
-- Dumping data for table `user_groups`
--

INSERT INTO `user_groups` (`group_id`, `group_name`, `group_default`, `group_user_default`, `group_default_rights`) VALUES
(1, 'Администратор', 0, 0, 3),
(3, 'Гость', 1, 0, 1),
(4, 'Пользователь', 0, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `user_group_rights`
--

DROP TABLE IF EXISTS `user_group_rights`;
CREATE TABLE IF NOT EXISTS `user_group_rights` (
  `right_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `right_name` char(20) NOT NULL DEFAULT '',
  `right_const` char(20) NOT NULL DEFAULT '',
  PRIMARY KEY (`right_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4 ;

--
-- Dumping data for table `user_group_rights`
--

INSERT INTO `user_group_rights` (`right_id`, `right_name`, `right_const`) VALUES
(1, 'Read only', 'ACCESS_READ'),
(2, 'Edit', 'ACCESS_EDIT'),
(3, 'Full control', 'ACCESS_FULL');

-- --------------------------------------------------------

--
-- Table structure for table `user_users`
--

DROP TABLE IF EXISTS `user_users`;
CREATE TABLE IF NOT EXISTS `user_users` (
  `u_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `u_name` varchar(50) NOT NULL DEFAULT '',
  `u_password` varchar(40) NOT NULL DEFAULT '',
  `u_is_active` tinyint(1) NOT NULL DEFAULT '1',
  `u_fullname` varchar(250) NOT NULL,
  `u_avatar_prfile` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`u_id`),
  UNIQUE KEY `u_login` (`u_name`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `user_users`
--

INSERT INTO `user_users` (`u_id`, `u_name`, `u_password`, `u_is_active`, `u_fullname`, `u_avatar_prfile`) VALUES
(1, 'demo@energine.org', '89e495e7941cf9e40e6980d14a16bf023ccd4c91', 1, 'demo', 'uploads/protected/12673636662855.png');

-- --------------------------------------------------------

--
-- Table structure for table `user_user_groups`
--

DROP TABLE IF EXISTS `user_user_groups`;
CREATE TABLE IF NOT EXISTS `user_user_groups` (
  `u_id` int(10) unsigned NOT NULL DEFAULT '0',
  `group_id` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`u_id`,`group_id`),
  KEY `group_id` (`group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user_user_groups`
--

INSERT INTO `user_user_groups` (`u_id`, `group_id`) VALUES
(1, 1);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `image_photo_gallery`
--
ALTER TABLE `image_photo_gallery`
  ADD CONSTRAINT `image_photo_gallery_ibfk_1` FOREIGN KEY (`smap_id`) REFERENCES `share_sitemap` (`smap_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `image_photo_gallery_ibfk_2` FOREIGN KEY (`pg_photo_img`) REFERENCES `share_uploads` (`upl_path`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `image_photo_gallery_translation`
--
ALTER TABLE `image_photo_gallery_translation`
  ADD CONSTRAINT `image_photo_gallery_translation_ibfk_1` FOREIGN KEY (`pg_id`) REFERENCES `image_photo_gallery` (`pg_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `image_photo_gallery_translation_ibfk_2` FOREIGN KEY (`lang_id`) REFERENCES `share_languages` (`lang_id`) ON DELETE CASCADE;

--
-- Constraints for table `share_access_level`
--
ALTER TABLE `share_access_level`
  ADD CONSTRAINT `share_access_level_ibfk_1` FOREIGN KEY (`smap_id`) REFERENCES `share_sitemap` (`smap_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `share_access_level_ibfk_2` FOREIGN KEY (`group_id`) REFERENCES `user_groups` (`group_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `share_access_level_ibfk_3` FOREIGN KEY (`right_id`) REFERENCES `user_group_rights` (`right_id`) ON DELETE CASCADE;

--
-- Constraints for table `share_lang_tags_translation`
--
ALTER TABLE `share_lang_tags_translation`
  ADD CONSTRAINT `FK_Reference_6` FOREIGN KEY (`ltag_id`) REFERENCES `share_lang_tags` (`ltag_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_tranaslatelv_language` FOREIGN KEY (`lang_id`) REFERENCES `share_languages` (`lang_id`) ON DELETE CASCADE;

--
-- Constraints for table `share_news`
--
ALTER TABLE `share_news`
  ADD CONSTRAINT `share_news_ibfk_1` FOREIGN KEY (`smap_id`) REFERENCES `share_sitemap` (`smap_id`) ON DELETE CASCADE;

--
-- Constraints for table `share_news_translation`
--
ALTER TABLE `share_news_translation`
  ADD CONSTRAINT `share_news_translation_ibfk_1` FOREIGN KEY (`news_id`) REFERENCES `share_news` (`news_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `share_news_translation_ibfk_2` FOREIGN KEY (`lang_id`) REFERENCES `share_languages` (`lang_id`) ON DELETE CASCADE;

--
-- Constraints for table `share_sitemap`
--
ALTER TABLE `share_sitemap`
  ADD CONSTRAINT `share_sitemap_ibfk_7` FOREIGN KEY (`tmpl_id`) REFERENCES `share_templates` (`tmpl_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `share_sitemap_ibfk_8` FOREIGN KEY (`smap_pid`) REFERENCES `share_sitemap` (`smap_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `share_sitemap_translation`
--
ALTER TABLE `share_sitemap_translation`
  ADD CONSTRAINT `FK_sitemaplv_language` FOREIGN KEY (`lang_id`) REFERENCES `share_languages` (`lang_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_sitemaplv_sitemap` FOREIGN KEY (`smap_id`) REFERENCES `share_sitemap` (`smap_id`) ON DELETE CASCADE;

--
-- Constraints for table `share_sitemap_uploads`
--
ALTER TABLE `share_sitemap_uploads`
  ADD CONSTRAINT `share_sitemap_uploads_ibfk_3` FOREIGN KEY (`smap_id`) REFERENCES `share_sitemap` (`smap_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `share_sitemap_uploads_ibfk_4` FOREIGN KEY (`upl_id`) REFERENCES `share_uploads` (`upl_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `share_textblocks`
--
ALTER TABLE `share_textblocks`
  ADD CONSTRAINT `share_textblocks_ibfk_1` FOREIGN KEY (`smap_id`) REFERENCES `share_sitemap` (`smap_id`) ON DELETE CASCADE;

--
-- Constraints for table `share_textblocks_translation`
--
ALTER TABLE `share_textblocks_translation`
  ADD CONSTRAINT `share_textblocks_translation_ibfk_1` FOREIGN KEY (`tb_id`) REFERENCES `share_textblocks` (`tb_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `share_textblocks_translation_ibfk_2` FOREIGN KEY (`lang_id`) REFERENCES `share_languages` (`lang_id`) ON DELETE CASCADE;

--
-- Constraints for table `shop_basket`
--
ALTER TABLE `shop_basket`
  ADD CONSTRAINT `shop_basket_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `shop_products` (`product_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `shop_basket_ibfk_2` FOREIGN KEY (`session_id`) REFERENCES `share_session` (`session_id`) ON DELETE CASCADE;

--
-- Constraints for table `shop_currency_translation`
--
ALTER TABLE `shop_currency_translation`
  ADD CONSTRAINT `shop_currency_translation_ibfk_1` FOREIGN KEY (`curr_id`) REFERENCES `shop_currency` (`curr_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `shop_currency_translation_ibfk_2` FOREIGN KEY (`lang_id`) REFERENCES `share_languages` (`lang_id`) ON DELETE CASCADE;

--
-- Constraints for table `shop_discounts`
--
ALTER TABLE `shop_discounts`
  ADD CONSTRAINT `shop_discounts_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `user_groups` (`group_id`) ON DELETE CASCADE;

--
-- Constraints for table `shop_orders`
--
ALTER TABLE `shop_orders`
  ADD CONSTRAINT `shop_orders_ibfk_1` FOREIGN KEY (`u_id`) REFERENCES `user_users` (`u_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `shop_orders_ibfk_2` FOREIGN KEY (`os_id`) REFERENCES `shop_order_statuses` (`os_id`) ON DELETE CASCADE;

--
-- Constraints for table `shop_order_statuses_translation`
--
ALTER TABLE `shop_order_statuses_translation`
  ADD CONSTRAINT `shop_order_statuses_translation_ibfk_1` FOREIGN KEY (`os_id`) REFERENCES `shop_order_statuses` (`os_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `shop_order_statuses_translation_ibfk_2` FOREIGN KEY (`lang_id`) REFERENCES `share_languages` (`lang_id`) ON DELETE CASCADE;

--
-- Constraints for table `shop_products`
--
ALTER TABLE `shop_products`
  ADD CONSTRAINT `shop_products_ibfk_24` FOREIGN KEY (`smap_id`) REFERENCES `share_sitemap` (`smap_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `shop_products_ibfk_26` FOREIGN KEY (`producer_id`) REFERENCES `shop_producers` (`producer_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `shop_products_ibfk_27` FOREIGN KEY (`ps_id`) REFERENCES `shop_product_statuses` (`ps_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `shop_products_ibfk_28` FOREIGN KEY (`pt_id`) REFERENCES `shop_product_types` (`pt_id`) ON DELETE SET NULL;

--
-- Constraints for table `shop_products_translation`
--
ALTER TABLE `shop_products_translation`
  ADD CONSTRAINT `shop_products_translation_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `shop_products` (`product_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `shop_products_translation_ibfk_2` FOREIGN KEY (`lang_id`) REFERENCES `share_languages` (`lang_id`) ON DELETE CASCADE;

--
-- Constraints for table `shop_product_external_properties`
--
ALTER TABLE `shop_product_external_properties`
  ADD CONSTRAINT `shop_product_external_properties_ibfk_3` FOREIGN KEY (`product_code`) REFERENCES `shop_products` (`product_code`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `shop_product_external_properties_ibfk_4` FOREIGN KEY (`curr_id`) REFERENCES `shop_currency` (`curr_id`);

--
-- Constraints for table `shop_product_params`
--
ALTER TABLE `shop_product_params`
  ADD CONSTRAINT `shop_product_params_ibfk_1` FOREIGN KEY (`pt_id`) REFERENCES `shop_product_types` (`pt_id`) ON DELETE CASCADE;

--
-- Constraints for table `shop_product_params_translation`
--
ALTER TABLE `shop_product_params_translation`
  ADD CONSTRAINT `shop_product_params_translation_ibfk_1` FOREIGN KEY (`pp_id`) REFERENCES `shop_product_params` (`pp_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `shop_product_params_translation_ibfk_2` FOREIGN KEY (`lang_id`) REFERENCES `share_languages` (`lang_id`) ON DELETE CASCADE;

--
-- Constraints for table `shop_product_param_values`
--
ALTER TABLE `shop_product_param_values`
  ADD CONSTRAINT `shop_product_param_values_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `shop_products` (`product_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `shop_product_param_values_ibfk_2` FOREIGN KEY (`pp_id`) REFERENCES `shop_product_params` (`pp_id`) ON DELETE CASCADE;

--
-- Constraints for table `shop_product_statuses`
--
ALTER TABLE `shop_product_statuses`
  ADD CONSTRAINT `shop_product_statuses_ibfk_1` FOREIGN KEY (`right_id`) REFERENCES `user_group_rights` (`right_id`) ON DELETE CASCADE;

--
-- Constraints for table `shop_product_statuses_translation`
--
ALTER TABLE `shop_product_statuses_translation`
  ADD CONSTRAINT `shop_product_statuses_translation_ibfk_1` FOREIGN KEY (`ps_id`) REFERENCES `shop_product_statuses` (`ps_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `shop_product_statuses_translation_ibfk_2` FOREIGN KEY (`lang_id`) REFERENCES `share_languages` (`lang_id`) ON DELETE CASCADE;

--
-- Constraints for table `shop_product_uploads`
--
ALTER TABLE `shop_product_uploads`
  ADD CONSTRAINT `shop_product_uploads_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `shop_products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `shop_product_uploads_ibfk_2` FOREIGN KEY (`upl_id`) REFERENCES `share_uploads` (`upl_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `user_groups`
--
ALTER TABLE `user_groups`
  ADD CONSTRAINT `user_groups_ibfk_1` FOREIGN KEY (`group_default_rights`) REFERENCES `user_group_rights` (`right_id`) ON DELETE CASCADE;

--
-- Constraints for table `user_user_groups`
--
ALTER TABLE `user_user_groups`
  ADD CONSTRAINT `user_user_groups_ibfk_3` FOREIGN KEY (`u_id`) REFERENCES `user_users` (`u_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_user_groups_ibfk_4` FOREIGN KEY (`group_id`) REFERENCES `user_groups` (`group_id`) ON DELETE CASCADE ON UPDATE CASCADE;

SET FOREIGN_KEY_CHECKS=1;

COMMIT;
