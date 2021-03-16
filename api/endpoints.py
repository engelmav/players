from flask import Flask, request, jsonify
from api.db import PlayerSchema, db_connection_ctx, Player

import logging

from api.services import get_stats_with_filter, get_filters, to_list

app = Flask(__name__)
logger = logging.getLogger(__name__)


def handle_error(error):
    logger.error("Route encountered an error:", error)
    resp = {
        "status": "error",
        "messages": "Something went wrong. Collect error info to show client here.",
    }
    proper_status_code = 500
    return jsonify(resp), proper_status_code


app.register_error_handler(Exception, handle_error)


@app.route("/stats", methods=["GET"])
def players_endpoint():
    filters = request.args.to_dict()

    with db_connection_ctx() as db:
        query = db.query(Player).filter_by(**filters)
        stats = query.all()
        divisions = query.with_entities(Player.lg_id).distinct(Player.lg_id).all()
        years = query.with_entities(Player.year_id).distinct(Player.year_id).all()
        teams = query.with_entities(Player.team_id).distinct(Player.team_id).all()
    stats_schema = PlayerSchema(many=True)
    return jsonify(status="success",
                   payload={"stats": stats_schema.dump(stats),
                            "filterData": {
                                "divisions": to_list(divisions),
                                "years": to_list(years),
                                "teams": to_list(teams)
                            }
                   },
                   messages="Objects retrieved successfully.")
