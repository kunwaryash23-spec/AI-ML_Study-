with open ("notes2.txt","w")as f:
    f.write("i am yash deep kunwar\nhelllloooooooo ulullulu\nnorth west left right\n")
with open ("notes2.txt","a")as a:
    a.write("class ai engineering\n")

count = 0
with open("notes2.txt") as f:
    for line in f:
        line = line.strip()
        if line:
            count += 1
    
            
print(count)

with open("notes2.txt", "r") as f:
    lines = f.read()

print("full list:", lines)

last_line = lines[-1].strip()
print("Last line:", last_line)

