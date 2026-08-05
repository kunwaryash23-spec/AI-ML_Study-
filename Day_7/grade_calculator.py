def calculate_grade(score: int) -> str:
    try:
        if score >=90 and score <= 100:
            return "A"
        elif score >=80 and score < 89:
            return "B"
        elif score >=70 and score < 79:
            return "C"      
        elif score >=60 and score < 69:
            return "D"  
        elif score <60:
            return "F"  
        elif score > 100 and score < 0:
                 return "Error: Invalid score. Please enter a valid integer score."
    

print(calculate_grade(110))
    
    