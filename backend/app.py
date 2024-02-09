# backend/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)


# Counter for analytics
study_plan_count = 0

@app.route('/')
def index():
    return "Flask server is running!"

@app.route('/create-plan', methods=['POST'])
def create_plan():
    global study_plan_count
    study_plan_count += 1

    data = request.json
    prompt = data.get('prompt')
    headers = {
        'Authorization': f'Bearer {os.getenv("OPENAI_API_KEY")}'
    }
    response = requests.post(
        'https://api.openai.com/v1/engines/gpt-3.5-turbo-instruct/completions',
        headers=headers,
        json={
            'prompt': prompt,
            'max_tokens': 2048
        }
    )
    print(response)
    return jsonify(response.json())

@app.route('/analytics', methods=['GET'])
def analytics():
    return jsonify({'study_plan_count': study_plan_count})

@app.route('/add-event', methods=['POST'])
def add_event():
    # Here you can handle adding events to a database or processing calendar data
    data = request.json
    # Process data (e.g., store in a database)
    # For now, just returning a success message
    return jsonify({'message': 'Event added successfully'})

if __name__ == '__main__':
    app.run(debug=True)
