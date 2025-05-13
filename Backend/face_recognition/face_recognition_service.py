from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import face_recognition
import numpy as np
from PIL import Image
import io
from pymongo import MongoClient
import logging

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://192.168.255.47:5173", "http://192.168.255.47:5000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB Atlas connection
MONGODB_USER = "latkarmuskan16"
MONGODB_PASSWORD = "JyD7bl4xulV9VBhl"
MONGODB_CLUSTER = "cluster0.ffvwr.mongodb.net"
DB_NAME = "Major_Project"

mongo_uri = f"mongodb+srv://{MONGODB_USER}:{MONGODB_PASSWORD}@{MONGODB_CLUSTER}/{DB_NAME}?retryWrites=true&w=majority"
client = MongoClient(mongo_uri)
db = client[DB_NAME]
students_collection = db["students"]

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.post("/generate_descriptor")
async def generate_descriptor(file: UploadFile = File(...)):
    try:
        logger.info(f"Received file: {file.filename}, Content-Type: {file.content_type}")
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Only image files are allowed")

        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        image_np = np.array(image)

        encodings = face_recognition.face_encodings(image_np)
        if not encodings:
            raise HTTPException(status_code=400, detail="No face detected in the image")

        logger.info("Face encoding generated successfully")
        return {"descriptor": encodings[0].tolist()}
    except Exception as e:
        logger.error(f"Error generating descriptor: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

@app.post("/recognize")
async def recognize_face(file: UploadFile = File(...)):
    try:
        logger.info(f"Received recognition file: {file.filename}, Content-Type: {file.content_type}")
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Only image files are allowed")

        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        image_np = np.array(image)

        unknown_encoding = face_recognition.face_encodings(image_np)
        if not unknown_encoding:
            raise HTTPException(status_code=400, detail="No face detected in the image")

        students = students_collection.find({"faceDescriptor": {"$exists": True}})
        known_encodings = []
        student_ids = []
        student_emails = []

        for student in students:
            if student.get("faceDescriptor"):
                known_encodings.append(np.array(student["faceDescriptor"]))
                student_ids.append(str(student["_id"]))
                student_emails.append(student["email"])

        if not known_encodings:
            raise HTTPException(status_code=400, detail="No students with face descriptors available")

        results = face_recognition.compare_faces(known_encodings, unknown_encoding[0], tolerance=0.6)
        distances = face_recognition.face_distance(known_encodings, unknown_encoding[0])

        best_match_index = None
        min_distance = float("inf")
        for i, (match, distance) in enumerate(zip(results, distances)):
            if match and distance < min_distance:
                min_distance = distance
                best_match_index = i

        if best_match_index is not None:
            logger.info(f"Face recognized: {student_emails[best_match_index]}, Distance: {min_distance}")
            return {
                "studentId": student_ids[best_match_index],
                "email": student_emails[best_match_index],
                "distance": min_distance
            }
        else:
            logger.info("No matching face found")
            raise HTTPException(status_code=400, detail="No student recognized")
    except Exception as e:
        logger.error(f"Error recognizing face: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")