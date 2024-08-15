import { useState } from "react";
import axios from 'axios';

export default function ProfileSettings() {
    const [selectedProfile, setSelectedProfile] = useState('');
    const [formData, setFormData] = useState({
        admin: {},
        teacher: {},
        district: {},
    });

    const formFields = {
        admin: ["Name", "Email", "Phone Number", "Profile Picture", "Department", "Role/Position", "Bio", "District ID", "School ID"],
        teacher: ["Name", "Email", "Phone Number", "Profile Picture", "Subject(s) Taught", "Grade Level(s)", "Bio", "District ID", "School ID"],
        district: ["Name", "Email", "Phone Number", "Profile Picture", "Role/Position", "District Information", "Bio", "District ID"],
    };

    const handleProfileSelection = (e) => {
        setSelectedProfile(e.target.value);
    };

    const handleChange = (field, value) => {
        setFormData({
            ...formData,
            [selectedProfile]: {
                ...formData[selectedProfile],
                [field]: value,
            },
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const dataToSend = { profile: selectedProfile, ...formData[selectedProfile] };
            const response = await axios.post('http://localhost:5000/save_profile', dataToSend);
            alert(response.data.message);
        } catch (error) {
            console.error('Error saving data:', error);
            alert('Failed to save data');
        }
    };

    const renderForm = () => {
        if (!selectedProfile) return null;

        return (
            <form className="profile-form" onSubmit={handleSubmit}>
                {formFields[selectedProfile].map((field, index) => (
                    <div key={index} className="form-group">
                        <label>{field}</label>
                        <input
                            type="text"
                            value={formData[selectedProfile][field] || ''}
                            onChange={(e) => handleChange(field, e.target.value)}
                        />
                    </div>
                ))}
                <button type="submit">Save</button>
            </form>
        );
    };

    return (
        <div>
            <select value={selectedProfile} onChange={handleProfileSelection}>
                <option value="">Select Profile</option>
                <option value="admin">Admin</option>
                <option value="teacher">Teacher</option>
                <option value="district">District</option>
            </select>
            {selectedProfile && renderForm()}
        </div>
    );
}
