import os
from helpers import *

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


# a global Storage object to store common data
app_storage = Storage()

def create_welcome_channel():
	# create welcome channel
	welcome_channel = Channel(name="welcome")
	# create welcome message
	msg = """
	Hello there! welcome to Flack. 

	You can join a group chat by clicking on any channel, or you can start your own channel. 
	You can also start a private chat between you and any other user.
	"""
	welcome_message = Message(username="Amr Fekry", time="", text=msg)
	# add message to channel
	welcome_channel.messages.append(welcome_message)
	# add channel to storage
	session["welcome_channel"] = welcome_channel



# add some users
for i in range(4):
	user = User(name="Amr", status="")
	app_storage.users.append(user)


@app.route("/", methods=["GET", "POST"])
def index():
	if request.method == "POST":
		display_name = request.form.get("display_name")
		avatar_number = request.form.get("avatar_number")
		
		app_storage.users.append(User(name=display_name, status=""))

		session["display_name"] = display_name
		session["avatar_number"] = avatar_number
		
		create_welcome_channel()

	return render_template("index.html", session=session, app_storage=app_storage)

@app.route("/validate_name", methods=["POST"])
def validate_name():

    # get the display_name
    display_name = request.form.get("display_name")

    # check if display_name is available
    for user in app_storage.users:
    	if display_name == user.name:
        	return jsonify({"name_available": False})
    return jsonify({"name_available": True})

