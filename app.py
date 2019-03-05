import os
import datetime

from storage_classes import *
from helpers import *

from flask import Flask, render_template, request, jsonify, session
from flask_session import Session
from flask_socketio import SocketIO, emit            #socketio


# configure file to use flask and flask_socketio
app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")   #socketio
socketio = SocketIO(app) 							 #socketio

# Configure session to use filesystem
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)


# a global Storage object to store common data
app_storage = Storage()

create_test_channel("test1", app_storage, 5)


@app.route("/", methods=["GET", "POST"])
def index():
	if request.method == "POST":
		# get "potential" inputs
		display_name = request.form.get("display_name")
		avatar_number = request.form.get("avatar_number")
		message = request.form.get("message")
		new_channel_name = request.form.get("new_channel_name")
		channel_switch = request.form.get("switch_to_this_channel")
		
		# onsubmit of start-form
		if display_name:
			app_storage.users.append(User(name=display_name, status=""))

			session["display_name"] = display_name
			session["avatar_number"] = avatar_number
			
			create_welcome_channel()
			# app_storage.channels["welcome"] = session["welcome_channel"]
		
		# onsubmit of new message
		elif message:
			msg = Message(
				avatar_number=session["avatar_number"],
				username=session["display_name"], 
				time=str(datetime.datetime.utcnow()).split('.')[0].split(' ')[1] + ' UTC',
				text=message)

			print("current channel is" + session["current_channel"])
			# add the message to the current channel
			if session["current_channel"] == "welcome":
				session["welcome_channel"].messages.append(msg)
				session["welcome_channel"].keep_100_messages()
				print(session["welcome_channel"].messages)
			else:
				app_storage.channels[session["current_channel"]].messages.append(msg)
				app_storage.channels[session["current_channel"]].keep_100_messages()
				print(app_storage.channels[session["current_channel"]].messages)
			
			# test
			print_data(app_storage)

			return jsonify({
				"avatar_number": msg.avatar_number, 
				"username": msg.username, 
				"time": msg.time, 
				"text": msg.text})
		
		# onsubmit of new channel
		elif new_channel_name:
			
			new_channel = Channel(new_channel_name)
			app_storage.channels[new_channel_name] = new_channel
			session["current_channel"] = new_channel_name
			session["current_channel_object"] = new_channel

			# test
			print_data(app_storage)
		
		# on switching channels
		elif channel_switch:
			print(f"switched to {channel_switch}")

			stored_messages = []
			
			if channel_switch == "welcome":
				session["current_channel"] = "welcome"
				session["current_channel_object"] = session["welcome_channel"]
				stored_messages = session["welcome_channel"].messages
			else:
				session["current_channel"] = channel_switch
				session["current_channel_object"] = app_storage.channels[session["current_channel"]]
				stored_messages = app_storage.channels[session["current_channel"]].messages
			
			print("current channel is" + session["current_channel"], stored_messages)
			
			message_list = []
			# turn Message objects into dicts:
			for message in stored_messages:
				message_list.append({
					"avatar_number": message.avatar_number,
					"username": message.username,
					"time": message.time,
					"text": message.text})
			
			# test
			print_data(app_storage)

			return jsonify({"list": message_list})

	return render_template("index.html", session=session, app_storage=app_storage)


@app.route("/validate_name", methods=["POST"])
def validate_name():

	# identify which request is it
	new_user_request = request.form.get("new_user_request")
	new_channel_request = request.form.get("new_channel_request")
	
	if new_user_request:
		display_name = request.form.get("display_name")
		# check if display_name is available
		for user in app_storage.users:
			if display_name == user.name:
				return jsonify({"name_available": False})
		return jsonify({"name_available": True})

	elif new_channel_request:
		channel_name = request.form.get("channel_name")
		# check if channel_name is available
		if channel_name in app_storage.channels:
			return jsonify({"name_available": False})
		return jsonify({"name_available": True})



# on socket notifications from clients

@socketio.on("new channel")
def new_user(data):

    channel_name = data["channel_name"]
    emit("add_new_channel", {"channel_name": channel_name}, broadcast=True, include_self=False)

@socketio.on("new user")
def new_user(data):

    display_name = data["display_name"]
    emit("add_new_user", {"display_name": display_name}, broadcast=True, include_self=False)

@socketio.on("new message")
def new_message(data):

    message_dict = data["message_dict"]
    channel_name = data["channel_name"]
    emit("add_new_message", {"message_dict": message_dict, 'channel_name': channel_name}, broadcast=True, include_self=False)

