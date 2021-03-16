from api.db import Player, PlayerSchema, db_connection_ctx
import logging


logger = logging.getLogger(__name__)


def get_players_with_filter(filters):
    try:
        with db_connection_ctx() as db:
            q = db.query(Player).filter_by(**filters)
            results = q.all()
    except Exception as e:
        logger.error("Error loading players.", exc_info=True)
    return results


def to_list(tuple_list):
    return [item[0] for item in tuple_list]


def get_filters():
    divisions = None
    years = None
    teams = None
    try:
        with db_connection_ctx() as db:
            player_query = db.query(Player)
            divisions = player_query.with_entities(Player.lg_id).distinct(Player.lg_id).all()
            years = player_query.with_entities(Player.year_id).distinct(Player.year_id).all()
            teams = player_query.with_entities(Player.team_id).distinct(Player.team_id).all()
    except Exception as e:
        logger.error("Error loading players.", exc_info=True)

    return to_list(divisions), to_list(years), to_list(teams)