# server/routes/ai_routes.py

from flask import Blueprint, request, jsonify
from ai import generate_to_do_list

ai_routes = Blueprint("ai_routes", __name__)

@ai_routes.route("/generate", methods=["POST"])
def generate():
    data = request.get_json()
    user_input = data.get("user_input")
    api_key = "your_api_key_here"  # Replace with your actual API key
    if not user_input:
        return jsonify({"error": "User input is required"}), 400

    try:
        to_do_list = generate_to_do_list(api_key, user_input)
        return jsonify({"to_do_list": to_do_list})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
