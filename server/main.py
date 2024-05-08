from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
import bson.json_util

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

client = MongoClient("mongodb://localhost:27017")
db = client["VSP_Enterprises"]
collection = db["Users"]

class Users(BaseModel):
    username: str
    email: str
    password: str

@app.post("/addUsers/")
async def create_item(users: Users):
    try:
        result = collection.insert_one(users.dict())
        return {"message": "User created successfully", "id": str(result.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create user: {str(e)}")
    
@app.get("/getUsers/")
async def get_users():
    try:
        users = list(collection.find({}))
        json_string = bson.json_util.dumps(users)
        return json_string
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to fetch users")
