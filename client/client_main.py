from flask import Flask, render_template, request, jsonify, session
from flask_session import Session  # You'll need to install flask-session
from werkzeug.utils import secure_filename
import os

# Import the User model (adjust the import path as needed)
from models.user import User  # Make sure this import is correct

""" Step 2: Create a Flask app """
app = Flask(__name__)

# Configure session
app.config['SECRET_KEY'] = 'your_secret_key_here'  # Replace with a secure secret key
app.config['SESSION_TYPE'] = 'filesystem'  # or 'redis', 'memcached', etc.
Session(app)

UPLOAD_FOLDER = 'static/uploads/profile_pics'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Your existing routes...

@app.route('/update_profile', methods=['POST'])
def update_profile():
    # Simulate session (you'll need proper authentication)
    username = session.get('username', 'testuser')  # Remove this in production
    
    if not username:
        return jsonify({'success': False, 'message': 'User not logged in'}), 401
    
    try:
        update_data = request.json
        updated_user = User.update_profile(username, update_data)
        
        if updated_user:
            return jsonify({'success': True})
        else:
            return jsonify({'success': False, 'message': 'Profile update failed'}), 400
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/upload_profile_picture', methods=['POST'])
def upload_profile_picture():
    # Simulate session (you'll need proper authentication)
    username = session.get('username', 'testuser')  # Remove this in production
    
    if not username:
        return jsonify({'success': False, 'message': 'User not logged in'}), 401
    
    if 'profile_pic' not in request.files:
        return jsonify({'success': False, 'message': 'No file uploaded'}), 400
    
    file = request.files['profile_pic']
    
    if file.filename == '':
        return jsonify({'success': False, 'message': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        # Ensure the upload directory exists
        os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
        
        filename = secure_filename(f"{username}_{file.filename}")
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Update user's profile picture in database
        relative_path = f"/static/uploads/profile_pics/{filename}"
        updated_user = User.update_profile_picture(username, relative_path)
        
        if updated_user:
            return jsonify({
                'success': True, 
                'profile_pic_url': relative_path
            })
        else:
            return jsonify({'success': False, 'message': 'Failed to update profile picture'}), 500
    
    return jsonify({'success': False, 'message': 'File type not allowed'}), 400

@app.route('/get_user_profile', methods=['GET'])
def get_user_profile():
    # Simulate session (you'll need proper authentication)
    username = session.get('username', 'testuser')  # Remove this in production
    
    if not username:
        return jsonify({'success': False, 'message': 'User not logged in'}), 401
    
    try:
        user = User.find_by_username(username)
        
        if user:
            return jsonify({
                'success': True, 
                'user': {
                    'username': user.username,
                    'email': user.email,
                    'name': user.name,
                    'gender': user.gender,
                    'placeOfResidence': user.placeOfResidence,
                    'fieldOfStudy': user.fieldOfStudy,
                    'preferredLanguage': user.preferredLanguage,
                    'profile_pic': user.profile_pic if hasattr(user, 'profile_pic') else None
                }
            })
        else:
            return jsonify({'success': False, 'message': 'User not found'}), 404
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500
    
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
    HOST = os.getenv("FLASK_RUN_HOST", "127.0.0.1")
    PORT = int(os.getenv("FLASK_RUN_PORT", 3000))
    app.run(debug=True, host=HOST, port=PORT)