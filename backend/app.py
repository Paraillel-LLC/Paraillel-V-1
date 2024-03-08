from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests
from dotenv import load_dotenv
import mysql.connector
load_dotenv()
import boto3


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
    # Attempt to connect to the database
    
    conn = get_db_connection()
    if conn is not None:
        print("Connected to db!")
        #conn.close()
    else:
        print("Failed to connect to the database.")
    print(response)
    return jsonify(response.json())
@app.route('/analytics', methods=['GET'])
def analytics():
    return jsonify({'study_plan_count': study_plan_count})
# Database connection function
def get_db_connection():
    try:
        session = boto3.Session(region_name='us-east-1')
        client = session.client('ssm')
        instance_id = 'i-0de9186fc24cd6fbb'
    
        response = client.start_session(
        Target=instance_id
        )
    
        session_id = response['SessionId']
        token = response['Token']
    
        print("Session ID:", session_id)
        print("Token:", token)
        print("Connected to db!")
       # conn = mysql.connector.connect(
       #     host=os.getenv('DB_HOST'),  # e.g., 'dev-backend.cjewkge6mhd5.us-east-1.rds.amazonaws.com'
       #     user=os.getenv('DB_USER'),  # e.g., 'admin'
       #     password=os.getenv('DB_PASSWORD'),  # e.g., 'paraillel'
       #     database=os.getenv('DB_NAME')  # Your database name
       # )
        print("Connected to db!")
        return session
    except Exception as e:
        print(f"Failed to connect to db: {e}") 
        return None
if __name__ == '__main__':
    app.run(debug=True)
