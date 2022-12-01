import hashlib

inpu = "yzbqklnj"

def get_key(zerosLength, secretKey):
	i=0
	while True:
		i += 1
		string = inpu + str(i)
		result = hashlib.md5(string.encode())
		hexHash = result.hexdigest()

		if hexHash[0:zerosLength] == zerosLength * "0":
			return i

print(get_key(5, inpu))
print(get_key(6, inpu))	
	
