from api.db import init_db
from endpoints import app


init_db()
app.run()
