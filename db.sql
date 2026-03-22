CREATE TABLE players (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    join_date DATE DEFAULT CURRENT_DATE
);

CREATE TABLE games (
    id SERIAL PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    genre VARCHAR(50)
);

CREATE TABLE scores (
    id SERIAL PRIMARY KEY,
    player_id INT,
    game_id INT,
    score INT,
    date_played DATE DEFAULT CURRENT_DATE,
    FOREIGN KEY (player_id) REFERENCES players(id),
    FOREIGN KEY (game_id) REFERENCES games(id)
);

INSERT INTO players (name, join_date)
VALUES
    ('Alice Johnson', '2026-01-10'),
    ('Bob Smith',     '2026-02-15'),
    ('Clara Diaz',    '2026-03-18');

INSERT INTO games (title, genre)
VALUES
    ('Shadow Quest',   'RPG'),
    ('Speed Racer',    'Racing'),
    ('Puzzle Master',  'Puzzle');
    
INSERT INTO scores (player_id, game_id, score, date_played)
VALUES
    (1, 1, 4500, '2026-03-01'),
    (1, 2, 3200, '2026-03-03'),
    (2, 1, 5100, '2026-03-02'),
    (2, 3, 2800, '2026-03-05'),
    (3, 2, 4100, '2026-03-04'),
    (3, 3, 3900, '2026-03-06');