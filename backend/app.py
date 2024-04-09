from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests
from dotenv import load_dotenv
import pymysql

load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route('/create-plan', methods=['POST'])
def create_plan():
    data = request.json
    headers = {
        'Authorization': f'Bearer {os.getenv("OPENAI_API_KEY")}'
    }
    response = requests.post(
        'https://api.openai.com/v1/engines/gpt-3.5-turbo-instruct/completions',
        headers=headers,
        json={
            'prompt': data.get('prompt'),
            'max_tokens': 2048
        }
    )

    if response.status_code == 200:
        lesson_data = response.json().get('choices', [{}])[0].get('text', '')

        # Assuming that the lesson_data needs to be parsed or is directly usable
        # If parsing is needed, implement it based on how the data is structured in lesson_data
        learning_outcomes = "Extracted or whole lesson_data"
        prerequisites = "Extracted or whole lesson_data"
        objective = "Extracted or whole lesson_data"

        # User-provided details from request
        #user_id = 1  # Example: Assuming a known user ID for simplicity
        district_id = data.get('district_id')
        school_id = data.get('school_id')
        grade_id = data.get('grade_id')
        subject = data.get('subject')
        pedagogy = data.get('pedagogy')
        plan_length = data.get('plan_length')
        experience_level = data.get('experience_level')
        standard = data.get('standard')
        difficulty_level = data.get('difficulty_level')

        conn = get_db_connection()
        if conn is not None:
            try:
                with conn.cursor() as cursor:
                    insert_query = """
                    INSERT INTO LessonPlan ( district_id, school_id, grade_id, subject, pedagogy, plan_length, experience_level, standard, difficulty_level, learning_outcomes, prerequisites, objective)
                    VALUES ( %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """
                    # Adjust the values accordingly if you're parsing lesson_data
                    cursor.execute(insert_query, ( district_id, school_id, grade_id, subject, pedagogy, plan_length, experience_level, standard, difficulty_level, learning_outcomes, prerequisites, objective))
                    conn.commit()
                    return jsonify({"message": "Lesson plan created successfully"}), 200
            except Exception as e:
                conn.rollback()
                print(f"Database error: {e}")
                return jsonify({"error": "Failed to insert lesson plan into the database"}), 500
            finally:
                conn.close()
        else:
            return jsonify({"error": "Failed to connect to the database"}), 500
    else:
        return jsonify({"error": "Failed to generate lesson plan from OpenAI API"}), response.status_code

def get_db_connection():
    try:
        conn = pymysql.connect(
        host=os.getenv('DB_HOST'),  # e.g., 'dev-backend.cjewkge6mhd5.us-east-1.rds.amazonaws.com'
        user=os.getenv('DB_USER'),  # e.g., 'admin'
        password=os.getenv('DB_PASSWORD'),  # e.g., 'parallel'
        database=os.getenv('DB_NAME'),  # Your database name
        port=3306
        )
        #print("Connected to db!")
        return conn
    except Exception as e:
        print(f"Failed to connect to db: {e}")
        return None