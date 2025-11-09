# AI Interview Prep 🚀

A sophisticated AI-powered interview preparation platform that transforms job descriptions into personalized interview experiences with real-time evaluation and detailed feedback.

## ✨ Features

### 🧠 AI-Powered Analysis

- **Intelligent Job Description Parsing**: Extracts key skills and competencies using advanced AI
- **Personalized Question Generation**: Creates job-specific interview questions based on extracted skills
- **Multi-dimensional Evaluation**: Real-time scoring across 5 key dimensions
- **Context-Aware Feedback**: Professional-level insights tailored to your responses

### 🎯 Core Functionality

- **Skill Extraction**: Automatically identifies technical and soft skills from job postings
- **Dynamic Question Types**: Mix of technical and behavioral questions with increasing complexity
- **Real-time Evaluation**: Instant feedback with detailed scoring and improvement suggestions
- **Performance Tracking**: Comprehensive results with downloadable reports
- **Session History**: Track your progress across multiple interview sessions

### 🎨 Modern UI/UX

- **Responsive Design**: Beautiful, modern interface that works on all devices
- **Glass Morphism**: Elegant glass-effect design with gradient backgrounds
- **Progress Tracking**: Visual progress indicators throughout the interview process
- **Interactive Elements**: Smooth animations and intuitive user interactions

## 🏗️ Architecture

### Backend (Python/Flask)

- **Flask API**: RESTful endpoints for all functionality
- **OpenAI Integration**: GPT-3.5-turbo for AI-powered features
- **SQLite Database**: Lightweight data storage for sessions
- **CORS Support**: Cross-origin resource sharing for frontend integration

### Frontend (React.js)

- **React 18**: Modern React with hooks and functional components
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Lucide React**: Beautiful, customizable icons
- **Axios**: HTTP client for API communication

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- OpenAI API Key

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ai-interview-prep
   ```

2. **Set up the backend**

   ```bash
   # Install Python dependencies
   pip install -r requirements.txt

   # Create environment file
   echo "OPENAI_API_KEY=your_openai_api_key_here" > .env
   ```

3. **Set up the frontend**

   ```bash
   # Install Node.js dependencies
   npm install
   ```

4. **Start the application**

   ```bash
   # Terminal 1: Start backend server
   python app.py

   # Terminal 2: Start frontend development server
   npm start
   ```

//
//backend//
python -m venv .venv
.venv\Scripts\activate # Windows PowerShell
pip install -r requirements.txt
python app.py

//frontend//
npm install
npm start
//

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📋 Usage Guide

### 1. Job Description Input

- Paste or upload a job description
- Use the "Load Sample" button to try with example data
- Click "Analyze & Extract Skills" to begin

### 2. Skill Extraction

- Review automatically extracted skills
- Choose difficulty level (Beginner/Intermediate/Advanced)
- Generate personalized questions

### 3. Interview Session

- Answer questions one by one
- Take your time to provide detailed responses
- Submit answers for real-time evaluation

### 4. Results & Feedback

- View comprehensive performance analysis
- Review detailed feedback for each question
- Download results for future reference
- Track progress over time

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

### API Endpoints

| Endpoint                     | Method | Description                         |
| ---------------------------- | ------ | ----------------------------------- |
| `/api/parse-job-description` | POST   | Extract skills from job description |
| `/api/generate-questions`    | POST   | Generate personalized questions     |
| `/api/evaluate-answer`       | POST   | Evaluate user's answer              |
| `/api/save-session`          | POST   | Save interview session              |
| `/api/sessions`              | GET    | Get all interview sessions          |
| `/api/health`                | GET    | Health check endpoint               |

## 🎯 Evaluation Framework

### Scoring Dimensions (1-10 scale)

- **Technical Accuracy**: Correctness and up-to-date technical information
- **Communication Clarity**: How well the answer is articulated and structured
- **Depth of Knowledge**: Comprehensiveness and detail of the response
- **Contextual Understanding**: Relevance to the job context
- **Problem-Solving Approach**: Logical and effective problem-solving method

### Performance Levels

- **Excellent (8-10)**: Outstanding performance with room for minor improvements
- **Good (6-7.9)**: Solid performance with specific areas for enhancement
- **Fair (4-5.9)**: Adequate performance requiring significant improvement
- **Needs Improvement (0-3.9)**: Requires substantial work on multiple areas

## 🛠️ Development

### Project Structure

```
ai-interview-prep/
├── app.py                 # Flask backend server
├── requirements.txt       # Python dependencies
├── package.json          # Node.js dependencies
├── tailwind.config.js    # Tailwind CSS configuration
├── postcss.config.js     # PostCSS configuration
├── public/               # Static files
│   └── index.html
├── src/                  # React frontend source
│   ├── App.js           # Main React component
│   ├── index.js         # React entry point
│   ├── index.css        # Global styles
│   └── components/      # React components
│       ├── Header.js
│       ├── JobDescriptionInput.js
│       ├── InterviewSession.js
│       ├── Results.js
│       └── Dashboard.js
└── README.md            # This file
```

### Adding New Features

1. **Backend**: Add new endpoints in `app.py`
2. **Frontend**: Create new components in `src/components/`
3. **Styling**: Use Tailwind CSS classes for consistent design
4. **Testing**: Test both API endpoints and React components

## 🔒 Security Considerations

- **API Key Protection**: Never expose OpenAI API keys in client-side code
- **Input Validation**: All user inputs are validated on both frontend and backend
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **CORS Configuration**: Properly configured for development and production

## 🚀 Deployment

### Backend Deployment

```bash
# Using Python Anywhere, Heroku, or similar
pip install -r requirements.txt
python app.py
```

### Frontend Deployment

```bash
# Build for production
npm run build

# Deploy to Netlify, Vercel, or similar
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for providing the GPT API
- React and Flask communities for excellent documentation
- Tailwind CSS for the beautiful styling framework
- Lucide for the amazing icon library

## 📞 Support

For support, email gk.saisatvik@gmail.com.

---

**Built with ❤️ for US**
