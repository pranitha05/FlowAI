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
    return render_template('ai_agent.html')


""" Step 4: Start the server """
if __name__ == '__main__':
    HOST = os.getenv("FLASK_RUN_HOST") 
    PORT = os.getenv("FLASK_RUN_PORT") 
    app.run(debug=True, host=HOST, port=PORT)