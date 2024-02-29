from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

usernames = []

# Add a route to handle CORS preflight requests
@app.route('/hi', methods=['GET'])
@app.route('/', methods=['GET'])
def hi():
    return ('Hi from Alspencer... I\'m running...')

@app.route('/add_friend', methods=['OPTIONS'])
def options():
    return jsonify({'success': True}), 200

@app.route('/add_username', methods=['POST'])
def add_username():
    data = request.get_json()

    if 'username' in data and data['username']:
        new_username = data['username']
        usernames.append(new_username)

        # Print the usernames to the console for debugging
        print(f'Usernames after adding: {usernames}')

        return jsonify({'success': True, 'message': 'Username added successfully'})

    return jsonify({'success': False, 'message': 'Invalid username'}), 400

@app.route('/get_usernames', methods=['GET'])
def get_usernames():
    return jsonify({'usernames': usernames})

@app.route('/add_friend', methods=['POST'])
def add_friend():
    data = request.get_json()

    if 'friendUsername' in data and data['friendUsername']:
        friend_username = data['friendUsername']

        # Check if the friend's username exists in the usernames list
        if friend_username in usernames:
            return jsonify({'success': True, 'message': 'Friend added successfully'})
        else:
            return jsonify({'success': False, 'message': 'Friend does not exist'}), 404

    return jsonify({'success': False, 'message': 'Invalid friend username'}), 400

# Run the Flask app without using app.run(debug=True) in Jupyter notebook
if __name__ == '__main__':
    app.run(debug=True, port=50012)