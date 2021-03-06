
from storage_classes import *
from flask import session


def create_welcome_channel():
	"""
	create channel "welcome" that stores unique messages for each user (saved in session) 
	"""

	welcome_channel = Channel(name="welcome")
	msg = """
	Hello there! welcome to Flack. 

	You can join a group chat by clicking on any channel, or you can start your own channel. 
	You can also start a private chat between you and any other user.
	"""
	welcome_message = Message(avatar_number=1 , username="Amr Fekry", time="", text=msg)
	# add message to channel
	welcome_channel.messages.append(welcome_message)
	# add channel to storage
	session["welcome_channel"] = welcome_channel
	session["current_channel"] = "welcome"
	session["current_channel_object"] = welcome_channel


def create_test_channel(name, storage, msg_count):
	"""
	create a channel for testing purposes
	"""

	storage.channels[name] = Channel(name)
	for i in range(msg_count):
		msg = Message("1", "temp user", "", "temporary message for testing")
		storage.channels[name].messages.append(msg)


def print_data(storage):
	"""
	print all data (channels, messages, users) 
	stored in the storage object in CLI for testing purposes
	"""
	print()	
	print("----------------------Data Report-----------------------")
	print()
	print("**** CHANNELS ****")
	print()
	session["welcome_channel"].print_data()
	for channel_name, channel_object in storage.channels.items():
	# channel name can be accessed through channel_name or channel_object.name			
		channel_object.print_data()
	print()
	print("**** USERS ****")
	print()
	for user in storage.users:
		print(f"--- {user.name}")
	print()
	print("--------------------------------------------------------")

