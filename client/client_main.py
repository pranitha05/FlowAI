"""step 1 : Import the required libraries"""
from flask import Flask, render_template
import os

""" Step 2: Create a Flask app """
app = Flask(__name__)


""" Step 3: Define the routes """
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/auth')
def auth():
    return render_template('auth.html')

@app.route('/dashboard')
def dashboard():
    return render_template('landing.html')

@app.route('/ai_agent')
def ai_agent():
    return render_template('AI_agent.html')

@app.route('/pomodoro_timer')
def pomodoro_timer():
    return render_template('pomodoro_timer.html')

@app.route('/games')
def games():
    return render_template('games.html')

@app.route('/games/connect_four')
def connect_four():
    return render_template('connect4_index.html')

@app.route('/games/hangman')
def hangman():
    return render_template('hangman_index.html')

@app.route('/games/tik_tac_toe')
def tik_tac_toe():
    return render_template('tictactoe_index.html')

@app.route('/user_profile')
def user_profile():
    return render_template('user_profile.html')

@app.route('/landing')
def landing():
    return render_template('landing.html')

""" Step 4: Start the server """
if __name__ == '__main__':
    HOST = os.getenv("FLASK_RUN_HOST", "127.0.0.1")
    PORT = int(os.getenv("FLASK_RUN_PORT", 3000))
    app.run(debug=True, host=HOST, port=PORT)