import fastapi
from fastapi import FastAPI
from  fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
)

@app.get("/winner")
def checkwin(resultValue):
    return {'winner': resultValue, 'errors': []}