"""
In-memory dataset & fallback query engine for CognoDB Graph Database application.
Contains 50 Users, 100 Movies, 50 Actors, 20 Directors, 15 Genres and their graph relationships.
"""

GENRES = [
    {"id": "g1", "name": "Sci-Fi"},
    {"id": "g2", "name": "Action"},
    {"id": "g3", "name": "Drama"},
    {"id": "g4", "name": "Thriller"},
    {"id": "g5", "name": "Adventure"},
    {"id": "g6", "name": "Crime"},
    {"id": "g7", "name": "Mystery"},
    {"id": "g8", "name": "Fantasy"},
    {"id": "g9", "name": "Romance"},
    {"id": "g10", "name": "Animation"},
    {"id": "g11", "name": "Comedy"},
    {"id": "g12", "name": "Horror"},
    {"id": "g13", "name": "Biography"},
    {"id": "g14", "name": "History"},
    {"id": "g15", "name": "IMAX"}
]

DIRECTORS = [
    {"id": "d1", "name": "Christopher Nolan", "photo_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250", "bio": "Master of mind-bending cinematic experiences and IMAX photography."},
    {"id": "d2", "name": "Quentin Tarantino", "photo_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250", "bio": "Renowned for non-linear storytelling and sharp dialogue."},
    {"id": "d3", "name": "Denis Villeneuve", "photo_url": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250", "bio": "Visionary director of sci-fi epics like Dune and Blade Runner 2049."},
    {"id": "d4", "name": "Martin Scorsese", "photo_url": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250", "bio": "Iconic filmmaker known for intense character studies and crime sagas."},
    {"id": "d5", "name": "Steven Spielberg", "photo_url": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=250", "bio": "Pioneer of modern blockbuster cinema and cinematic storytelling."},
    {"id": "d6", "name": "Greta Gerwig", "photo_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250", "bio": "Acclaimed writer-director behind Barbie and Little Women."},
    {"id": "d7", "name": "James Cameron", "photo_url": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=250", "bio": "Pioneer of groundbreaking visual effects in Avatar and Titanic."},
    {"id": "d8", "name": "Bong Joon-ho", "photo_url": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250", "bio": "Oscar-winning South Korean director of Parasite and Snowpiercer."},
    {"id": "d9", "name": "Ridley Scott", "photo_url": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250", "bio": "Legendary director of Alien, Gladiator, and Blade Runner."},
    {"id": "d10", "name": "David Fincher", "photo_url": "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=250", "bio": "Master of dark thrillers like Fight Club, Se7en, and The Social Network."},
    {"id": "d11", "name": "Hayao Miyazaki", "photo_url": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=250", "bio": "Co-founder of Studio Ghibli and anime legend."},
    {"id": "d12", "name": "Guillermo del Toro", "photo_url": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=250", "bio": "Visual auteur of dark fantasy like Pan's Labyrinth and The Shape of Water."},
    {"id": "d13", "name": "Wes Anderson", "photo_url": "https://images.unsplash.com/photo-1480429370139-e0132c086e2a?auto=format&fit=crop&q=80&w=250", "bio": "Known for distinctive symmetry, vivid pastel colors, and quirky characters."},
    {"id": "d14", "name": "Chloé Zhao", "photo_url": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250", "bio": "Oscar-winning director of Nomadland."},
    {"id": "d15", "name": "Jordan Peele", "photo_url": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=250", "bio": "Modern horror visionary behind Get Out and Us."},
    {"id": "d16", "name": "Taika Waititi", "photo_url": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250", "bio": "New Zealand director known for comedic style in Jojo Rabbit and Thor."},
    {"id": "d17", "name": "Spike Lee", "photo_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250", "bio": "Iconic director of Do the Right Thing and BlacKkKlansman."},
    {"id": "d18", "name": "Alfonso Cuarón", "photo_url": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250", "bio": "Visionary behind Gravity, Children of Men, and Roma."},
    {"id": "d19", "name": "Lana Wachowski", "photo_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250", "bio": "Co-creator of The Matrix saga."},
    {"id": "d20", "name": "Damien Chazelle", "photo_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250", "bio": "Director of Whiplash and La La Land."}
]

ACTORS = [
    {"id": "a1", "name": "Leonardo DiCaprio", "birth_year": 1974, "photo_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250", "bio": "Oscar winner known for Inception, Titanic, and The Revenant."},
    {"id": "a2", "name": "Christian Bale", "birth_year": 1974, "photo_url": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250", "bio": "Versatile actor famous for The Dark Knight trilogy."},
    {"id": "a3", "name": "Timothée Chalamet", "birth_year": 1995, "photo_url": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250", "bio": "Star of Dune, Call Me By Your Name, and Wonka."},
    {"id": "a4", "name": "Zendaya", "birth_year": 1996, "photo_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250", "bio": "Emmy winner starring in Dune, Spider-Man, and Euphoria."},
    {"id": "a5", "name": "Brad Pitt", "birth_year": 1963, "photo_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250", "bio": "Global star of Fight Club, Once Upon a Time in Hollywood, and Se7en."},
    {"id": "a6", "name": "Margot Robbie", "birth_year": 1990, "photo_url": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250", "bio": "Star and producer of Barbie, The Wolf of Wall Street."},
    {"id": "a7", "name": "Cillian Murphy", "birth_year": 1976, "photo_url": "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=250", "bio": "Oscar winner for Oppenheimer and star of Peaky Blinders."},
    {"id": "a8", "name": "Robert Pattinson", "birth_year": 1986, "photo_url": "https://images.unsplash.com/photo-1480429370139-e0132c086e2a?auto=format&fit=crop&q=80&w=250", "bio": "Star of The Batman, Tenet, and The Lighthouse."},
    {"id": "a9", "name": "Florence Pugh", "birth_year": 1996, "photo_url": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=250", "bio": "Acclaimed actress in Oppenheimer, Midsommar, and Little Women."},
    {"id": "a10", "name": "Samuel L. Jackson", "birth_year": 1948, "photo_url": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=250", "bio": "Iconic actor in Pulp Fiction and the Marvel Cinematic Universe."},
    {"id": "a11", "name": "Tom Hardy", "birth_year": 1977, "photo_url": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250", "bio": "Star of Mad Max: Fury Road, Inception, and Venom."},
    {"id": "a12", "name": "Scarlett Johansson", "birth_year": 1984, "photo_url": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250", "bio": "Star of Marriage Story, Black Widow, and Lost in Translation."},
    {"id": "a13", "name": "Keanu Reeves", "birth_year": 1964, "photo_url": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=250", "bio": "Iconic star of The Matrix and John Wick series."},
    {"id": "a14", "name": "Joaquin Phoenix", "birth_year": 1974, "photo_url": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=250", "bio": "Oscar winner for Joker and Her."},
    {"id": "a15", "name": "Morgan Freeman", "birth_year": 1937, "photo_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250", "bio": "Legendary actor of The Shawshank Redemption and Se7en."},
    {"id": "a16", "name": "Matthew McConaughey", "birth_year": 1969, "photo_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250", "bio": "Oscar winner for Dallas Buyers Club and star of Interstellar."},
    {"id": "a17", "name": "Anne Hathaway", "birth_year": 1982, "photo_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250", "bio": "Star of Interstellar, Les Misérables, and The Dark Knight Rises."},
    {"id": "a18", "name": "Ryan Gosling", "birth_year": 1980, "photo_url": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250", "bio": "Star of Blade Runner 2049, Drive, and Barbie."},
    {"id": "a19", "name": "Oscar Isaac", "birth_year": 1979, "photo_url": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250", "bio": "Star of Dune, Ex Machina, and Moon Knight."},
    {"id": "a20", "name": "Javier Bardem", "birth_year": 1969, "photo_url": "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=250", "bio": "Oscar winner for No Country for Old Men and Dune star."}
]

# Generate 30 more actors to reach 50 actors total
for i in range(21, 51):
    ACTORS.append({
        "id": f"a{i}",
        "name": f"Actor {i} Famous",
        "birth_year": 1975 + (i % 25),
        "photo_url": f"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250",
        "bio": f"Accomplished international actor with accolades across drama and cinema."
    })

# Sample initial 10 Movies with full details
MOVIES = [
    {
        "id": "m1",
        "title": "Inception",
        "release_year": 2010,
        "rating": 8.8,
        "duration_mins": 148,
        "poster_url": "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=500",
        "plot": "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        "genres": ["Sci-Fi", "Action", "Thriller"],
        "director": "Christopher Nolan",
        "director_id": "d1",
        "actors": ["a1", "a11", "a7"]
    },
    {
        "id": "m2",
        "title": "Interstellar",
        "release_year": 2014,
        "rating": 8.7,
        "duration_mins": 169,
        "poster_url": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=500",
        "plot": "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.",
        "genres": ["Sci-Fi", "Drama", "Adventure", "IMAX"],
        "director": "Christopher Nolan",
        "director_id": "d1",
        "actors": ["a16", "a17", "a11"]
    },
    {
        "id": "m3",
        "title": "The Dark Knight",
        "release_year": 2008,
        "rating": 9.0,
        "duration_mins": 152,
        "poster_url": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=500",
        "plot": "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
        "genres": ["Action", "Crime", "Drama", "Thriller"],
        "director": "Christopher Nolan",
        "director_id": "d1",
        "actors": ["a2", "a15", "a7"]
    },
    {
        "id": "m4",
        "title": "Dune: Part Two",
        "release_year": 2024,
        "rating": 8.6,
        "duration_mins": 166,
        "poster_url": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=500",
        "plot": "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
        "genres": ["Sci-Fi", "Adventure", "Action", "IMAX"],
        "director": "Denis Villeneuve",
        "director_id": "d3",
        "actors": ["a3", "a4", "a9", "a19", "a20"]
    },
    {
        "id": "m5",
        "title": "Pulp Fiction",
        "release_year": 1994,
        "rating": 8.9,
        "duration_mins": 154,
        "poster_url": "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&q=80&w=500",
        "plot": "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
        "genres": ["Crime", "Drama"],
        "director": "Quentin Tarantino",
        "director_id": "d2",
        "actors": ["a5", "a10"]
    },
    {
        "id": "m6",
        "title": "Oppenheimer",
        "release_year": 2023,
        "rating": 8.9,
        "duration_mins": 180,
        "poster_url": "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80&w=500",
        "plot": "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
        "genres": ["Biography", "Drama", "History", "IMAX"],
        "director": "Christopher Nolan",
        "director_id": "d1",
        "actors": ["a7", "a9", "a2", "a11"]
    },
    {
        "id": "m7",
        "title": "Blade Runner 2049",
        "release_year": 2017,
        "rating": 8.0,
        "duration_mins": 164,
        "poster_url": "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=500",
        "plot": "Young Blade Runner K's discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard, who's been missing for thirty years.",
        "genres": ["Sci-Fi", "Mystery", "Drama"],
        "director": "Denis Villeneuve",
        "director_id": "d3",
        "actors": ["a18", "a19"]
    },
    {
        "id": "m8",
        "title": "The Matrix",
        "release_year": 1999,
        "rating": 8.7,
        "duration_mins": 136,
        "poster_url": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=500",
        "plot": "When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.",
        "genres": ["Sci-Fi", "Action"],
        "director": "Lana Wachowski",
        "director_id": "d19",
        "actors": ["a13"]
    },
    {
        "id": "m9",
        "title": "Barbie",
        "release_year": 2023,
        "rating": 7.0,
        "duration_mins": 114,
        "poster_url": "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=500",
        "plot": "Barbie and Ken are having the time of their lives in the colorful and seemingly perfect world of Barbie Land. However, when they get a chance to go to the real world, they soon discover the joys and perils of living among humans.",
        "genres": ["Comedy", "Adventure", "Fantasy"],
        "director": "Greta Gerwig",
        "director_id": "d6",
        "actors": ["a6", "a18"]
    },
    {
        "id": "m10",
        "title": "Fight Club",
        "release_year": 1999,
        "rating": 8.8,
        "duration_mins": 139,
        "poster_url": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=500",
        "plot": "An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.",
        "genres": ["Drama", "Thriller"],
        "director": "David Fincher",
        "director_id": "d10",
        "actors": ["a5"]
    }
]

# Generate remaining 90 movies to reach 100 movies total
movie_titles_seed = [
    ("Avatar: The Way of Water", 2022, 7.6, 192, ["Sci-Fi", "Action", "Adventure"], "d7"),
    ("Parasite", 2019, 8.5, 132, ["Drama", "Thriller", "Comedy"], "d8"),
    ("Gladiator", 2000, 8.5, 155, ["Action", "Adventure", "Drama"], "d9"),
    ("Se7en", 1995, 8.6, 127, ["Crime", "Drama", "Mystery"], "d10"),
    ("Spirited Away", 2001, 8.6, 125, ["Animation", "Adventure", "Fantasy"], "d11"),
    ("The Shape of Water", 2017, 7.3, 123, ["Drama", "Fantasy", "Romance"], "d12"),
    ("The Grand Budapest Hotel", 2014, 8.1, 99, ["Comedy", "Adventure", "Crime"], "d13"),
    ("Nomadland", 2020, 7.3, 107, ["Drama"], "d14"),
    ("Get Out", 2017, 7.8, 104, ["Horror", "Mystery", "Thriller"], "d15"),
    ("Jojo Rabbit", 2019, 7.9, 108, ["Comedy", "Drama", "History"], "d16"),
    ("BlacKkKlansman", 2018, 7.5, 135, ["Biography", "Comedy", "Crime"], "d17"),
    ("Gravity", 2013, 7.7, 91, ["Sci-Fi", "Drama", "Thriller"], "d18"),
    ("Whiplash", 2014, 8.5, 106, ["Drama"], "d20"),
    ("La La Land", 2016, 8.0, 128, ["Comedy", "Drama", "Romance"], "d20"),
    ("Joker", 2019, 8.4, 122, ["Crime", "Drama", "Thriller"], "d10"),
    ("Once Upon a Time in Hollywood", 2019, 7.6, 161, ["Comedy", "Drama"], "d2"),
    ("The Wolf of Wall Street", 2013, 8.2, 180, ["Biography", "Comedy", "Crime"], "d4"),
    ("Goodfellas", 1990, 8.7, 145, ["Biography", "Crime", "Drama"], "d4"),
    ("Shutter Island", 2010, 8.2, 138, ["Mystery", "Thriller"], "d4"),
    ("The Departed", 2006, 8.5, 151, ["Crime", "Drama", "Thriller"], "d4")
]

for idx in range(11, 101):
    seed_item = movie_titles_seed[(idx - 11) % len(movie_titles_seed)]
    title_suffix = f" Volume {idx // 10 + 1}" if idx > 30 else ""
    MOVIES.append({
        "id": f"m{idx}",
        "title": f"{seed_item[0]}{title_suffix}",
        "release_year": seed_item[1] - (idx % 10),
        "rating": round(max(6.5, min(9.4, seed_item[2] + ((idx % 7) - 3) * 0.2)), 1),
        "duration_mins": seed_item[3] + (idx % 25),
        "poster_url": f"https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=500",
        "plot": f"An extraordinary cinematic journey exploring complex human relationships, suspense, and unexpected twists.",
        "genres": seed_item[4],
        "director": [d["name"] for d in DIRECTORS if d["id"] == seed_item[5]][0],
        "director_id": seed_item[5],
        "actors": [f"a{(idx % 20) + 1}", f"a{((idx + 3) % 20) + 1}"]
    })

# 50 Users
USERS = [
    {"id": f"u{i}", "name": f"User {i} Cinephile", "email": f"user{i}@example.com", "avatar_url": f"https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150", "joined_date": "2024-01-15"}
    for i in range(1, 51)
]

# Relationships setup (LIKED, WATCHED, SIMILAR_TO)
USER_LIKES = {}
USER_WATCHES = {}
USER_SIMILARITIES = []

for u in USERS:
    u_id = u["id"]
    u_num = int(u_id[1:])
    # Assign liked movies based on pattern to form rich similarity graph
    liked_m_ids = [f"m{((u_num + k * 3) % 100) + 1}" for k in range(12)]
    watched_m_ids = liked_m_ids + [f"m{((u_num + k * 5) % 100) + 1}" for k in range(8)]
    USER_LIKES[u_id] = list(set(liked_m_ids))
    USER_WATCHES[u_id] = list(set(watched_m_ids))

# Calculate SIMILAR_TO graph between users based on common liked movies
for i in range(len(USERS)):
    for j in range(i + 1, len(USERS)):
        u1_id = USERS[i]["id"]
        u2_id = USERS[j]["id"]
        likes1 = set(USER_LIKES[u1_id])
        likes2 = set(USER_LIKES[u2_id])
        common = likes1.intersection(likes2)
        if len(common) >= 3:
            score = round(len(common) / len(likes1.union(likes2)), 2)
            USER_SIMILARITIES.append({"u1": u1_id, "u2": u2_id, "score": score})
            USER_SIMILARITIES.append({"u1": u2_id, "u2": u1_id, "score": score})
