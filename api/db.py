import sqlite3
from marshmallow_sqlalchemy import ModelSchema
from sqlalchemy import create_engine, Column, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import pandas as pd


DB_NAME = "stats.db"


def get_connection():
    return sqlite3.connect(DB_NAME)


engine = create_engine("sqlite://", creator=get_connection)


def get_session():
    Session = sessionmaker()
    return Session(bind=engine)


class db_connection_ctx:
    def __init__(self):
        self.session = None
        self.connection = get_connection()

    def __enter__(self):
        self.session = get_session()
        # for convenience
        self.query = self.session.query
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.session.close()


Base = declarative_base()


class Player(Base):
    __tablename__ = "players"
    player_id = Column("playerID", String(), primary_key=True,)
    year_id = Column("yearID", String())
    stint = Column(String())
    team_id = Column("teamID", String())
    lg_id = Column("lgID", String())
    G = Column(String())
    AB = Column(String())
    R = Column(String())
    H = Column(String())
    two_b = Column("twoB", String())
    three_b = Column("threeB", String())
    HR = Column(String())
    RBI = Column(String())
    SB = Column(String())
    CS = Column(String())
    BB = Column(String())
    SO = Column(String())
    IBB = Column(String())
    HBP = Column(String())
    SH = Column(String())
    SF = Column(String())
    GIDP = Column(String())


class PlayerSchema(ModelSchema):
    class Meta:
        model = Player
        sqla_session = get_session()


def init_db():
    # Create schema in database
    Base.metadata.create_all(bind=engine)
    # load CSV into database
    users = pd.read_csv("batting_stats.csv")
    users.rename(columns={"2B": "twoB", "3B": "threeB"}, inplace=True)
    conn = get_connection()
    users.to_sql("players", conn, if_exists="replace", index=False)
    return users

