from db import init_db, Player, db_connection_ctx
from sqlalchemy import and_
from endpoints import app, get_filters


def test_model():
    init_db()
    with db_connection_ctx() as db:
        players = db.query(Player).filter(
            and_(
                Player.player_id == "karlsc01",
                Player.stint == "1"
            )
        ).one()
    assert players.team_id == "COL"


def test_players_by_attribute():
    app.config["Testing"] = True
    test_app = app.test_client()

    by_division = {"lg_id": "NL"}
    by_year = {"year_id": "2008"}
    by_team = {"team_id": "DET"}

    query_strings = [
        by_division,
        by_year,
        by_team
    ]

    resp = test_app.get("/players", query_string=by_division)
    assert resp.json.get("payload")[0]["AB"] == "0"


def test_filters():
    init_db()
    divisions, years, teams = get_filters()
    assert divisions[0] == "NL"
    assert years[0] == 2000
    assert teams[0] == "CHN"
