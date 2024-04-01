from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests
from dotenv import load_dotenv
import pymysql

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

    # Attempt to connect to the database using pymysql
    conn = get_db_connection()
    if conn is not None:
        print("Connected to db!")

        cursor = conn.cursor()

        # Execute a SQL query
        cursor.execute('SELECT * FROM Roles')

        # Fetch the results
        results = cursor.fetchall()

        #  Print the results
        for result in results:
            print(result)
        conn.close()


    else:
        print("Failed to connect to the database.")
    print(response)
    return jsonify(response.json())
@app.route('/analytics', methods=['GET'])
def analytics():
    return jsonify({'study_plan_count': study_plan_count})

# Database connection function updated for pymysql
def get_db_connection():
    try:
        conn = pymysql.connect(
        host=os.getenv('DB_HOST'),  # e.g., 'dev-backend.cjewkge6mhd5.us-east-1.rds.amazonaws.com'
        user=os.getenv('DB_USER'),  # e.g., 'admin'
        password=os.getenv('DB_PASSWORD'),  # e.g., 'paraillel'
        database=os.getenv('DB_NAME'),  # Your database name
        port=3306
        )
        #print("Connected to db!")
        return conn
    except Exception as e:
        print(f"Failed to connect to db: {e}")
        return None

if __name__ == '__main__':
    app.run(debug=True)
