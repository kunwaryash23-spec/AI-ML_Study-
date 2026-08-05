sen = "Yash loves to consistently learn new things"
words = sen.split()
longest = ""
word = 0
for word in words:
    if len(word) > len(longest):
        longest = word