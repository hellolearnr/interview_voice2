import { BriefcaseBusinessIcon, Calendar, Code2Icon, CrownIcon, LayoutDashboard, List, Puzzle, Settings, User2Icon, WalletCards } from "lucide-react";
import path from "path";

export const SideBarOptions = [
    {
        name: "Dashboard",
        icon: LayoutDashboard,
        path:'/dashboard',
    },
{
        name: "Scheduled Interviews",   
        icon: Calendar,
        path:'/scheduled-interviews',
    },
    {
        name: "All Interviews",
        icon: List,
        path:'/all-interviews',
    },
    {
        name: "Billing",
        icon: WalletCards,
        path:'/billing',
    },
    {
        name: "Setting",
        icon: Settings,
        path:'/settings',
    }

]
export const InterviewType = [
  {
    title: 'Technical',
    icon: Code2Icon
  },
  {
    title: 'Behavioral',
    icon: User2Icon
  },
  {
    title: 'Experience',
    icon: BriefcaseBusinessIcon
  },
  {
    title: 'Problem Solving',
    icon: Puzzle
  },
  {
    title: 'Leadership',
    icon: CrownIcon
  },
];

export const QUESTIONS_PROMPT = `You are an expert technical interviewer.
Based on the following inputs, generate a well-structured list of high-quality interview questions:
Job Title: {{jobTitle}}
Job Description: {{jobDescription}}
Interview Duration: {{duration}}
Interview Type: {{type}}
📝 Your task:
Analyze the job description to identify key responsibilities, required skills, and expected experience.
Generate a list of interview questions depends on interview duration
Adjust the number and depth of questions to match the interview duration.
Ensure the questions match the tone and structure of a real-life {{type}} interview.
🪴 Format your response in JSON format with array list of questions.
format: interviewQuestions=[
{
  question:"",
  type:'Technical/Behavioral/Experience/Problem Solving/Leadership'
},{
...
}]
🎯 The goal is to create a structured, relevant, and time-optimized interview plan for a {{jobTitle}} role.`

export const FEEDBACK_PROMPT = `Here is a conversation between an AI interviewer and a candidate:

{{conversation}}

Based on this conversation, please provide detailed feedback on the candidate's interview performance. 
Give me ratings out of 10 for the following areas:
1. Technical Skills
2. Communication
3. Problem Solving
4. Experience

Also provide:
- A summary of the interview in 3 lines
- A clear recommendation on whether to hire this candidate or not
- A one-line recommendation message

Please format your response as valid JSON with this exact structure:
{
  "feedback": {
    "rating": {
      "technicalSkills": 0,
      "communication": 0,
      "problemSolving": 0,
      "experience": 0
    },
    "summary": "",
    "recommendation": "Yes/No",
    "recommendationMsg": ""
  }
}` 