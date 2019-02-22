import os

from flask import Flask, render_template, request, jsonify
# from flask_socketio import SocketIO, emit

# configure file to use flask and flask_socketio
app = Flask(__name__)
# app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
# socketio = SocketIO(app)

# remember display names
display_names = ["amr"]

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/validate_name", methods=["POST"])
def validate_name():

    # get the display_name
    display_name = request.form.get("display_name")

    # check if display_name is available
    if display_name in display_names:
        return jsonify({"name_available": False})

    return jsonify({"name_available": True})

