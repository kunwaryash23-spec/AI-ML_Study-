count = 0 
with open("notes.txt") as f:
    for line in f:
        line =  line.strip()
        if line:
            count += 1
print(count)
     