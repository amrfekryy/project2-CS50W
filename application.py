import os

from flask import Flask, render_template
# from flask_socketio import SocketIO, emit

# configure file to use flask and flask_socketio
app = Flask(__name__)
# app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
# socketio = SocketIO(app)

# remember display names
display_names = []

@app.route("/")
def index():
    return render_template("index.html")
