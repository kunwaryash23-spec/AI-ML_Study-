def add(a: int, b: int) -> int:
    return a+b

def sub(a: int, b: int) -> int:
    return a-b

def mul(a: int, b: int) -> int:
    return a*b

def div(a: int | float , b: int |float) -> float | int:
   try:
        return a / b
   except ZeroDivisionError:
        return "Error: Division by zero is not allowed."

        

print(add(20,10))
print(sub(20,10))
print(mul(20,10))
print(div(2.6,1.3))
print(div(20,0))


