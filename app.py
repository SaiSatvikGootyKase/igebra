from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os
import json
import re
from datetime import datetime
import sqlite3
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure OpenAI
openai.api_key = os.getenv('OPENAI_API_KEY')

# Database setup
def init_db():
    conn = sqlite3.connect('interview_prep.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            job_description TEXT,
            questions TEXT,
            answers TEXT,
            scores TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

init_db()

def extract_skills_from_job_description(job_description):
    """Extract key skills and competencies from job description using AI"""
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": """You are an expert HR analyst and technical recruiter. Extract ALL relevant skills, technologies, competencies, and requirements from the job description.

Return a comprehensive JSON array of skills including:
- Technical skills (programming languages, frameworks, tools, platforms)
- Soft skills (communication, leadership, teamwork, problem-solving)
- Domain knowledge (industry-specific knowledge)
- Certifications and qualifications
- Experience levels and methodologies
- Tools and technologies mentioned

Be thorough and extract 15-25 skills. Return ONLY a valid JSON array like: ["skill1", "skill2", "skill3"]"""
                },
                {
                    "role": "user",
                    "content": f"Extract ALL skills from this job description: {job_description}"
                }
            ],
            max_tokens=800,
            temperature=0.3
        )
        
        skills_text = response.choices[0].message.content
        # Clean and parse the response
        skills_text = re.sub(r'```json\s*|\s*```', '', skills_text)
        skills_text = skills_text.strip()
        
        # Handle cases where the response might not be valid JSON
        try:
            skills = json.loads(skills_text)
            if isinstance(skills, list):
                return skills
            else:
                raise ValueError("Response is not a list")
        except (json.JSONDecodeError, ValueError):
            # If JSON parsing fails, try to extract skills manually
            skills_text = re.sub(r'[\[\]"]', '', skills_text)
            skills = [skill.strip() for skill in skills_text.split(',') if skill.strip()]
            return skills if skills else get_fallback_skills(job_description)
            
    except Exception as e:
        print(f"Error extracting skills: {e}")
        return get_fallback_skills(job_description)

def get_fallback_skills(job_description):
    """Enhanced fallback skill extraction"""
    job_lower = job_description.lower()
    skills = []
    
    # Technical skills
    tech_skills = {
        'python': ['python', 'django', 'flask', 'pandas', 'numpy', 'scikit-learn'],
        'javascript': ['javascript', 'js', 'node.js', 'react', 'angular', 'vue', 'typescript'],
        'java': ['java', 'spring', 'hibernate', 'maven', 'gradle'],
        'c#': ['c#', '.net', 'asp.net', 'entity framework'],
        'sql': ['sql', 'mysql', 'postgresql', 'oracle', 'mongodb', 'database'],
        'aws': ['aws', 'amazon web services', 'ec2', 's3', 'lambda', 'cloud'],
        'azure': ['azure', 'microsoft azure', 'cloud'],
        'docker': ['docker', 'containerization', 'kubernetes', 'k8s'],
        'git': ['git', 'github', 'gitlab', 'version control'],
        'agile': ['agile', 'scrum', 'kanban', 'sprint', 'sprint planning'],
        'ci/cd': ['ci/cd', 'jenkins', 'github actions', 'gitlab ci', 'pipeline'],
        'machine learning': ['machine learning', 'ml', 'ai', 'artificial intelligence', 'deep learning'],
        'data science': ['data science', 'data analysis', 'statistics', 'analytics'],
        'devops': ['devops', 'deployment', 'infrastructure', 'terraform', 'ansible'],
        'frontend': ['html', 'css', 'bootstrap', 'tailwind', 'responsive design'],
        'backend': ['api', 'rest', 'graphql', 'microservices', 'server-side'],
        'mobile': ['ios', 'android', 'react native', 'flutter', 'mobile development'],
        'testing': ['testing', 'unit testing', 'integration testing', 'qa', 'quality assurance']
    }
    
    # Extract technical skills
    for category, keywords in tech_skills.items():
        if any(keyword in job_lower for keyword in keywords):
            skills.append(category.title())
    
    # Soft skills
    soft_skills = {
        'communication': ['communication', 'verbal', 'written', 'presentation'],
        'leadership': ['leadership', 'lead', 'manage', 'management', 'team lead'],
        'teamwork': ['teamwork', 'collaboration', 'team player', 'cross-functional'],
        'problem solving': ['problem solving', 'analytical', 'critical thinking', 'troubleshooting'],
        'time management': ['time management', 'prioritization', 'deadline'],
        'adaptability': ['adaptability', 'flexible', 'learning', 'quick learner'],
        'attention to detail': ['attention to detail', 'detail-oriented', 'accuracy'],
        'creativity': ['creativity', 'innovative', 'creative thinking'],
        'customer service': ['customer service', 'client-facing', 'stakeholder'],
        'project management': ['project management', 'planning', 'coordination']
    }
    
    # Extract soft skills
    for skill, keywords in soft_skills.items():
        if any(keyword in job_lower for keyword in keywords):
            skills.append(skill.title())
    
    # Experience levels
    experience_keywords = ['junior', 'senior', 'lead', 'principal', 'architect', 'entry-level', 'mid-level']
    for keyword in experience_keywords:
        if keyword in job_lower:
            skills.append(f"{keyword.title()} Level")
    
    # Remove duplicates and return
    return list(set(skills)) if skills else ['General Programming', 'Problem Solving', 'Communication']

def generate_interview_questions(job_description, skills, difficulty_level="intermediate"):
    """Generate personalized interview questions based on job description and skills"""
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": f"""You are an expert technical interviewer. Generate 5 personalized interview questions based on the job description and skills.
                    
                    Requirements:
                    - Questions should be {difficulty_level} level
                    - Mix of technical and behavioral questions (3 technical, 2 behavioral)
                    - Directly relevant to the job requirements and extracted skills
                    - Include scenario-based questions
                    - Make questions specific to the technologies and skills mentioned
                    - Return as JSON array with structure: [{{"question": "...", "type": "technical|behavioral", "skill": "..."}}]
                    """
                },
                {
                    "role": "user",
                    "content": f"Job Description: {job_description}\nExtracted Skills: {', '.join(skills)}\nGenerate 5 interview questions."
                }
            ],
            max_tokens=1000,
            temperature=0.7
        )
        
        questions_text = response.choices[0].message.content
        questions_text = re.sub(r'```json\s*|\s*```', '', questions_text)
        questions = json.loads(questions_text)
        return questions
    except Exception as e:
        print(f"Error generating questions: {e}")
        # Enhanced fallback questions based on skills
        return generate_fallback_questions(skills, difficulty_level)

def generate_fallback_questions(skills, difficulty_level):
    """Generate fallback questions based on extracted skills"""
    questions = []
    
    # Technical questions based on skills
    tech_questions = {
        'python': "Can you explain the difference between lists and tuples in Python, and when would you use each?",
        'javascript': "How does JavaScript handle asynchronous operations, and what are the different ways to work with async code?",
        'react': "Explain the concept of React hooks and how they differ from class components.",
        'sql': "How would you optimize a slow-performing SQL query? Walk me through your approach.",
        'aws': "Describe the key AWS services you've worked with and how you would architect a scalable web application.",
        'docker': "Explain the benefits of containerization and how Docker differs from traditional virtualization.",
        'machine learning': "Walk me through the steps you would take to build and deploy a machine learning model.",
        'api': "How would you design a RESTful API? What are the key principles you would follow?",
        'testing': "What testing strategies do you use to ensure code quality? How do you approach unit vs integration testing?"
    }
    
    # Behavioral questions
    behavioral_questions = [
        "Tell me about a challenging technical problem you solved recently. What was your approach?",
        "Describe a situation where you had to work with a difficult team member. How did you handle it?",
        "How do you stay updated with the latest technologies and industry trends?",
        "Tell me about a project where you had to learn a new technology quickly. How did you approach it?",
        "Describe a time when you had to explain a complex technical concept to a non-technical stakeholder."
    ]
    
    # Add technical questions based on skills
    tech_count = 0
    for skill in skills:
        skill_lower = skill.lower()
        for tech_skill, question in tech_questions.items():
            if tech_skill in skill_lower and tech_count < 3:
                questions.append({
                    "question": question,
                    "type": "technical",
                    "skill": skill
                })
                tech_count += 1
                break
    
    # Add behavioral questions
    for i, question in enumerate(behavioral_questions[:2]):
        questions.append({
            "question": question,
            "type": "behavioral",
            "skill": "Problem Solving" if i == 0 else "Communication"
        })
    
    # Ensure we have 5 questions
    while len(questions) < 5:
        questions.append({
            "question": "Can you describe your experience with the technologies mentioned in this role?",
            "type": "technical",
            "skill": "General"
        })
    
    return questions[:5]

def evaluate_answer(question, answer, job_context):
    """Evaluate user's answer using AI with multi-dimensional scoring"""
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": """You are an expert technical interviewer evaluating a candidate's answer. Provide a detailed, nuanced evaluation with varying scores based on the quality of the response.

Scoring Guidelines:
- 9-10: Exceptional - Comprehensive, accurate, well-structured, shows deep understanding
- 7-8: Good - Solid understanding, good communication, minor gaps
- 5-6: Fair - Basic understanding, some inaccuracies, needs improvement
- 3-4: Poor - Significant gaps, unclear communication, major inaccuracies
- 1-2: Very Poor - Minimal understanding, incorrect information

Scoring Dimensions (1-10 scale):
- Technical Accuracy: How correct and up-to-date is the technical information?
- Communication Clarity: How well is the answer articulated and structured?
- Depth of Knowledge: How comprehensive and detailed is the response?
- Contextual Understanding: How well does the answer relate to the job context?
- Problem-Solving Approach: How logical and effective is the problem-solving method?

Return JSON with structure:
{
    "overall_score": 8.5,
    "technical_accuracy": 9,
    "communication_clarity": 8,
    "depth_of_knowledge": 7,
    "contextual_understanding": 9,
    "problem_solving": 8,
    "feedback": "Detailed constructive feedback...",
    "strengths": ["strength1", "strength2"],
    "improvements": ["improvement1", "improvement2"]
}

Be strict and realistic in scoring. Don't give high scores for generic or vague answers."""
                },
                {
                    "role": "user",
                    "content": f"Question: {question}\nAnswer: {answer}\nJob Context: {job_context}\nEvaluate this answer with realistic scoring."
                }
            ],
            max_tokens=800,
            temperature=0.3
        )
        
        evaluation_text = response.choices[0].message.content
        evaluation_text = re.sub(r'```json\s*|\s*```', '', evaluation_text)
        evaluation = json.loads(evaluation_text)
        return evaluation
    except Exception as e:
        print(f"Error evaluating answer: {e}")
        # Enhanced fallback evaluation with more dynamic scoring
        return generate_fallback_evaluation(answer, question)

def generate_fallback_evaluation(answer, question):
    """Generate more dynamic fallback evaluation based on answer quality"""
    answer_length = len(answer)
    answer_words = len(answer.split())
    
    # Base scoring logic
    if answer_words < 20:
        base_score = 3  # Very short answer
    elif answer_words < 50:
        base_score = 5  # Short answer
    elif answer_words < 100:
        base_score = 6  # Medium answer
    elif answer_words < 200:
        base_score = 7  # Good length
    else:
        base_score = 8  # Comprehensive answer
    
    # Adjust based on content quality indicators
    quality_indicators = {
        'technical_terms': len(re.findall(r'\b(api|database|algorithm|framework|library|deployment|testing|debugging|optimization|architecture)\b', answer.lower())),
        'examples': len(re.findall(r'\b(for example|e\.g\.|such as|like|instance)\b', answer.lower())),
        'structure': len(re.findall(r'\b(first|second|third|finally|then|next|also|additionally)\b', answer.lower())),
        'experience': len(re.findall(r'\b(worked|experience|implemented|developed|created|built|designed)\b', answer.lower()))
    }
    
    # Calculate bonus points
    bonus = min(2, sum(quality_indicators.values()) * 0.3)
    final_score = min(10, base_score + bonus)
    
    # Generate dimension scores with some variation
    technical_accuracy = max(1, min(10, final_score + (1 if 'technical' in question.lower() else -1)))
    communication_clarity = max(1, min(10, final_score + (1 if quality_indicators['structure'] > 0 else -1)))
    depth_of_knowledge = max(1, min(10, final_score + (1 if quality_indicators['technical_terms'] > 2 else -1)))
    contextual_understanding = max(1, min(10, final_score + (1 if quality_indicators['experience'] > 0 else -1)))
    problem_solving = max(1, min(10, final_score + (1 if quality_indicators['examples'] > 0 else -1)))
    
    # Generate feedback based on score
    if final_score >= 8:
        feedback = "Excellent response! You demonstrated strong technical knowledge and clear communication."
        strengths = ["Strong technical understanding", "Clear communication", "Good examples provided"]
        improvements = ["Consider adding more specific technical details"]
    elif final_score >= 6:
        feedback = "Good response with room for improvement. Consider adding more specific examples and technical details."
        strengths = ["Basic understanding shown", "Clear communication"]
        improvements = ["Add more specific examples", "Include technical details", "Provide more context"]
    else:
        feedback = "This answer needs significant improvement. Consider providing more detailed responses with specific examples."
        strengths = ["Attempted to answer the question"]
        improvements = ["Provide more detailed responses", "Include specific examples", "Add technical context", "Structure your answer better"]
    
    return {
        "overall_score": round(final_score, 1),
        "technical_accuracy": round(technical_accuracy, 1),
        "communication_clarity": round(communication_clarity, 1),
        "depth_of_knowledge": round(depth_of_knowledge, 1),
        "contextual_understanding": round(contextual_understanding, 1),
        "problem_solving": round(problem_solving, 1),
        "feedback": feedback,
        "strengths": strengths,
        "improvements": improvements
    }

@app.route('/api/parse-job-description', methods=['POST'])
def parse_job_description():
    """Parse job description and extract skills"""
    try:
        data = request.get_json()
        job_description = data.get('job_description', '')
        
        if not job_description:
            return jsonify({'error': 'Job description is required'}), 400
        
        skills = extract_skills_from_job_description(job_description)
        
        return jsonify({
            'success': True,
            'skills': skills,
            'job_description': job_description
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/generate-questions', methods=['POST'])
def generate_questions():
    """Generate personalized interview questions"""
    try:
        data = request.get_json()
        job_description = data.get('job_description', '')
        skills = data.get('skills', [])
        difficulty = data.get('difficulty', 'intermediate')
        
        if not job_description:
            return jsonify({'error': 'Job description is required'}), 400
        
        questions = generate_interview_questions(job_description, skills, difficulty)
        
        return jsonify({
            'success': True,
            'questions': questions,
            'total_questions': len(questions)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/evaluate-answer', methods=['POST'])
def evaluate_answer_endpoint():
    """Evaluate user's answer to a question"""
    try:
        data = request.get_json()
        question = data.get('question', '')
        answer = data.get('answer', '')
        job_context = data.get('job_context', '')
        
        if not question or not answer:
            return jsonify({'error': 'Question and answer are required'}), 400
        
        evaluation = evaluate_answer(question, answer, job_context)
        
        return jsonify({
            'success': True,
            'evaluation': evaluation
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/save-session', methods=['POST'])
def save_session():
    """Save interview session data"""
    try:
        data = request.get_json()
        job_description = data.get('job_description', '')
        questions = json.dumps(data.get('questions', []))
        answers = json.dumps(data.get('answers', []))
        scores = json.dumps(data.get('scores', []))
        
        conn = sqlite3.connect('interview_prep.db')
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO sessions (job_description, questions, answers, scores)
            VALUES (?, ?, ?, ?)
        ''', (job_description, questions, answers, scores))
        session_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'session_id': session_id
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/sessions', methods=['GET'])
def get_sessions():
    """Get all interview sessions"""
    try:
        conn = sqlite3.connect('interview_prep.db')
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM sessions ORDER BY created_at DESC')
        sessions = cursor.fetchall()
        conn.close()
        
        session_list = []
        for session in sessions:
            session_list.append({
                'id': session[0],
                'job_description': session[1][:100] + '...' if len(session[1]) > 100 else session[1],
                'created_at': session[5]
            })
        
        return jsonify({
            'success': True,
            'sessions': session_list
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat()
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000) 