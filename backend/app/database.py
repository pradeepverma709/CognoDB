import logging
from typing import Any, Dict, List, Optional
from neo4j import GraphDatabase, Driver
from app.config import settings

logger = logging.getLogger("cogndb_driver")
logging.basicConfig(level=logging.INFO)

class DatabaseManager:
    def __init__(self):
        self._driver: Optional[Driver] = None
        self._connected: bool = False

    def connect(self):
        if self._driver is not None:
            return
        
        try:
            logger.info(f"Connecting to CognoDB / Neo4j at {settings.COGNO_DB_URI}...")
            self._driver = GraphDatabase.driver(
                settings.COGNO_DB_URI,
                auth=(settings.COGNO_DB_USER, settings.COGNO_DB_PASSWORD)
            )
            # Verify connectivity
            self._driver.verify_connectivity()
            self._connected = True
            logger.info("Successfully connected to CognoDB / Neo4j graph database!")
        except Exception as e:
            self._connected = False
            logger.warning(f"CognoDB connection notice: Could not connect to database ({str(e)}). Running with mock dataset fallback if needed.")

    def close(self):
        if self._driver:
            self._driver.close()
            self._driver = None
            self._connected = False
            logger.info("CognoDB driver connection closed.")

    @property
    def is_connected(self) -> bool:
        return self._connected

    def execute_query(self, query: str, parameters: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        if not self._connected or not self._driver:
            raise ConnectionError("Database driver is not connected to CognoDB.")
        
        parameters = parameters or {}
        try:
            with self._driver.session() as session:
                result = session.run(query, parameters)
                return [record.data() for record in result]
        except Exception as e:
            logger.error(f"Error executing Cypher query: {query} | Params: {parameters} | Error: {str(e)}")
            raise e

db_manager = DatabaseManager()
