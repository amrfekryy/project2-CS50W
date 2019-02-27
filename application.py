import os

from flask import Flask, render_template, request, jsonify, session
from flask_session import Session
# from flask_socketio import SocketIO, emit

# configure file to use flask and flask_socketio
app = Flask(__name__)
# app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
# socketio = SocketIO(app)

# Configure session to use filesystem
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# a global variable to store common data
app_storage = {

	"channels": [
		{
			"name": "egypt", 
			"messages": [
		 		{"user": "","time": "", "message": ""}
			]
		},
	],

	"users": [
		{"name": "amr", "status": "free"},
		{"name": "amr", "status": "free"},
		{"name": "amr", "status": "free"}
	]
}


@app.route("/", methods=["GET", "POST"])
def index():
	if request.method == "POST":
		display_name = request.form.get("display_name")
		avatar_number = request.form.get("avatar_number")
		
		app_storage["users"].append({"name": display_name, "status": "free"})

		session["display_name"] = display_name
		session["avatar_number"] = avatar_number
	
	return render_template("index.html", session=session, app_storage=app_storage)

@app.route("/validate_name", methods=["POST"])
def validate_name():

    # get the display_name
    display_name = request.form.get("display_name")

    # check if display_name is available
    for user in app_storage["users"]:
    	if display_name == user["name"]:
        	return jsonify({"name_available": False})
    return jsonify({"name_available": True})

