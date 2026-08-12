// ==========================================
// CognoDB / Neo4j Full Seed Data Cypher Script
// ==========================================

// 1. Create Genres
UNWIND [
  {id: "g1", name: "Sci-Fi"},
  {id: "g2", name: "Action"},
  {id: "g3", name: "Drama"},
  {id: "g4", name: "Thriller"},
  {id: "g5", name: "Adventure"},
  {id: "g6", name: "Crime"},
  {id: "g7", name: "Mystery"},
  {id: "g8", name: "Fantasy"},
  {id: "g9", name: "Romance"},
  {id: "g10", name: "Animation"},
  {id: "g11", name: "Comedy"},
  {id: "g12", name: "Horror"},
  {id: "g13", name: "Biography"},
  {id: "g14", name: "History"},
  {id: "g15", name: "IMAX"}
] AS g
MERGE (genre:Genre {id: g.id})
SET genre.name = g.name;

// 2. Create Directors
UNWIND [
  {id: "d1", name: "Christopher Nolan", photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d", bio: "Master of mind-bending cinematic experiences."},
  {id: "d2", name: "Quentin Tarantino", photo_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e", bio: "Renowned for sharp dialogue and non-linear stories."},
  {id: "d3", name: "Denis Villeneuve", photo_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e", bio: "Visionary director of sci-fi epics like Dune."},
  {id: "d4", name: "Martin Scorsese", photo_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7", bio: "Iconic filmmaker behind crime classics."},
  {id: "d5", name: "Steven Spielberg", photo_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d", bio: "Legendary blockbuster filmmaker."},
  {id: "d6", name: "Greta Gerwig", photo_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb", bio: "Acclaimed writer-director behind Barbie."},
  {id: "d7", name: "James Cameron", photo_url: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61", bio: "Pioneer of VFX in Avatar and Titanic."},
  {id: "d8", name: "Bong Joon-ho", photo_url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6", bio: "Oscar-winning director of Parasite."},
  {id: "d9", name: "Ridley Scott", photo_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9", bio: "Legendary director of Alien and Gladiator."},
  {id: "d10", name: "David Fincher", photo_url: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea", bio: "Master of psychological thrillers like Fight Club."}
] AS d
MERGE (dir:Director {id: d.id})
SET dir.name = d.name, dir.photo_url = d.photo_url, dir.bio = d.bio;

// 3. Create Sample Actors
UNWIND [
  {id: "a1", name: "Leonardo DiCaprio", birth_year: 1974, photo_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e", bio: "Oscar winner for The Revenant and Inception star."},
  {id: "a2", name: "Christian Bale", birth_year: 1974, photo_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e", bio: "Famous for The Dark Knight trilogy."},
  {id: "a3", name: "Timothée Chalamet", birth_year: 1995, photo_url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6", bio: "Star of Dune and Wonka."},
  {id: "a4", name: "Zendaya", birth_year: 1996, photo_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb", bio: "Star of Dune and Spider-Man."},
  {id: "a5", name: "Brad Pitt", birth_year: 1963, photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d", bio: "Global icon starring in Fight Club and Pulp Fiction."},
  {id: "a6", name: "Margot Robbie", birth_year: 1990, photo_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2", bio: "Star of Barbie and Wolf of Wall Street."},
  {id: "a7", name: "Cillian Murphy", birth_year: 1976, photo_url: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea", bio: "Oscar winner for Oppenheimer."}
] AS a
MERGE (actor:Actor {id: a.id})
SET actor.name = a.name, actor.birth_year = a.birth_year, actor.photo_url = a.photo_url, actor.bio = a.bio;

// 4. Create Movies and Relationships
MERGE (m1:Movie {id: "m1"})
SET m1.title = "Inception", m1.release_year = 2010, m1.rating = 8.8, m1.duration_mins = 148, m1.poster_url = "https://images.unsplash.com/photo-1536440136628-849c177e76a1", m1.plot = "A thief who steals corporate secrets through dream-sharing technology.";

MERGE (m2:Movie {id: "m2"})
SET m2.title = "Interstellar", m2.release_year = 2014, m2.rating = 8.7, m2.duration_mins = 169, m2.poster_url = "https://images.unsplash.com/photo-1451187580459-43490279c0fa", m2.plot = "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.";

MERGE (m3:Movie {id: "m3"})
SET m3.title = "The Dark Knight", m3.release_year = 2008, m3.rating = 9.0, m3.duration_mins = 152, m3.poster_url = "https://images.unsplash.com/photo-1509198397868-475647b2a1e5", m3.plot = "Batman must accept one of the greatest tests of his ability to fight injustice.";

MERGE (m4:Movie {id: "m4"})
SET m4.title = "Dune: Part Two", m4.release_year = 2024, m4.rating = 8.6, m4.duration_mins = 166, m4.poster_url = "https://images.unsplash.com/photo-1518709268805-4e9042af9f23", m4.plot = "Paul Atreides unites with Chani and the Fremen while seeking revenge.";

MERGE (m5:Movie {id: "m5"})
SET m5.title = "Oppenheimer", m5.release_year = 2023, m5.rating = 8.9, m5.duration_mins = 180, m5.poster_url = "https://images.unsplash.com/photo-1440404653325-ab127d49abc1", m5.plot = "The story of American scientist J. Robert Oppenheimer.";

// Connect Movies to Directors
MATCH (d1:Director {id: "d1"}), (m1:Movie {id: "m1"}) MERGE (d1)-[:DIRECTED]->(m1);
MATCH (d1:Director {id: "d1"}), (m2:Movie {id: "m2"}) MERGE (d1)-[:DIRECTED]->(m2);
MATCH (d1:Director {id: "d1"}), (m3:Movie {id: "m3"}) MERGE (d1)-[:DIRECTED]->(m3);
MATCH (d3:Director {id: "d3"}), (m4:Movie {id: "m4"}) MERGE (d3)-[:DIRECTED]->(m4);
MATCH (d1:Director {id: "d1"}), (m5:Movie {id: "m5"}) MERGE (d1)-[:DIRECTED]->(m5);

// Connect Movies to Genres
MATCH (g1:Genre {id: "g1"}), (m1:Movie {id: "m1"}) MERGE (m1)-[:BELONGS_TO]->(g1);
MATCH (g2:Genre {id: "g2"}), (m1:Movie {id: "m1"}) MERGE (m1)-[:BELONGS_TO]->(g2);
MATCH (g1:Genre {id: "g1"}), (m2:Movie {id: "m2"}) MERGE (m2)-[:BELONGS_TO]->(g1);
MATCH (g3:Genre {id: "g3"}), (m2:Movie {id: "m2"}) MERGE (m2)-[:BELONGS_TO]->(g3);
MATCH (g2:Genre {id: "g2"}), (m3:Movie {id: "m3"}) MERGE (m3)-[:BELONGS_TO]->(g2);
MATCH (g6:Genre {id: "g6"}), (m3:Movie {id: "m3"}) MERGE (m3)-[:BELONGS_TO]->(g6);
MATCH (g1:Genre {id: "g1"}), (m4:Movie {id: "m4"}) MERGE (m4)-[:BELONGS_TO]->(g1);

// Connect Actors to Movies
MATCH (a1:Actor {id: "a1"}), (m1:Movie {id: "m1"}) MERGE (a1)-[:ACTED_IN {character_name: "Cobb"}]->(m1);
MATCH (a2:Actor {id: "a2"}), (m3:Movie {id: "m3"}) MERGE (a2)-[:ACTED_IN {character_name: "Bruce Wayne"}]->(m3);
MATCH (a3:Actor {id: "a3"}), (m4:Movie {id: "m4"}) MERGE (a3)-[:ACTED_IN {character_name: "Paul Atreides"}]->(m4);
MATCH (a4:Actor {id: "a4"}), (m4:Movie {id: "m4"}) MERGE (a4)-[:ACTED_IN {character_name: "Chani"}]->(m4);
MATCH (a7:Actor {id: "a7"}), (m5:Movie {id: "m5"}) MERGE (a7)-[:ACTED_IN {character_name: "J. Robert Oppenheimer"}]->(m5);
MATCH (a7:Actor {id: "a7"}), (m1:Movie {id: "m1"}) MERGE (a7)-[:ACTED_IN {character_name: "Fischer"}]->(m1);

// 5. Create Users and Relationships
MERGE (u1:User {id: "u1"}) SET u1.name = "Alex Mercer", u1.email = "alex@example.com", u1.joined_date = "2024-01-10";
MERGE (u2:User {id: "u2"}) SET u2.name = "Sarah Connor", u2.email = "sarah@example.com", u2.joined_date = "2024-01-12";
MERGE (u3:User {id: "u3"}) SET u3.name = "David Miller", u3.email = "david@example.com", u3.joined_date = "2024-01-15";

// User LIKED & WATCHED
MATCH (u1:User {id: "u1"}), (m1:Movie {id: "m1"}) MERGE (u1)-[:LIKED]->(m1);
MATCH (u1:User {id: "u1"}), (m2:Movie {id: "m2"}) MERGE (u1)-[:LIKED]->(m2);
MATCH (u1:User {id: "u1"}), (m3:Movie {id: "m3"}) MERGE (u1)-[:WATCHED {rating: 9.0}]->(m3);

MATCH (u2:User {id: "u2"}), (m1:Movie {id: "m1"}) MERGE (u2)-[:LIKED]->(m1);
MATCH (u2:User {id: "u2"}), (m4:Movie {id: "m4"}) MERGE (u2)-[:LIKED]->(m4);

MATCH (u3:User {id: "u3"}), (m5:Movie {id: "m5"}) MERGE (u3)-[:LIKED]->(m5);

// User SIMILAR_TO
MATCH (u1:User {id: "u1"}), (u2:User {id: "u2"}) MERGE (u1)-[:SIMILAR_TO {score: 0.85}]->(u2);
MATCH (u2:User {id: "u2"}), (u1:User {id: "u1"}) MERGE (u2)-[:SIMILAR_TO {score: 0.85}]->(u1);
