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