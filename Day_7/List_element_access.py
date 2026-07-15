def get_element(items : list[str], index : int) -> str:
    try:
        return items[index]
    except IndexError:
        return "Error: Invalid Index"
    
print(get_element(["apple"], 1))