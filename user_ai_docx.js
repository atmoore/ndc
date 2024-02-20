import requests
from docx import Document

# Function to fetch conversation data from Square Space API
def fetch_conversation_data(api_key, conversation_id):
    url = f"https://api.squarespace.com/1.0/conversations/{conversation_id}"
    headers = {"Authorization": f"Bearer {api_key}"}
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Failed to fetch conversation data. Status code: {response.status_code}")
        return None

# Function to append conversation data to a docx file
def append_conversation_to_docx(filename, conversation_data):
    doc = Document(filename)
    for message in conversation_data["messages"]:
        doc.add_paragraph(f"{message['author']}: {message['content']}")
    doc.save(filename)

if __name__ == "__main__":
    api_key = "4fa864c9-898e-4f3e-9f5b-7b766d2b50b8"
    conversation_id = "CONVERSATION_ID_TO_FETCH"  # Replace with actual conversation ID
    filename = "conversation_doc.docx"
    
    # Fetch conversation data
    conversation_data = fetch_conversation_data(api_key, conversation_id)
    if conversation_data:
        # Append conversation data to the docx file
        append_conversation_to_docx(filename, conversation_data)
        print(f"Conversation data has been appended to '{filename}'")
