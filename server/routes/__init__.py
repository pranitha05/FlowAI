"""Initialize Flask blueprints."""

""" Step 1: Import the required libraries """
from .auth import auth_routes
from .translator import translator_route
from .user_profile import user_routes

""" Step 2: Define the register_blueprints function """
def register_blueprints(app):
    """Register Flask blueprints."""
    app.register_blueprint(auth_routes)
    app.register_blueprint(translator_route)
    app.register_blueprint(user_routes)

    