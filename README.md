# AI-Powered Resume Analyzer

An intelligent resume analysis tool built with Next.js that provides AI-powered feedback, skill analysis, and personalized recommendations to help job seekers improve their resumes and land their dream jobs.

## Features

- **AI-Powered Analysis**: Get intelligent feedback on your resume using advanced AI algorithms
- **PDF Text Extraction**: Upload PDF resumes and automatically extract text content
- **Job Matching**: Compare your resume against specific job descriptions for targeted analysis
- **Skill Gap Analysis**: Identify missing skills and get recommendations for improvement
- **Interactive Dashboard**: Track your resume improvement journey over time
- **Real-time Scoring**: Get instant overall scores and job match percentages
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **AI Integration**: OpenAI GPT API via Vercel AI SDK
- **PDF Processing**: Custom PDF text extraction
- **Icons**: Lucide React
- **Deployment**: Vercel (recommended)

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18.0 or later
- npm or yarn package manager
- An OpenAI API account (for AI analysis features)

## Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd resume-analyzer
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Set up environment variables**
   Create a \`.env.local\` file in the root directory and add your environment variables:
   \`\`\`env
   OPENAI_API_KEY=your_openai_api_key_here
   \`\`\`

4. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## Environment Variables

### Required Variables

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| \`OPENAI_API_KEY\` | Your OpenAI API key for AI-powered analysis | [OpenAI Platform](https://platform.openai.com/api-keys) |

### Optional Variables (for production)

| Variable | Description | Default |
|----------|-------------|---------|
| \`NEXT_PUBLIC_APP_URL\` | Your app's public URL | \`http://localhost:3000\` |
| \`NODE_ENV\` | Environment mode | \`development\` |

### Setting up OpenAI API Key

1. **Create an OpenAI Account**
   - Go to [OpenAI Platform](https://platform.openai.com/)
   - Sign up or log in to your account

2. **Generate API Key**
   - Navigate to [API Keys](https://platform.openai.com/api-keys)
   - Click "Create new secret key"
   - Copy the generated key (it starts with \`sk-\`)
   - **Important**: Store this key securely and never commit it to version control

3. **Add to Environment**
   - Create \`.env.local\` file in your project root
   - Add: \`OPENAI_API_KEY=sk-your-actual-key-here\`
   - The app will automatically use this for AI analysis

### Environment File Example

Create a \`.env.local\` file:

\`\`\`env
# Required - OpenAI API Key for AI analysis
OPENAI_API_KEY=sk-proj-your-openai-api-key-here

# Optional - App URL (for production)
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Optional - Environment
NODE_ENV=development
\`\`\`

## Project Structure

\`\`\`
resume-analyzer/
├── app/
│   ├── api/
│   │   ├── analyze-resume/          # Main AI analysis endpoint
│   │   ├── analyze-resume-demo/     # Demo analysis (fallback)
│   │   └── extract-pdf/             # PDF text extraction
│   ├── analyze/                     # Resume analysis page
│   ├── dashboard/                   # User dashboard
│   ├── globals.css                  # Global styles
│   ├── layout.tsx                   # Root layout
│   └── page.tsx                     # Home page
├── components/
│   └── ui/                          # shadcn/ui components
├── lib/
│   └── utils.ts                     # Utility functions
├── public/                          # Static assets
├── .env.local                       # Environment variables (create this)
├── package.json                     # Dependencies
├── tailwind.config.ts               # Tailwind configuration
└── README.md                        # This file
\`\`\`

## Usage

### Basic Resume Analysis

1. **Navigate to Analysis Page**
   - Click "Analyze Resume" from the homepage
   - Or go directly to \`/analyze\`

2. **Input Your Resume**
   - **Recommended**: Copy and paste your resume text directly (most accurate)
   - Upload a plain text (.txt) file, or
   - Use the "Try Sample Resume" button to see how it works
   - **Note**: PDF upload is temporarily disabled for better performance

3. **For PDF Users**
   - Open your PDF resume
   - Select all text (Ctrl+A or Cmd+A)
   - Copy the text (Ctrl+C or Cmd+C)  
   - Paste it in the text area

4. **Add Job Description (Optional)**
   - Paste a job description for targeted analysis
   - Use sample job descriptions provided
   - This enables job matching features

5. **Get Analysis**
   - Click "Analyze Resume"
   - Wait for AI processing (usually 2-5 seconds)
   - Review detailed feedback and recommendations

### Dashboard Features

- **Analysis History**: View all your previous resume analyses
- **Progress Tracking**: Monitor improvement over time
- **Quick Actions**: Easy access to new analysis and tips
- **Performance Metrics**: Overall scores, best scores, and trends

## API Endpoints

### \`POST /api/analyze-resume\`
Main analysis endpoint that processes resume text and job descriptions.

**Request Body:**
\`\`\`json
{
  "resumeText": "Your resume content...",
  "jobDescription": "Job description (optional)..."
}
\`\`\`

**Response:**
\`\`\`json
{
  "overallScore": 85,
  "jobMatchScore": 78,
  "strengths": ["Strong technical skills", "..."],
  "weaknesses": ["Could add more metrics", "..."],
  "skillsFound": ["JavaScript", "React", "..."],
  "missingSkills": ["Docker", "AWS", "..."],
  "recommendations": ["Add quantified achievements", "..."]
}
\`\`\`

### \`POST /api/extract-pdf\`
Extracts text content from uploaded PDF files.

**Request:** FormData with PDF file
**Response:** Extracted text content

## Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   \`\`\`bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   \`\`\`

2. **Deploy to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard
   - Deploy

3. **Set Environment Variables in Vercel**
   - Go to Project Settings → Environment Variables
   - Add \`OPENAI_API_KEY\` with your OpenAI key
   - Redeploy if needed

### Deploy to Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

Make sure to:
- Set the build command: \`npm run build\`
- Set the start command: \`npm start\`
- Configure environment variables

## Development

### Running Tests
\`\`\`bash
npm run lint          # Run ESLint
npm run build         # Test production build
\`\`\`

### Adding New Features

1. **API Routes**: Add new endpoints in \`app/api/\`
2. **Pages**: Create new pages in \`app/\`
3. **Components**: Add reusable components in \`components/\`
4. **Styling**: Use Tailwind classes and shadcn/ui components

### Customization

- **Styling**: Modify \`tailwind.config.ts\` and component styles
- **AI Analysis**: Customize analysis logic in \`app/api/analyze-resume/route.ts\`
- **Skills Database**: Update skill detection in the analysis function
- **UI Components**: Extend or modify shadcn/ui components

## Troubleshooting

### Common Issues

1. **"OpenAI API key not found" Error**
   - Ensure \`.env.local\` file exists in project root
   - Verify \`OPENAI_API_KEY\` is correctly set
   - Restart the development server

2. **PDF Upload Not Working**
   - Check file size (should be under 10MB)
   - Ensure file is a valid PDF
   - Try copying and pasting text manually

3. **PDF Upload Issues**
   - PDF extraction is temporarily disabled for performance reasons
   - Copy and paste text from your PDF manually for best results
   - This ensures 100% accuracy and faster processing

4. **Analysis Taking Too Long**
   - Check your OpenAI API quota
   - Verify internet connection
   - Try with shorter resume text

5. **Build Errors**
   - Run \`npm install\` to ensure all dependencies are installed
   - Check Node.js version (18+ required)
   - Clear \`.next\` folder and rebuild

### Getting Help

- Check the [Issues](repository-issues-url) page for known problems
- Create a new issue if you encounter bugs
- Review the [Next.js documentation](https://nextjs.org/docs)
- Check [OpenAI API documentation](https://platform.openai.com/docs)

## Contributing

1. Fork the repository
2. Create a feature branch: \`git checkout -b feature-name\`
3. Make your changes
4. Run tests: \`npm run lint\`
5. Commit changes: \`git commit -m 'Add feature'\`
6. Push to branch: \`git push origin feature-name\`
7. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- AI powered by [OpenAI](https://openai.com/)
- Icons from [Lucide](https://lucide.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

---

**Note**: This application requires an OpenAI API key to function properly. The demo mode provides limited functionality without API access.
