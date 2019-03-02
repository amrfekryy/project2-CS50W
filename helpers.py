
class Storage():
	def __init__(self):
		self.channels = {}
		self.users = []

	def print_data(self):
		"""print all data stored in a storage for testing porpuses"""
		
		print("**** STORAGE CHANNELS ****")
		for x, channel in self.channels.items():
		# x is channel name, but channel.name also is
				
			channel.print_data()

		print()
		
		print("**** USERS ****")
		for user in self.users:
			print(f"- {user.name}")


class Channel():
	def __init__(self, name):
		self.name = name
		self.messages = []

	def print_data(self):
		"""print data stored in a channel for testing porpuses"""
					
		print(f"- {self.name}")
		for msg in self.messages:
			print(f"avatar {msg.avatar_number}, {msg.username}:")
			print(msg.text)

class Message():
	def __init__(self, avatar_number, username, time, text):
		self.avatar_number = avatar_number
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
