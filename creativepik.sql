
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE `usuario` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `tipo` ENUM('normal', 'admin') DEFAULT 'normal',
  `nome` varchar(255) DEFAULT NULL,
  `email` varchar(100) UNIQUE,
  `senha` varchar(100) NOT NULL,
  `data_criacao` datetime
) ENGINE=InnoDB;


--
-- Estrutura para tabela `Imagem`
--

CREATE TABLE `imagem` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `titulo` varchar(100) NOT NULL,
  `descricao` varchar(100) DEFAULT NULL,
  `url_imagem` varchar(255),
  `data_upload` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `usuario_fk` int,
  CONSTRAINT fk_usuario_id FOREIGN KEY (usuario_fk) REFERENCES usuario (id)
) ENGINE=InnoDB;



CREATE TABLE `categoria` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL
) ENGINE=InnoDB;


CREATE TABLE `imagem_categoria` (
  `id_imagem` int,
  `id_categoria` int,
   CONSTRAINT fk_imagem_id FOREIGN KEY (`id_imagem`) REFERENCES imagem (id),
   CONSTRAINT id_categoria FOREIGN KEY (`id_categoria`) REFERENCES categoria (id)
) ENGINE=InnoDB;



