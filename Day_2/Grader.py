score = 90
if score < 0 or score > 100 :
    print("Invalid Score")
elif score >= 80 :
    print(f"{score} - Achieved A Grade")
elif score >= 60 :
    print(f"{score} - Achieved B Grade")
else :
    print(f"{score} - Failed")