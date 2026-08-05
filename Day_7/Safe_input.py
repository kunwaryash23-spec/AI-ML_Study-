def safe_int(text: str) -> int:
    
    try:
        return int(text)
    except ValueError:
        print(f"Error: '{text}' is not a valid integer.")
        return 0
    
print(safe_int("ABC"))