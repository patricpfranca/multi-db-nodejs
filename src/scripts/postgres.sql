DROP TABLE IF EXISTS TB_HEROES;
CREATE TABLE TB_HEROES (
  ID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY NOT NULL,
  NOME TEXT NOT NULL,
  PODER TEXT NOT NULL
);

INSERT INTO TB_HEROES (NOME, PODER)
VALUES ('Flash', 'velocidade'),
('Aquaman', 'Falar com os animais'),
('Batman', 'Dinheiro');

SELECT * FROM TB_HEROES;
SELECT * FROM TB_HEROES WHERE NOME = 'Flash';

UPDATE TB_HEROES SET NOME = 'Goku', PODER = 'Deus' WHERE ID = 1;
DELETE FROM TB_HEROES WHERE ID = 2;
