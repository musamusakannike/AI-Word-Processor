"""
Quick Start Example - AI Word Processor

This script demonstrates how to use the API to generate documents.
Make sure the server is running before executing this script!
"""

# Example 1: Generate a Resume
print("Example 1: Generating a Professional Resume")
print("-" * 60)

prompt_resume = """
Create a professional resume for a software engineer with the following:

Header:
- Name: Jane Smith
- Email: jane.smith@email.com
- Phone: (555) 123-4567
- LinkedIn: linkedin.com/in/janesmith

Professional Summary:
- 5+ years of experience in full-stack development
- Expertise in Python, JavaScript, and cloud technologies

Work Experience:
1. Senior Software Engineer at Tech Corp (2021-Present)
   - Led development of microservices architecture
   - Improved system performance by 40%
   
2. Software Engineer at StartupXYZ (2019-2021)
   - Developed RESTful APIs using FastAPI
   - Implemented CI/CD pipelines

Education:
- BS in Computer Science, University of Technology (2019)

Skills:
- Languages: Python, JavaScript, TypeScript, SQL
- Frameworks: FastAPI, React, Node.js
- Tools: Docker, Kubernetes, AWS, Git

Use professional formatting with bold headings and proper spacing.
"""

print(f"Prompt: {prompt_resume[:100]}...")
print("\nTo generate this document, send a POST request to:")
print("http://localhost:8000/generate")
print("\nWith JSON body:")
print('{"prompt": "' + prompt_resume.replace('\n', '\\n')[:100] + '..."}')
print("\n" + "=" * 60 + "\n")


# Example 2: Generate a Business Letter
print("Example 2: Generating a Business Letter")
print("-" * 60)

prompt_letter = """
Create a formal business letter with:

Sender (Company Letterhead):
ABC Corporation
123 Business Ave
New York, NY 10001

Date: January 11, 2026

Recipient:
Mr. John Doe
XYZ Enterprises
456 Commerce St
Boston, MA 02101

Subject: Partnership Proposal

Body:
- Opening paragraph: Express interest in partnership
- Second paragraph: Outline mutual benefits
- Third paragraph: Propose next steps and meeting

Closing:
Sincerely,
Sarah Johnson
CEO, ABC Corporation

Use professional formatting with proper spacing and alignment.
"""

print(f"Prompt: {prompt_letter[:100]}...")
print("\n" + "=" * 60 + "\n")


# Example 3: Generate a Meeting Agenda
print("Example 3: Generating a Meeting Agenda")
print("-" * 60)

prompt_agenda = """
Create a meeting agenda document with:

Title: Q1 2026 Strategy Planning Meeting

Meeting Details:
- Date: January 15, 2026
- Time: 2:00 PM - 4:00 PM
- Location: Conference Room A
- Facilitator: Michael Chen

Attendees:
- Sarah Johnson (CEO)
- David Lee (CTO)
- Emily Brown (CFO)
- Michael Chen (VP Product)
- Lisa Wang (VP Marketing)

Agenda Items:
1. Welcome and Introductions (10 min)
2. Q4 2025 Review (20 min)
3. Q1 2026 Goals and Objectives (30 min)
4. Budget Review (20 min)
5. Product Roadmap Discussion (25 min)
6. Marketing Strategy (20 min)
7. Action Items and Next Steps (15 min)

Notes Section:
[Space for meeting notes]

Action Items:
[Space for action items with owners and deadlines]

Use clear formatting with tables for agenda items showing time allocations.
"""

print(f"Prompt: {prompt_agenda[:100]}...")
print("\n" + "=" * 60 + "\n")


print("💡 To test these examples:")
print("1. Start the server: uvicorn main:app --reload")
print("2. Run the test client: python test_client.py")
print("3. Or use curl/Postman with the prompts above")
print("\n✨ Happy document generating!")
