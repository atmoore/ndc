from docx import Document

def append_to_docx(filename, content):
    doc = Document(filename)
    doc.add_paragraph(content)
    doc.save(filename)

if __name__ == "__main__":
    filename = "generated_document.docx"
    while True:
        user_input = input("Enter text to add to the document (press q to quit): ")
        if user_input.lower() == 'q':
            break
        append_to_docx(filename, user_input)

    print(f"Document '{filename}' has been updated.")
