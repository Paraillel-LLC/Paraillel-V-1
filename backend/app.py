from flask import Flask, request, jsonify, render_template, redirect, url_for,session, send_from_directory
from flask_cors import CORS
import os
import requests
from dotenv import load_dotenv
import pymysql
import spacy
import nltk
from nltk.tokenize import sent_tokenize
from summa import summarizer
from flask.templating import DispatchingJinjaLoader, Environment, TemplateNotFound
import pymysql.cursors


load_dotenv()

app = Flask(__name__)

CORS(app, origins=['http://localhost:3000'])

# Counter for analytics
study_plan_count = 0

@app.route('/')
def index():
   return send_from_directory('frontend/public', 'index.html')


@app.route('/login', methods = ['POST','GET'])
def login():   
    username = request.json.get('username')
    password = request.json.get('password')
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM Users WHERE username=%s AND password=%s", (username, password))
    user = cursor.fetchone()
        
    conn.close()
        
    if user:
        return jsonify({'success': True}), 200
        #return redirect('/index')
    else:
        return jsonify({'success': False, 'message': 'Incorrect username or password'}), 401
        #return render_template('Login.html', error='Incorrect email or password')
        
    #return render_template('Login.html', error=None)
    
'''@app.route('/index')
def home():
    if 'user' in session:
        return render_template('index.html', user=session['user'])
    else:
        return redirect('/')'''
    
@app.route('/create-account', methods=['POST','GET'])
def create_account():
    username = request.json.get('username')
    password = request.json.get('password')
    email = request.json.get('email')
    role_id = 1

    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM Users WHERE username = %s", (username,))
    existing_user = cursor.fetchone()
    
    if existing_user:
        return jsonify({'success': False, 'message': 'Username already exists'}), 400
    
    cursor.execute("INSERT INTO Users ( username, password, role_id, email) VALUES (%s,%s,%s,%s)", (username, password,role_id,email))
    conn.commit()

    conn.close()
    #return jsonify({'success': True}), 201
    return render_template('http://localhost:3000/')
       
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
    
    if response.status_code == 200:
        lesson_data = response.json().get('choices', [{}])[0].get('text', '')
        
        with open("output.txt", "w") as file:
            file.write(lesson_data)
        with open("output.txt", "r") as file:
            file_content = file.read()
        print(file_content)
        
        outcomes = []
        nlp = spacy.load("en_core_web_sm")
        doc = nlp(file_content)
        summary = summarizer.summarize(file_content)
    
        for sent in doc.sents:
            task_start = None
            outcome_start = None
        
            for i, token in enumerate(sent):
                if token.text.lower() in ['task', 'tasks', 'goal', 'goals', 'objective', 'objectives']:
                    task_start = i
                elif task_start is not None and outcome_start is None:
                    if token.pos_ == 'NOUN' or token.pos_ == 'PROPN':
                        outcome_start = i
        
            if task_start is not None and outcome_start is not None:
                outcome = ' '.join([token.text for token in sent[outcome_start:]])
                outcomes.append(outcome)
        sentences = sent_tokenize(file_content)
        objectives = []
        objective_keywords = ["objective", "aim", "goal"]

        for sentence in sentences:
            if any(keyword in sentence.lower() for keyword in objective_keywords):
                objectives.append(sentence)
        #outcomes = extract_outcomes(file_content)
        #objective = extract_objective(file_content)
        
        print("Learning Outcomes:")
        for outcome in outcomes:
            print("-", outcome)
        print("\nPrerequisites:")
        '''for prerequisite in prerequisites1:
            print("-", prerequisite)'''
        print("\nObjectives:")
        for objective in objectives:
            print("-", objective)
        print("\nSummary:")
        print(summary)
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
        start_date = data.get('start_date')

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
    return jsonify(response.json())
    return render_template('cale.js', learning_outcomes = learning_outcomes, start_date= start_date)

    # Attempt to connect to the database using pymysql
"""conn = get_db_connection()
    if conn is not None:
        print("Connected to db!")

        cursor = conn.cursor()

        # Execute a SQL query
        cursor.execute('Describe Quiz')

        # Fetch the results
        results = cursor.fetchall()

        #  Print the results
        for result in results:
            print(result)
        conn.close()


    else:
        print("Failed to connect to the database.")
    print(response)
    return jsonify(response.json())"""

@app.route('/analytics', methods=['GET'])
def analytics():
    return jsonify({'study_plan_count': study_plan_count})

# Database connection function updated for pymysql
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

if __name__ == '__main__':
    app.run(debug=True)
