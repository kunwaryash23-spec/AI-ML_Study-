def celsius_to_f(c):
    return (c * 9/5) + 32

c = 25
f = celsius_to_f(c)
print(f"{c} degrees Celsius is equal to {f} degrees Fahrenheit.")

def grade(score):
    if score >= 90:
        return "A"
    elif score >= 80:
        return "B"
    elif score >= 70:
        return "C"
    else:
        return "Fail"
s = grade(85)
print(f"Score: 85, Grade: {s}")
    
def average(numbers):
    return sum(numbers) / len(numbers)
avg = average([85, 90, 78, 92, 88])
print(f"Average score: {avg}")