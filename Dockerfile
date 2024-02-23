# Stage 1: Build the React front-end
FROM node:18.9.1-alpine as react-build
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build
# Stage 2: Build the Flask back-end
FROM python:3.9-slim
WORKDIR /app
# Copy the Python requirements and install dependencies
# Assuming you have a requirements.txt in the backend directory
COPY backend/requirements.txt ./
RUN python -m venv venv
RUN . venv/bin/activate && pip install -r requirements.txt
# Copy the backend Python application
COPY backend/ ./
# Copy the React build from the previous stage
# Adjust according to where you want to serve your static files from in Flask
COPY --from=react-build /app/frontend/build /app/backend/static
# Expose the Flask default port
EXPOSE 5000
# Set environment variables
ENV FLASK_APP=backend/app.py
ENV FLASK_RUN_HOST=0.0.0.0
# Command to run the Flask application
CMD ["sh", "-c", ". venv/bin/activate && exec flask run"]
