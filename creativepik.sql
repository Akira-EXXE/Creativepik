-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Tempo de geração: 01/12/2025 às 13:11
-- Versão do servidor: 8.0.30
-- Versão do PHP: 8.3.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `creativepik`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `categoria`
--

CREATE TABLE `categoria` (
  `id` int NOT NULL,
  `nome` varchar(100) NOT NULL,
  `logo` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `categoria_imagem`
--

CREATE TABLE `categoria_imagem` (
  `fk_Categoria_id` int NOT NULL,
  `fk_Imagem_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `favoritos`
--

CREATE TABLE `favoritos` (
  `id` int NOT NULL,
  `fk_Imagem_id` int NOT NULL,
  `fk_Usuario_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `imagem`
--

CREATE TABLE `imagem` (
  `id` int NOT NULL,
  `data_criacao` date NOT NULL,
  `titulo` varchar(100) NOT NULL,
  `descricao` text,
  `url` varchar(250) DEFAULT NULL,
  `fk_Usuario_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `imagem`
--

INSERT INTO `imagem` (`id`, `data_criacao`, `titulo`, `descricao`, `url`, `fk_Usuario_id`) VALUES
(1, '2025-12-01', 'Paisagem', 'paisagem', '/uploads/1764594486154-paisagem.jpg', 1);

-- --------------------------------------------------------

--
-- Estrutura para tabela `licenca`
--

CREATE TABLE `licenca` (
  `id` int NOT NULL,
  `nome` varchar(255) NOT NULL,
  `descricao` text,
  `logo` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `licenca`
--

INSERT INTO `licenca` (`id`, `nome`, `descricao`, `logo`) VALUES
(1, 'CC BY', 'Atribuição: permite distribuição, remixagem, adaptação e uso comercial, desde que o crédito seja dado ao autor.', 'https://mirrors.creativecommons.org/presskit/buttons/88x31/png/by.png'),
(2, 'CC BY-SA', 'Atribuição + Compartilha Igual: adaptações devem usar a mesma licença. Comercial permitido.', 'https://mirrors.creativecommons.org/presskit/buttons/88x31/png/by-sa.png'),
(3, 'CC BY-ND', 'Atribuição + Sem Derivações: redistribuição permitida, inclusive comercial, mas sem alterações.', 'https://mirrors.creativecommons.org/presskit/buttons/88x31/png/by-nd.png'),
(4, 'CC BY-NC', 'Atribuição + Não Comercial: permite remixar e adaptar, mas não permite uso comercial.', 'https://mirrors.creativecommons.org/presskit/buttons/88x31/png/by-nc.png'),
(5, 'CC BY-NC-SA', 'Atribuição + Não Comercial + Compartilha Igual: adaptações devem manter a mesma licença e não podem ser comerciais.', 'https://mirrors.creativecommons.org/presskit/buttons/88x31/png/by-nc-sa.png'),
(6, 'CC BY-NC-ND', 'Atribuição + Não Comercial + Sem Derivações: redistribuição permitida, sem alterações e sem fins comerciais.', 'https://mirrors.creativecommons.org/presskit/buttons/88x31/png/by-nc-nd.png'),
(7, 'CC0 1.0 Universal', 'Domínio público: o autor renuncia a todos os direitos. Uso 100% livre, para qualquer finalidade.', 'https://mirrors.creativecommons.org/presskit/buttons/88x31/png/cc-zero.png'),
(8, 'Public Domain Mark', 'Obras que já estão em domínio público sem restrições de direitos autorais.', 'https://mirrors.creativecommons.org/presskit/buttons/88x31/png/publicdomain.png');

-- --------------------------------------------------------

--
-- Estrutura para tabela `licenca_imagem`
--

CREATE TABLE `licenca_imagem` (
  `fk_Licenca_id` int NOT NULL,
  `fk_Imagem_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `licenca_imagem`
--

INSERT INTO `licenca_imagem` (`fk_Licenca_id`, `fk_Imagem_id`) VALUES
(7, 1);

-- --------------------------------------------------------

--
-- Estrutura para tabela `tipo_usuario`
--

CREATE TABLE `tipo_usuario` (
  `id` int NOT NULL,
  `descricao` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `tipo_usuario`
--

INSERT INTO `tipo_usuario` (`id`, `descricao`) VALUES
(1, 'Acesso ilimitado'),
(2, 'Acesso limitado');

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuario`
--

CREATE TABLE `usuario` (
  `id` int NOT NULL,
  `nome` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `senha` varchar(100) NOT NULL,
  `telefone` varchar(50) DEFAULT NULL,
  `data_criacao` date NOT NULL,
  `foto` varchar(100) DEFAULT NULL,
  `fk_Tipo_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `usuario`
--

INSERT INTO `usuario` (`id`, `nome`, `email`, `senha`, `telefone`, `data_criacao`, `foto`, `fk_Tipo_id`) VALUES
(1, 'isis', 'isis@gmail.com', '$2b$10$gxZAOpzel6UG38e3XSw6FOONkdxrFvHoIHkVPqGaBApxjhG8qwWFK', NULL, '2025-11-24', 'avatar.jpg', 2),
(2, 'isis', 'a@gmail.com', '$2b$10$scx7How.jWvDejUdi6KEB.HS6BcbNi8DowTLBst2.c31BG.9QoCLO', NULL, '2025-11-24', 'avatar.jpg', 2),
(3, 'a', 'a2@gmail.com', '$2b$10$dk.HwKLhnJQYUJOvH2JOHuY433nvawAmC2MRmEe7MmdBEjMbSlFXe', NULL, '2025-11-24', 'avatar.jpg', 2),
(4, 'isis', 'isis1@gmail.com', '$2b$10$dGTmjcE0rAlWafOq37swhuhecUmqlpf2HDHOUMnHVdJ5BYmGjQJ5y', NULL, '2025-11-24', '1764001987154-756821884.jpg', 2);

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `categoria`
--
ALTER TABLE `categoria`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `categoria_imagem`
--
ALTER TABLE `categoria_imagem`
  ADD PRIMARY KEY (`fk_Categoria_id`,`fk_Imagem_id`),
  ADD KEY `fk_Imagem_id` (`fk_Imagem_id`);

--
-- Índices de tabela `favoritos`
--
ALTER TABLE `favoritos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_Imagem_id` (`fk_Imagem_id`),
  ADD KEY `fk_Usuario_id` (`fk_Usuario_id`);

--
-- Índices de tabela `imagem`
--
ALTER TABLE `imagem`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_Usuario_id` (`fk_Usuario_id`);

--
-- Índices de tabela `licenca`
--
ALTER TABLE `licenca`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `licenca_imagem`
--
ALTER TABLE `licenca_imagem`
  ADD PRIMARY KEY (`fk_Licenca_id`,`fk_Imagem_id`),
  ADD KEY `fk_Imagem_id` (`fk_Imagem_id`);

--
-- Índices de tabela `tipo_usuario`
--
ALTER TABLE `tipo_usuario`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_Tipo_id` (`fk_Tipo_id`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `categoria`
--
ALTER TABLE `categoria`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `favoritos`
--
ALTER TABLE `favoritos`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `imagem`
--
ALTER TABLE `imagem`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `licenca`
--
ALTER TABLE `licenca`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de tabela `tipo_usuario`
--
ALTER TABLE `tipo_usuario`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `categoria_imagem`
--
ALTER TABLE `categoria_imagem`
  ADD CONSTRAINT `categoria_imagem_ibfk_1` FOREIGN KEY (`fk_Categoria_id`) REFERENCES `categoria` (`id`),
  ADD CONSTRAINT `categoria_imagem_ibfk_2` FOREIGN KEY (`fk_Imagem_id`) REFERENCES `imagem` (`id`);

--
-- Restrições para tabelas `favoritos`
--
ALTER TABLE `favoritos`
  ADD CONSTRAINT `favoritos_ibfk_1` FOREIGN KEY (`fk_Imagem_id`) REFERENCES `imagem` (`id`),
  ADD CONSTRAINT `favoritos_ibfk_2` FOREIGN KEY (`fk_Usuario_id`) REFERENCES `usuario` (`id`);

--
-- Restrições para tabelas `imagem`
--
ALTER TABLE `imagem`
  ADD CONSTRAINT `imagem_ibfk_1` FOREIGN KEY (`fk_Usuario_id`) REFERENCES `usuario` (`id`);

--
-- Restrições para tabelas `licenca_imagem`
--
ALTER TABLE `licenca_imagem`
  ADD CONSTRAINT `licenca_imagem_ibfk_1` FOREIGN KEY (`fk_Licenca_id`) REFERENCES `licenca` (`id`),
  ADD CONSTRAINT `licenca_imagem_ibfk_2` FOREIGN KEY (`fk_Imagem_id`) REFERENCES `imagem` (`id`);

--
-- Restrições para tabelas `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`fk_Tipo_id`) REFERENCES `tipo_usuario` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
