-- Tabela Tipo_Usuario
CREATE TABLE Tipo_Usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    descricao VARCHAR(20) NOT NULL
) ENGINE=InnoDB;

-- Tabela Usuario
CREATE TABLE Usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    senha VARCHAR(100) NOT NULL,
    telefone VARCHAR(50),
    data_criacao DATE NOT NULL,
    foto VARCHAR(100),
    fk_Tipo_id INT NOT NULL,
    FOREIGN KEY (fk_Tipo_id) REFERENCES Tipo_Usuario(id)
) ENGINE=InnoDB;

-- Tabela Categoria
CREATE TABLE Categoria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    logo VARCHAR(100)
) ENGINE=InnoDB;

-- Tabela Imagem
CREATE TABLE Imagem (
    id INT AUTO_INCREMENT PRIMARY KEY,
    data_criacao DATE NOT NULL,
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT,
    url VARCHAR(250),
    fk_Usuario_id INT NOT NULL,
    FOREIGN KEY (fk_Usuario_id) REFERENCES Usuario(id)
) ENGINE=InnoDB;

-- Tabela Categoria_Imagem (Relacionamento N:N entre Categoria e Imagem)
CREATE TABLE Categoria_Imagem (
    fk_Categoria_id INT NOT NULL,
    fk_Imagem_id INT NOT NULL,
    PRIMARY KEY (fk_Categoria_id, fk_Imagem_id),
    FOREIGN KEY (fk_Categoria_id) REFERENCES Categoria(id),
    FOREIGN KEY (fk_Imagem_id) REFERENCES Imagem(id)
) ENGINE=InnoDB;

-- Tabela Licenca
CREATE TABLE Licenca (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
     logo VARCHAR(100)
) ENGINE=InnoDB;

-- Tabela Licenca_Imagem (Relacionamento N:N entre Licenca e Imagem)
CREATE TABLE Licenca_Imagem (
    fk_Licenca_id INT NOT NULL,
    fk_Imagem_id INT NOT NULL,
    PRIMARY KEY (fk_Licenca_id, fk_Imagem_id),
    FOREIGN KEY (fk_Licenca_id) REFERENCES Licenca(id),
    FOREIGN KEY (fk_Imagem_id) REFERENCES Imagem(id)
) ENGINE=InnoDB;

-- Tabela Tipo_Pagamento
CREATE TABLE Tipo_Pagamento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

-- Tabela Plano
CREATE TABLE Plano (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    duracao DATETIME NOT NULL,
    preco DOUBLE NOT NULL
) ENGINE=InnoDB;

-- Tabela Pagamento
CREATE TABLE Pagamento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    fk_Usuario_id INT NOT NULL,
    valor DOUBLE NOT NULL,
    status INT NOT NULL,
    data_pagamento DATETIME,
    fk_Tipo_Pagamento_id INT NOT NULL,
    fk_Plano_id INT NOT NULL,
    FOREIGN KEY (fk_Usuario_id) REFERENCES Usuario(id),
    FOREIGN KEY (fk_Tipo_Pagamento_id) REFERENCES Tipo_Pagamento(id),
    FOREIGN KEY (fk_Plano_id) REFERENCES Plano(id)
) ENGINE=InnoDB;

-- Tabela Favoritos (Relacionamento 0..1 entre Usuario e Imagem)
CREATE TABLE Favoritos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fk_Imagem_id INT NOT NULL,
    fk_Usuario_id INT NOT NULL,
    FOREIGN KEY (fk_Imagem_id) REFERENCES Imagem(id),
    FOREIGN KEY (fk_Usuario_id) REFERENCES Usuario(id)
) ENGINE=InnoDB;

INSERT INTO `tipo_usuario` (`id`, `descricao`) VALUES ('1', 'Acesso ilimitado'), ('2', 'Acesso limitado');
