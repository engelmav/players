from flask import Flask, request, jsonify
from api.db import PlayerSchema

import logging

from api.services import get_players_with_filter, get_filters

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


@app.route("/players", methods=["GET"])
def players_endpoint():
    filters = request.args.to_dict()

    filtered_players = get_players_with_filter(filters)

    player_schema = PlayerSchema(many=True)
    # We could stream this if the list got any bigger (1MB is pushing it).
    # Flask can use a generator to do this. I'd have to switch to another serialization
    # lib or do it by hand because Marshmallow serialization would consume the entire
    # generator anyway.
    return jsonify(status="success",
                   payload=player_schema.dump(filtered_players),
                   messages="Objects retrieved successfully.")


@app.route("/filters", methods=["GET"])
def get_filters_endpoint():
    divisions, years, teams = get_filters()
    return jsonify(status="success",
                   payload={"divisions": divisions, "years": years, "teams": teams},
                   messages="Filters loaded successfully.")
