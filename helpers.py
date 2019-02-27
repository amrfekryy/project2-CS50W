
class Storage():
	def __init__(self):
		self.channels = {}
		self.users = []

class Channel():
	def __init__(self, name):
		self.name = name
		self.messages = []

class Message():
	def __init__(self, username, time, text):
		self.username = username
		self.time = time
		self.text = text

class User():
	def __init__(self, name, status):
		self.name = name
		self.status = status

"""
Usage:

- to get all channels names:
for channel in Storage.channels:
	print(channel)

- to get all users names:
for user in Storage.users:
	print(user.name)

- to get all messages of a specific channel:
for message in Storage.channels["channel_name"].messages:
	print(message.username)
	print(message.time)
	print(message.text)	

"""