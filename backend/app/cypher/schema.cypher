// ==========================================
// CognoDB / Neo4j Schema Constraints & Indexes
// ==========================================

CREATE CONSTRAINT user_id_unique IF NOT EXISTS FOR (u:User) REQUIRE u.id IS UNIQUE;
CREATE CONSTRAINT movie_id_unique IF NOT EXISTS FOR (m:Movie) REQUIRE m.id IS UNIQUE;
CREATE CONSTRAINT actor_id_unique IF NOT EXISTS FOR (a:Actor) REQUIRE a.id IS UNIQUE;
CREATE CONSTRAINT director_id_unique IF NOT EXISTS FOR (d:Director) REQUIRE d.id IS UNIQUE;
CREATE CONSTRAINT genre_id_unique IF NOT EXISTS FOR (g:Genre) REQUIRE g.id IS UNIQUE;

// Indexes for high-performance Cypher query traversals
CREATE INDEX movie_title_index IF NOT EXISTS FOR (m:Movie) ON (m.title);
CREATE INDEX actor_name_index IF NOT EXISTS FOR (a:Actor) ON (a.name);
CREATE INDEX genre_name_index IF NOT EXISTS FOR (g:Genre) ON (g.name);
