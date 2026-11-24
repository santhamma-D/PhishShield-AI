
import sqlite3
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DATABASE = BASE_DIR / "phishshield.db"


def get_connection():
    connection = sqlite3.connect(DATABASE)
    connection.row_factory = sqlite3.Row
    return connection


def init_db():
    connection = get_connection()

    connection.execute("""
        CREATE TABLE IF NOT EXISTS scan_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            scan_type TEXT NOT NULL,
            input_value TEXT NOT NULL,
            risk_level TEXT,
            result TEXT NOT NULL,
            scanned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    connection.commit()
    connection.close()


def save_scan(scan_type, input_value, risk_level, result):
    connection = get_connection()

    connection.execute("""
        INSERT INTO scan_history
        (scan_type, input_value, risk_level, result)
        VALUES (?, ?, ?, ?)
    """, (scan_type, input_value, risk_level, result))

    connection.commit()
    connection.close()


def get_scan_history():
    connection = get_connection()

    records = connection.execute("""
        SELECT * FROM scan_history
        ORDER BY id DESC
    """).fetchall()

    connection.close()
    return [dict(record) for record in records]
