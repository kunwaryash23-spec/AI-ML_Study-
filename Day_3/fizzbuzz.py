for i in range(1, 20):
    if  i % 3 == 0 and i % 5 == 0:
        print("FizzBuzz")
        continue
    
    elif i % 3 == 0:
        print("Fizz")
    elif i % 5 == 0:
        print("Buzz")
    
    