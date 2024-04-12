from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import io
import traceback

app = Flask(__name__)
CORS(app, resources={r"*": {"origins": "*"}})  # Enable CORS for all routes

# Define admin usernames
admin_usernames = {"Acb_admin@2026", "admin2", "admin3"}

# In-memory storage for usernames
usernames = []
questions = []

@app.route('/hi', methods=['GET'])
@app.route('/', methods=['GET'])
def hi():
    return('Hi from Alspencer Coding Bat... I\'m running...'
)
@app.route('/add_username', methods=['POST'])
def add_username():
    data = request.get_json()
    if 'username' in data and data['username']:
        new_username = data['username']
        if new_username not in usernames:
            usernames.append(new_username)
            return jsonify({'success': True, 'message': 'Username added successfully'}), 200
        else:
            return jsonify({'success': False, 'message': 'Username already exists'}), 409
    return jsonify({'success': False, 'message': 'Invalid username'}), 400

@app.route('/get_usernames', methods=['GET'])
def get_usernames():
    return jsonify({'usernames': usernames}), 200

@app.route('/add_friend', methods=['POST'])
def add_friend():
    data = request.get_json()
    if 'friendUsername' in data and data['friendUsername']:
        friend_username = data['friendUsername']
        if friend_username in usernames:
            return jsonify({'success': True, 'message': 'Friend added successfully'}), 200
        else:
            return jsonify({'success': False, 'message': 'Friend does not exist'}), 404
    return jsonify({'success': False, 'message': 'Invalid friend username'}), 400

@app.route('/run_code', methods=['POST'])
def run_code():
    data = request.get_json()
    code = data['code']
    
    # Redirect stdout and stderr to capture print statements and errors
    old_stdout = sys.stdout
    old_stderr = sys.stderr
    redirected_output = sys.stdout = sys.stderr = io.StringIO()

    try:
        # Execute the code
        exec(code)
    except Exception as e:
        # If there's an error, capture it and the traceback
        return jsonify({"output": redirected_output.getvalue(), "error": str(e), "traceback": traceback.format_exc()}), 400
    finally:
        # Reset stdout and stderr to their original values
        sys.stdout = old_stdout
        sys.stderr = old_stderr

    # Get the output from executing the code
    output = redirected_output.getvalue()

    return jsonify({"output": output, "error": None, "traceback": None}), 200

##########################################################################################
#QUESTIONS
##########################################################################################

# we are storing questions here

@app.route('/questions', methods=['GET', 'POST'])
# def handle_questions():
#     print("Request method:", request.method)  # Debug print
#     if request.method == 'GET':
#         return jsonify(questions)

#     if request.method == 'POST':
#         username = request.headers.get('Username')
#         print("Username received:", username)  # Debug print
#         if username == "Acb_admin@2026":
#             question_data = request.get_json()
#             questions.append(question_data)
#             return jsonify({"success": True, "message": "Question added successfully"}), 201
#         else:
#             return jsonify({"success": False, "message": "Unauthorized"}), 401
def handle_questions():
    username = request.headers.get('Username')
    if request.method == 'GET':
        return jsonify(questions)
    elif request.method == 'POST':
        if username in admin_usernames:
            question_data = request.get_json()
            questions.append(question_data)
            return jsonify({"success": True, "message": "Question added successfully"}), 201
        else:
            return jsonify({"success": False, "message": "Unauthorized"}), 401


if __name__ == '__main__':
    app.run(debug=True, port=50012)