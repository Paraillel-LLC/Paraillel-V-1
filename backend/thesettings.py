from flask import jsonify, request

def insert_teacher(conn, data):
    school_id = data['formData']['School ID']
    district_id = data['formData']['District ID']
    teacher_name = data['formData']['First Name'] + ' ' + data['formData']['Last Name'] 
    teacher_emailid = data['formData']['Email']
    #teacher_contact_number = data['formData']['Phone Number']
    profile_pic = data['formData']['Profile Picture']
    subjects_taught = ",".join(data['formData']['Subject(s) Taught'])
    grade_levels = data['formData']['Grade Level(s)']
    bio = data['formData']['Bio']
    args = [school_id, district_id ,teacher_name , teacher_emailid, profile_pic ,subjects_taught,grade_levels,bio, True, '']
    try:
        cursor = conn.cursor()
        # Prepare call to stored procedure

        param = [10,0]
        #command = "insert into Teacher (school_id, district_id, teacher_name, profile_pic, subjects_taught, grade_levels, bio) values (6, 2, 'first last', 'cccc', '1,2,3,4,5' , '12', 'bio') "
        #command = " CALL `test_schema`.`InsertTeacher` ("+school_id+","+district_id+" , '"+teacher_name+"', '"+teacher_emailid+"', '"+profile_pic+"', '"+subjects_taught+"', '"+grade_levels+"', '"+bio+"', @success, @result); "
        #cursor.execute(command)
        cursor.callproc('InsertTeacher', args)

        results = cursor.fetchone()
        if results:
            successful = results[0]
            message = results[1]

        if successful:
            return jsonify({'successful': True, 'message': message}), 200
        else:
            return jsonify({'successful': False, 'message': message}), 401
        
    except Exception as e:
        return jsonify({'Error': str(e)}), 500
    finally:
        cursor.close()
        conn.commit()
        conn.close()

#---------------------------------------------    
def insert_admin(conn, data):
    
    school_id = int(data['formData']['School ID'])
    district_id = int(data['formData']['District ID'])
    admin_name = data['formData']['First Name'] + ' ' + data['formData']['Last Name']
    admin_depart = data['formData']['Department']
    admin_pic = data['formData']['Profile Picture']
    role_position = data['formData']['Role/Position']
    admin_bio = data['formData']['Bio']
    
    args = [school_id, district_id , admin_name, admin_depart, admin_pic, role_position, admin_bio, True, '']
    try:
        cursor = conn.cursor()
        # Prepare call to stored procedure
        param = [9,0]
        cursor.callproc('InsertAdmin', args)
        

        results = cursor.fetchone()
        if results:
            successful = results[0]
            message = results[1]

        if successful:
            return jsonify({'successful': True, 'message': message}), 200
        else:
            return jsonify({'successful': False, 'message': message}), 401
        
    except Exception as e:
        return jsonify({'Error': str(e)}), 500
    finally:
        cursor.close()
        conn.commit()
        conn.close()

#---------------------------------------------    
def insert_district(conn, data):
    role_position = data['formData']['Role/Position']
    district_name = data['formData']['First Name'] + ' ' + data['formData']['Last Name']
    district_emailid = data['formData']['Email']
    district_pic = data['formData']['Profile Picture']
    district_info = data['formData']['District Information']
    district_bio = data['formData']['Bio']
    district_district_id1 = data['formData']['District ID']
    
    
    args = [role_position, district_name, district_emailid , district_pic, district_info, district_bio, district_district_id1, True, '']
    try:
        cursor = conn.cursor()
        # Prepare call to stored procedure
        #param = [10,0]
        cursor.callproc('InsertDistrict', args)

        results = cursor.fetchone()
        if results:
            successful = results[0]
            message = results[1]

        if successful:
            return jsonify({'successful': True, 'message': message}), 200
        else:
            return jsonify({'successful': False, 'message': message}), 401
        
    except Exception as e:
        return jsonify({'Error': str(e)}), 500
    finally:
        
        conn.commit()
        conn.close()

#-------------------------------------------------------

