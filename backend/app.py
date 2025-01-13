from flask import Flask, request, jsonify, render_template, redirect, url_for,session, send_from_directory
from flask_cors import CORS
import os
import requests
import time
from dotenv import load_dotenv
import pymysql
import spacy
import nltk
from nltk.tokenize import sent_tokenize
from summa import summarizer
from flask.templating import DispatchingJinjaLoader, Environment, TemplateNotFound
import pymysql.cursors
import re
import json
from datetime import datetime
from transformers import T5Tokenizer, T5ForConditionalGeneration
import time

nltk.download('punkt_tab')


from thesettings import insert_admin, insert_district, insert_teacher

load_dotenv()

app = Flask(__name__)

CORS(app, origins=["http://localhost:3000"])

def make_openai_request(prompt):
    headers = {
        'Content-Type': 'application/json',
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
    return response

def send_request_with_retry(prompt, max_retries=3):
    retries = 0
    while retries < max_retries:
        response = make_openai_request(prompt)
        if response.status_code == 200:
            return response
        elif response.status_code == 429:
            print("Rate limited. Retrying after waiting...")
            time.sleep(2 ** retries)  # Exponential backoff
            retries += 1
        else:
            return response  # Handle other status codes
    return None  # Max retries reached

# Counter for analytics
study_plan_count = 0

def generate_title(text):
    # Load pre-trained T5 model and tokenizer
    model = T5ForConditionalGeneration.from_pretrained("t5-small")
    tokenizer = T5Tokenizer.from_pretrained("t5-small")

    # Prepare the input for the T5 model
    input_text = "summarize: " + text
    inputs = tokenizer(input_text, return_tensors="pt", max_length=512, truncation=True)

    # Generate the summary/title
    summary_ids = model.generate(inputs['input_ids'], max_length=10, num_beams=4, early_stopping=True)
    title = tokenizer.decode(summary_ids[0], skip_special_tokens=True)

    return title

@app.route('/')
def index():
   return "Flask Server is running"

'''
Date: 08/01/2024
programer : Mohsen Jafari
function description : This function will return the user information which is stored in Users table
Input : Pass the json format with 'username' as attribute contains the username value
Output: Jason format with 
        'successful' atribute with True/False value indicates the username is found or not
        'user_info' attribute with these sub-atributes : id, username, password, role_id, email, fullname' 
        if 'successful' is True the user_info in valid otherwise it's not vaid
'''

@app.route('/user_info', methods=['POST'])
def user_info():
    data = request.json
    
    username = data.get('username')
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM Users WHERE username=%s ", (username))
    user = cursor.fetchone()
    cursor.close()
    conn.close() 

    user_info = {
            'id': 0,
            'username': '',
            'password': '',
            'role_id' : 0,
            'email' : '',
            'firstname' : '',
            'lastname' : '',
            'privacy_contact' : '',
            'privacy_profile' : ''
        }
    if user:
        # Assuming the columns in the Users table are id, username, email, etc.
        user_info['id'] = user[0]
        user_info['username'] = user[1]
        user_info['password'] = user[2]
        user_info['role_id'] = user[3]
        user_info['email'] = user[6]
        user_info['firstname'] = user[7]
        user_info['lastname'] = user[8]
        user_info['privacy_contact'] = user[9]
        user_info['privacy_profile'] = user[10]
        
        return jsonify({'successful': True, 'user_info': user_info}), 200
    else:
        return jsonify({'successful': False, 'user_info': user_info}), 401

def Get_user_id(username):
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT user_id FROM Users WHERE username = %s", (username))

    user = cursor.fetchone()
    cursor.close()
    conn.close() 

    user_id = 0
    if user:
        user_id = user[0]

    return user_id
#---------------------------------------------

@app.route('/save_settings', methods=['POST'])
def save_settings():
    conn = get_db_connection()
    data = request.json
    profile = data.get('profile')

    #print("Received data:", data)
    
    if data['selectedProfile'] == 'Administration': 
        return insert_admin(conn, data)
    elif data['selectedProfile'] == 'Teacher':
        return insert_teacher(conn, data)
    else:
        return insert_district(conn, data)

@app.route('/update_password', methods=['POST'])
def update_password():
    conn = get_db_connection()
    data = request.json
    user_name = data.get('username');
    password = data.get('password');
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
    
        cursor.execute("UPDATE Users SET password = '"+password+"' WHERE username = %s", (user_name,))
    
        return jsonify({'successful': True, 'message': 'password has been successfully changed'}), 200
    
       
    except Exception as e:
        return jsonify({'Error': str(e)}), 500
    finally:
        cursor.close()
        conn.commit()
        conn.close()

@app.route('/save_privacy', methods=['POST'])
def save_privacy():
    conn = get_db_connection()
    data = request.json
    user_name = data.get('username');
    privacy_contact = data.get('selectedPrivacyContact');
    privacy_profile = data.get('selectedPrivacyProfile');

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
    
        cursor.execute("UPDATE Users SET privacycontact = '"+privacy_contact+"', privacyprofile = '"+privacy_profile+"' WHERE username = %s", (user_name,))
    
        return jsonify({'successful': True, 'message': 'Privacy settings have successfully saved'}), 200
       
    except Exception as e:
        return jsonify({'Error': str(e)}), 500
    finally:
        cursor.close()
        conn.commit()
        conn.close()

#return the district and schol for dropdown items
#---------------------------------------------------

@app.route('/get_district_school_mapping', methods=['GET'])
def get_district_school_mapping():
    try:
        # Connect to the database
        conn = get_db_connection()
        cursor = conn.cursor()

        # SQL query to fetch district-school mapping
        cursor.execute('''
           SELECT District_Name.district_id, District_Name.district_name AS DistrictName, 
                School.school_id, School.school_name AS SchoolName
            FROM District_Name INNER JOIN School ON District_Name.District_id = School.district_id
        ''')

        # Organize data into a dictionary
        district_school_mapping = {}
        rows = cursor.fetchall()
        cursor.close()

        for row in rows:
            district_id, district_name, school_id, school_name = row

            if district_id not in district_school_mapping:
                district_school_mapping[district_id] = {
                    "name": district_name,
                    "schools": {}
                }

            district_school_mapping[district_id]["schools"][school_id] = school_name
        
        
        '''for row in rows:
            district_name = row[0]
            school_name = row[1]
            if district_name not in district_school_mapping:
                district_school_mapping[district_name] = []
            district_school_mapping[district_name].append(school_name)
        '''
        
        # Close the connection
        conn.close()

        # Return the mapping as JSON
        return jsonify({'successful': True, 'data': district_school_mapping})
    
    except Exception as e:
        return jsonify({'successful': False, 'message': str(e)}), 500



@app.route('/login', methods = ['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    print(username, password)
    #print(username)
    #print(password)

    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM Users WHERE username=%s AND password=%s", (username, password))
    user = cursor.fetchone()
    cursor.close()
    conn.close()    
    if user:
        print(user)
        return jsonify({'message': 'Login successful'}), 200
            #return redirect(url_for('home'))
            #return redirect('/home')
    else:
        return jsonify({'success': False, 'message': 'Incorrect username or password'}), 401
    '''try:
        cursor.execute("SELECT * FROM Users WHERE username=%s AND password=%s", (username, password))
        user = cursor.fetchone()
        conn.close()    
        if user:
            print(user)
            return jsonify({'message': 'Login successful'}), 200
            #return redirect(url_for('home'))
            #return redirect('/home')
        else:
            return jsonify({'success': False, 'message': 'Incorrect username or password'}), 401
    except Exception as e:
        print(f"Database error: {e}")
        return jsonify({"error": "Failed to fetch data from the database"}),500
    return jsonify({'success': False}),401'''
    #return redirect(url_for('home'))

@app.route('/create-account', methods=['POST'])
def create_account():
    data = request.get_json()
    firstname = data.get('firstname')
    lastname = data.get('lastname')
    
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')
    #confirm_password = data.get('confirmPassword')
    role_id = 1

    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM Users WHERE username = %s", (username,))
    existing_user = cursor.fetchone()
    
    if existing_user:
        return jsonify({'success': False, 'message': 'Username already exists'}), 400
    else:
        cursor.execute("INSERT INTO Users ( username, password, role_id, email, firstname, lastname) VALUES (%s,%s,%s,%s,%s,%s)", (username, password,role_id,email, firstname, lastname))
        cursor.close()
        conn.commit()

    conn.close()
    return jsonify({'success': True}), 200
    return redirect(url_for('home'))
    #return render_template('http://localhost:3000/')
'''
def parse_assignment(doc, assignment_type):
    # Dictionary to map assignment types to their corresponding regex patterns
    patterns = {
        "Fill-in-the-Blank": r"(\d+\.\s.*?)(?=\nAnswer key:|$)",
        "Multiple Choice": r"(\d+\.\s.*?\n(?:A\.\s.*\n)*?)",
        "True/False": r"(\d+\.\s(True or False:.*?)\s*)",
        "Justify True/False": r"(\d+\.\s(Justify True or False.*?)\s*)",
        "Term and Definition Matching": r"(Match the terms to their definitions.*?)\s*",
        "Short Answer": r"(\d+\.\s(Short Answer.*?:.*?)\s*)",
        "Analytical Essay": r"(\d+\.\s(Analytical Essay.*?:.*?)\s*)",
        "Sort Terms into Categories": r"(\d+\.\s(Sort the terms.*?:.*?)\s*)",
        "Sequence Events or Processes": r"(\d+\.\s(Sequence the events.*?:.*?)\s*)"
    }
    
    file_content = doc.text
    
    answer_pattern = r"Answer key:\s*(.*)"

    # Check if the assignment type provided is valid
    if assignment_type not in patterns:
        raise ValueError(f"Invalid assignment type. Please choose from {list(patterns.keys())}")

    # Get the corresponding regex pattern for the assignment type
    pattern = patterns[assignment_type]

    # Find all questions and corresponding answers using the pattern
    #parsed_data = re.findall(pattern, file_content, re.DOTALL)
    questions = re.findall(pattern, file_content, re.DOTALL)
    answers = re.findall(answer_pattern, file_content)

    # Dictionary to store questions and answers
    question_answer_dict = {}

    for i in range(min(len(questions), len(answers))):
        question = questions[i].strip()
        answer = answers[i].strip()
        question_answer_dict[question] = answer

    return question_answer_dict
'''
@app.route('/create-assignment', methods=['POST'])
def create_assignment():
    
    data = request.json
    #print(data)
    prompt = data.get('prompt')
    Type = data.get('Type')
    #response = send_request_with_retry(prompt)
    #print(response.json() if response else "Failed to get response")
    headers = {
        'Content-Type': 'application/json',
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
    #print(os.getenv("OPENAI_API_KEY"))
    #print(prompt)
    #print(response.status_code)
    
    if response.status_code == 200:
        assignment_data = response.json().get('choices', [{}])[0].get('text', '')
        
        with open("output.txt", "w", encoding="utf-8") as file:
            file.write(assignment_data)
        with open("output.txt", "r") as file:
            file_content = file.read()
        #print(file_content)
        
        nlp = spacy.load("en_core_web_sm")
        doc = nlp(file_content)
        
        createdDate = data.get('createdDate')
        Type = data.get('Type')
        Subject = data.get('Subject')
        Topic = data.get('Topic')
        dueDate = data.get('dueDate')
        Questions_number = data.get('Questions')
        Standard = data.get('Standard')

        username = data.get('username')
        user_id = Get_user_id(username)
        # max_tokens = data.get('max_tokens')

        #Mohan Code
        Content = doc.text
        print("Content:")
        print(Content)
        print(type(dueDate))
        required_Material = ''
        title = generate_title(Content)
        
        questions_str = {}
        answers_str = {}
        
        # for i, qa_pair in enumerate(Content.split("\nQ")[1:], start=1):  # Skip the first empty split
        #     if qa_pair.strip():  # Check if the pair is not empty
        #         try:
        #             # Split into question and answer, limiting to 1 split
        #             question, answer = qa_pair.split(f"A{i}:", 1)
        #             questions_str[f"question_{i}"] = f"Q{i}: " + question.strip()
        #             answers_str[f"answer_{i}"] = answer.split("\n")[0].strip()
        #         except ValueError:
        #             print(f"Error processing Q{i}: {qa_pair}. Not enough values to unpack.")
        # for i, qa_pair in enumerate(Content.split("Q"), 1):
        #     if qa_pair.strip():
        #         question, answer = qa_pair.split("A", 1)
        #         questions_str[f"question_{i}"] = question.strip()
        #         answers_str[f"answer_{i}"] = answer.strip()
            
        #dueDate_obj = datetime.strptime(dueDate, "%m/%d/%y")
        #formatted_dueDate = dueDate_obj.strftime("%Y-%m-%d")

        conn = get_db_connection()
        if conn is not None:
            try:
                with conn.cursor() as cursor:
                    insert_query = """
                    INSERT INTO Assignments ( topic, Content, required_materials, Subject, Type_of_Assignment, Number_of_questions, Academic_State_Standard, Due_date, title)
                    VALUES ( %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """

                    # Adjust the values accordingly if you're parsing lesson_data
                    cursor.execute(insert_query, ( Topic, Content, required_Material, Subject, Type, Questions_number, Standard, dueDate, title))
                    
                    assignment_id = cursor.lastrowid

                    cursor.execute("INSERT INTO Assignment_users (assignment_id, user_id) VALUES (%s, %s)", (assignment_id, user_id))
                   
                    
                    conn.commit()

                    #  Step 2: Insert question-answer pairs into AssignmentQuestions table
                    # for i in range(1, len(questions_str) + 1):
                    #     question = questions_str[f"question_{i}"]
                    #     answer = answers_str[f"answer_{i}"]
                    #     cursor.execute(
                    #         "INSERT INTO AssignmentQuestions (assignment_id, question_number, question, answer) VALUES (%s, %s, %s, %s)",
                    #         (assignment_id, i, question, answer)
                    #     )
                    conn.commit()
                    return jsonify({"message": "Assignment created successfully", "assignment_id": assignment_id}), 200
            except Exception as e:
                conn.rollback()
                print(f"Database error: {e}")
                return jsonify({"error": "Failed to insert Assignment into the database"}), 500
            finally:
                conn.close()
        else:
            return jsonify({"error": "Failed to connect to the database"}), 500
    else:
        return jsonify({"error": "Failed to generate Assignment from OpenAI API"}), response.status_code
    return jsonify(response.json())


@app.route('/create-quiz', methods=['POST'])
def create_quiz():
    
    data = request.json
    #print(data)
    prompt = data.get('prompt')
    #response = send_request_with_retry(prompt)
    #print(response.json() if response else "Failed to get response")
    headers = {
        'Content-Type': 'application/json',
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
    #print(os.getenv("OPENAI_API_KEY"))
    #print(prompt)
    #print(response.status_code)
    
    if response.status_code == 200:
        quiz_data = response.json().get('choices', [{}])[0].get('text', '')
        
        with open("output.txt", "w", encoding="utf-8") as file:
            file.write(quiz_data)
        with open("output.txt", "r") as file:
            file_content = file.read()
        #print(file_content)
        
        nlp = spacy.load("en_core_web_sm")
        doc = nlp(file_content)
        
        quizAudience = data.get('quizAudience')
        questionType = data.get('questionType')
        numQuestions = data.get('numQuestions')
        subject = data.get('subject')
        topic = data.get('topic')
        # max_tokens = data.get('max_tokens')

        #Mohan Code
        Content = doc.text
        print("Content:")
        print(Content)
        title = generate_title(Content)
        
        username = data.get('username')
        user_id = Get_user_id(username)
        # questions_str = {}
        # answers_str = {}
        
        # for i, qa_pair in enumerate(Content.split("Q"), 1):
        #     if qa_pair.strip():
        #         question, answer = qa_pair.split("A", 1)
        #         questions_str[f"question_{i}"] = question.strip()
        #         answers_str[f"answer_{i}"] = answer.strip()
            
        conn = get_db_connection()
        if conn is not None:
            try:
                with conn.cursor() as cursor:
                    insert_query = """
                    INSERT INTO Quiz ( quiz_audience, question_type, num_questions, subject, topic, title, content)
                    VALUES ( %s, %s, %s, %s, %s, %s, %s)
                    """

                    # Adjust the values accordingly if you're parsing lesson_data
                    cursor.execute(insert_query, ( quizAudience, questionType, numQuestions, subject, topic, title, Content))
                    
                    quiz_id = cursor.lastrowid

                    cursor.execute("INSERT INTO quiz_users (quiz_id, user_id) VALUES (%s, %s)", (quiz_id, user_id))

                    # quiz_id = cursor.lastrowid

                    # # Step 2: Insert question-answer pairs into AssignmentQuestions table
                    # for i in range(1, len(questions_str) + 1):
                    #     question = questions_str[f"question_{i}"]
                    #     answer = answers_str[f"answer_{i}"]
                    #     cursor.execute(
                    #         "INSERT INTO QuizQuestions (quiz_id, question_number, question, answer) VALUES (%s, %s, %s, %s)",
                    #         (quiz_id, i, question, answer)
                    #     )
                    conn.commit()
                    return jsonify({"message": "Quiz created successfully", "quiz_id": quiz_id}), 200
            except Exception as e:
                conn.rollback()
                print(f"Database error: {e}")
                return jsonify({"error": "Failed to insert Quiz data into the database"}), 500
            finally:
                conn.close()
        else:
            return jsonify({"error": "Failed to connect to the database"}), 500
    else:
        return jsonify({"error": "Failed to generate Quiz from OpenAI API"}), response.status_code
    return jsonify(response.json())

@app.route('/create-studyGuide', methods=['POST'])
def create_studyGuide():
    
    data = request.json
    #print(data)
    prompt = data.get('prompt')
    #response = send_request_with_retry(prompt)
    #print(response.json() if response else "Failed to get response")
    headers = {
        'Content-Type': 'application/json',
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
    #print(os.getenv("OPENAI_API_KEY"))
    #print(prompt)
    #print(response.status_code)
    
    if response.status_code == 200:
        studyGuide_data = response.json().get('choices', [{}])[0].get('text', '')
        
        with open("output.txt", "w", encoding="utf-8") as file:
            file.write(studyGuide_data)
        with open("output.txt", "r") as file:
            file_content = file.read()
        #print(file_content)
        
        nlp = spacy.load("en_core_web_sm")
        doc = nlp(file_content)
        
    #     createdDate: newStudyGuide.createdDate,
    # grade: newStudyGuide.grade,
    # subject: newStudyGuide.subject,
    # topic: newStudyGuide.topic,
    # teachingStyle: newStudyGuide.teachingStyle,
    
    
        createdDate = data.get('createdDate')
        grade = data.get('grade')
        subject = data.get('subject')
        topic = data.get('topic')
        teachingStyle = data.get('teachingStyle')

        username = data.get('username')
        user_id = Get_user_id(username)
        
        # max_tokens = data.get('max_tokens')

        #Mohan Code
        output = doc.text
        print("Content:")
        print(output)
        title = generate_title(output)
            
        conn = get_db_connection()
        if conn is not None:
            try:
                with conn.cursor() as cursor:
                    insert_query = """
                    INSERT INTO StudyGuide ( grade, subject, topic, teachingStyle, output, created_at, title)
                    VALUES ( %s, %s, %s, %s, %s, %s, %s)
                    """

                    # Adjust the values accordingly if you're parsing lesson_data
                    cursor.execute(insert_query, ( grade, subject, topic, teachingStyle, output, createdDate, title))

                    studyguide_id = cursor.lastrowid

                    cursor.execute("INSERT INTO studyguide_users (studyguide_id, user_id) VALUES (%s, %s)", (studyguide_id, user_id))

                    conn.commit()

                    return jsonify({"message": "Study Guide created successfully", "studyguide_id": studyguide_id}), 200
                
            except Exception as e:
                conn.rollback()
                print(f"Database error: {e}")
                return jsonify({"error": "Failed to insert Study Guide data into the database"}), 500
            finally:
                conn.close()
        else:
            return jsonify({"error": "Failed to connect to the database"}), 500
    else:
        return jsonify({"error": "Failed to generate Study Guide from OpenAI API"}), response.status_code
    return jsonify(response.json())


@app.route('/create-exampleGenerator', methods=['POST'])
def create_exampleGenerator():
    
    data = request.json
    #print(data)
    prompt = data.get('prompt')
    #response = send_request_with_retry(prompt)
    #print(response.json() if response else "Failed to get response")
    headers = {
        'Content-Type': 'application/json',
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
    #print(os.getenv("OPENAI_API_KEY"))
    #print(prompt)
    #print(response.status_code)
    
    if response.status_code == 200:
        exampleGenerator_data = response.json().get('choices', [{}])[0].get('text', '')
        
        with open("output.txt", "w", encoding="utf-8") as file:
            file.write(exampleGenerator_data)
        with open("output.txt", "r") as file:
            file_content = file.read()
        #print(file_content)
        
        nlp = spacy.load("en_core_web_sm")
        doc = nlp(file_content)
        
        grade = data.get('grade')
        subject = data.get('subject')
        topic = data.get('topic')
        learningStyle = data.get('learningStyle')
        comprehensionLevel = data.get('comprehensionLevel')
        exampleBasis = data.get('exampleBasis')

        username = data.get('username')
        user_id = Get_user_id(username)
        
        # max_tokens = data.get('max_tokens')

        #Mohan Code
        output = doc.text
        print("Content:")
        print(output)
        title = generate_title(output)
            
        conn = get_db_connection()
        if conn is not None:
            try:
                with conn.cursor() as cursor:
                    insert_query = """
                    INSERT INTO ExampleGenerator (grade, subject, topic, learningStyle, comprehensionLevel, exampleBasis, output, title)
                    VALUES ( %s, %s, %s, %s, %s, %s, %s, %s)
                    """

                    # Adjust the values accordingly if you're parsing lesson_data
                    cursor.execute(insert_query, ( grade, subject, topic, learningStyle, comprehensionLevel, exampleBasis, output, title))
                    
                    example_id = cursor.lastrowid

                    cursor.execute("INSERT INTO example_users (example_id, user_id) VALUES (%s, %s)", (example_id, user_id))
                   
                    conn.commit()

                    return jsonify({"message": "Example Generator created successfully", "example_id": example_id}), 200
            except Exception as e:
                conn.rollback()
                print(f"Database error: {e}")
                return jsonify({"error": "Failed to insert Example Generator data into the database"}), 500
            finally:
                conn.close()
        else:
            return jsonify({"error": "Failed to connect to the database"}), 500
    else:
        return jsonify({"error": "Failed to generate Example Generator from OpenAI API"}), response.status_code
    return jsonify(response.json())


@app.route('/create-plan', methods=['POST'])
def create_plan():
    global study_plan_count
    study_plan_count += 1
    data = request.json
    #print(data)
    prompt = data.get('prompt')
    #response = send_request_with_retry(prompt)
    #print(response.json() if response else "Failed to get response")
    headers = {
        'Content-Type': 'application/json',
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
    #print(os.getenv("OPENAI_API_KEY"))
    #print(prompt)
    #print(response.status_code)
    if response.status_code == 200:
        lesson_data = response.json().get('choices', [{}])[0].get('text', '')
        
        with open("output.txt", "w", encoding="utf-8") as file:
            file.write(lesson_data)
        with open("output.txt", "r") as file:
            file_content = file.read()
        #print(file_content)
        
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
        learning_outcomes = outcomes
        temp1 = ""
        for outcome in outcomes:
            temp1 = temp1 + outcome
        prerequisites = "Extracted or whole lesson_data"
        #objective = "Extracted or whole lesson_data"
        # User-provided details from request
        #user_id = 1  # Example: Assuming a known user ID for simplicity
        grade = data.get('grade')
        lesson_title = data.get('lesson_title')
        subject = data.get('subject')
        pedagogy = data.get('pedagogy')
        plan_length = data.get('plan_length')
        duration = data.get('duration')
        standard = data.get('standard')
        start_date = data.get('start_date')
        theme = data.get('theme')
        difficulty_level = data.get('difficulty_level')
        district_id = data.get('district_id')
        school_id = data.get('school_id')
        grade_id = data.get('grade_id')

        username = data.get('username')
        user_id = Get_user_id(username)
        

        conn = get_db_connection()
        if conn is not None:
            try:
                with conn.cursor() as cursor:
                    insert_query = """
                    INSERT INTO LessonPlan ( district_id, school_id, grade, lesson_title, subject, pedagogy, plan_length, duration, difficulty_level, standard, Theme, start_date, grade_id, learning_outcomes, prerequisites, objective)
                    VALUES ( %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """
                    # Adjust the values accordingly if you're parsing lesson_data
                    cursor.execute(insert_query, ( district_id, school_id, grade, lesson_title, subject, pedagogy, plan_length, duration, difficulty_level, standard, theme, start_date, grade_id, temp1, prerequisites, objective))
                    
                    last_id = cursor.lastrowid

                    cursor.execute("INSERT INTO LessonPlan_Users (lesson_id, user_id) VALUES (%s, %s)", (last_id, user_id))
                   
                    
                    conn.commit()
                    return jsonify({"message": "Lesson plan created successfully", "lesson_id": last_id}), 200
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

@app.route('/Get_LessonPlan', methods=['POST'])
def Get_LessonPlan():

    data = request.json
    username = data.get('username')

    args = [username]
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        # Prepare call to stored procedure
        #param = [10,0]
        cursor.callproc('Select_LessonPlans', args)

        results = cursor.fetchall()

        if results:
            # If data is returned, format it into a list of dictionaries (or appropriate structure)
            lesson_plans = []
            for row in results:
                lesson_plans.append({
                    'lesson_id': row[0],
                    'grade': row[1],
                    'title': row[2],
                    'subject': row[3],
                    'style': row[4],
                    'difficulty_level': row[5],
                    'standard': row[6],
                    'theme': row[7],
                    'startdate': row[8],
                    'length': row[9],
                    'duration': row[10]
                })

            return jsonify({'successful': True, 'lesson_plans': lesson_plans}), 200
        else:
            return jsonify({'successful': False, 'message': 'No lesson plans found'}), 404

    except Exception as e:
        return jsonify({'Error': str(e)}), 500
    finally:
        
        conn.commit()
        conn.close()
#-------------------------------------------------------
@app.route('/Get_Assignment', methods=['POST'])
def Get_Assignment():

    data = request.json
    username = data.get('username')

    args = [username]
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        # Prepare call to stored procedure
        #param = [10,0]
        cursor.callproc('select_assignments', args)

        results = cursor.fetchall()

        if results:
            # If data is returned, format it into a list of dictionaries (or appropriate structure)
            assignments = []
            for row in results:
                assignments.append({
                    'assignment_id': row[0],
                    'topic': row[1],
                    'Duedate': row[2],
                    'Subject': row[3],
                    'Type_of_assign': row[4],
                    'numbers' : row[5],
                    'standards': row[6],
                    'user_id': row[7]
                })

            return jsonify({'successful': True, 'assignments': assignments}), 200
        else:
            return jsonify({'successful': False, 'message': 'No lesson plans found'}), 404

    except Exception as e:
        return jsonify({'Error': str(e)}), 500
    finally:
        
        conn.commit()
        conn.close()
#-------------------------------------------------------
@app.route("/tables_list/<username>/<tablename>", methods=["GET"])
def tables_list(username, tablename):
    
    user_id = Get_user_id(username)
    
    conn = get_db_connection()
    cursor = conn.cursor()
    q = ""
    match tablename:
        case "Assignments" : q = "select L.assignment_id as id, L.topic as topic, L.Subject as subject from Assignment_users as LU inner join Assignments AS L on L.assignment_id = LU.assignment_id where LU.user_id = %s;"
        case "ExampleGenerator": q = "select L.id as id, L.topic as topic, L.Subject as subject from example_users as LU inner join ExampleGenerator AS L on L.id = LU.example_id where LU.user_id = %s;"
        case "LessonPlan": q = "select L.lesson_id as id, L.lesson_title as topic, L.subject as subject from LessonPlan_Users as LU inner join LessonPlan AS L on L.lesson_id = LU.lesson_id where LU.user_id = %s;" 
        case "Quiz": q = "select L.quiz_id as id, L.topic as topic, L.subject as subject from quiz_users as LU inner join Quiz AS L on L.quiz_id = LU.quiz_id where LU.user_id = %s;"    
        case "StudyGuide": q = "select L.id as id, L.topic as topic, L.subject as subject from studyguide_users as LU inner join StudyGuide AS L on L.id = LU.studyguide_id where LU.user_id = %s;"
    
    cursor.execute(q, (user_id))

    lessonplans = {
            'id': 0,
            'topic': '',
            'subject': '',
            'content': ''
       }
    results = cursor.fetchall()
    if results:
        # If data is returned, format it into a list of dictionaries (or appropriate structure)
        lessonplans = []
        for row in results:
            lessonplans.append({
                    'id': row[0],
                    'topic': row[1],
                    'subject': row[2]
                })
        cursor.close()
        conn.close() 

        return jsonify({'successful': True, 'tabledata': lessonplans}), 200
    else:
        cursor.close()
        conn.close() 
        return jsonify({'successful': False, 'message': 'No data found'}), 404


@app.route("/lesson-plans-list/<string:username>", methods=["GET"])
def get_lesson_plans(username):
    
    user_id = Get_user_id(username)
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("select L.lesson_id, L.lesson_title, L.subject from LessonPlan_Users as LU inner join LessonPlan AS L on L.lesson_id = LU.lesson_id where LU.user_id = %s;", (user_id))

    lessonplans = {
            'lesson_id': 0,
            'title': '',
            'subject': ''
        }
    results = cursor.fetchall()
    if results:
        # If data is returned, format it into a list of dictionaries (or appropriate structure)
        lessonplans = []
        for row in results:
            lessonplans.append({
                    'lesson_id': row[0],
                    'title': row[1],
                    'subject': row[2]
                })
        cursor.close()
        conn.close() 

        return jsonify({'successful': True, 'lessonplans': lessonplans}), 200
    else:
        cursor.close()
        conn.close() 
        return jsonify({'successful': False, 'message': 'No lesson plans found'}), 404
    

@app.route("/Get_LLM_detail/<string:tablename>/<string:keyname>/<string:valname>/<string:keyval>", methods=["GET"])
def get_LLM_detail(tablename, keyname, valname, keyval):
    
    conn = get_db_connection()
    cursor = conn.cursor()
    str = 'select ' + valname +' from ' + tablename + ' where ' + keyname + ' = ' + keyval 
    cursor.execute(str)

    
    results = cursor.fetchone()
       
    if results:
        essay = results[0]         
        cursor.close()
        conn.close() 

        return jsonify({'successful': True, 'essay': essay}), 200
    else:
        cursor.close()
        conn.close() 
        return jsonify({'successful': False, 'message': ' There is no data found'}), 404

@app.route('/Save_LLM_detail',methods=["POST"])
def Save_LLM_detail():
    data = request.json
    #print(data)
    tablename = data.get('tablename')
    valname = data.get('valname')
    editableContent = data.get('editableContent')
    keyname = data.get('keyname')
    keyval = data.get('keyval')
 
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        keyvalstr = str(keyval)
        str1 = 'update ' + tablename +' set ' + valname + ' = \'' + editableContent + '\' where ' + keyname + ' = ' + keyvalstr
        cursor.execute(str1)
        conn.commit()
        conn.close()
        return jsonify({'successful': True, 'message': 'The information has been updated successfully.'}), 200
    
    except Exception as e:
        conn.close() 
    
        return jsonify({'successful': False, 'message': ' An error occurred:' + str(e)}), 404


@app.route("/lesson-plan-detail/<int:plan_id>/<string:tablename>", methods=["GET"])
def get_lesson_plan_detail(plan_id, tablename):
    
    iid = ""
    detail = "" 
    match tablename:
        case "Assignments" : 
            iid = "assignment_id"
            detail = "Content"
        case "ExampleGenerator": 
            iid = "id"
            detail = "output"
        case "LessonPlan": 
            iid = "lesson_id"
            detail = "objective" 
        case "Quiz": 
            iid = "quiz_id"
            detail = "content"    
        case "StudyGuide": 
            iid = "id"
            detail = "output"
    
    
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("select "+detail+" from "+tablename+" where "+iid+" = %s;", (plan_id))

    results = cursor.fetchone()
    if results:
        generated_lesson_plan = results[0]         
        cursor.close()
        conn.close() 

        return jsonify({'successful': True, 'essay': generated_lesson_plan}), 200
    else:
        cursor.close()
        conn.close() 
        return jsonify({'successful': False, 'message': 'No objective'}), 404

@app.route("/update-lessonplan_essay", methods=["POST"])
def update_lessonplan_essay():
    data = request.get_json()
    lessonplan_id = data.get('lessonplan_id')
    essay = data.get('essay')
    tablename = data.get('tablename')
    
    id_name = ""
    content = ""
    match tablename:
        case "Assignments" : 
            id_name = "assignment_id"
            content = "Content"
        case "ExampleGenerator" : 
            id_name = "id"
            content = "output"
        case "LessonPlan" :
            id_name = "lesson_id"
            content = "objective"
        case "Quiz" : 
            id_name = "quiz_id"
            content = "content"
        case "StudyGuide" :  
            id_name = "id"
            content = "output"

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        update_query = "UPDATE "+tablename+" SET "+content+" = %s where "+id_name+" = %s"
        cursor.execute(update_query, (essay, lessonplan_id))
    
        return jsonify({'successful': True, 'message': 'essay is updated successfully'}), 200
       
    except Exception as e:
        return jsonify({'Error': str(e)}), 500
    
    finally:
        cursor.close()
        conn.commit()
        conn.close()

if __name__ == '__main__':
    app.run(debug=True)