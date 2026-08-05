a = -1
with open("notes2.txt", "r") as f:
    lines = f.readlines()
    
    print(lines)
    for line in lines:
        print(lines[a])
        a -= 1
    