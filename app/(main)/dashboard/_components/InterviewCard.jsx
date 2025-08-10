import { Button } from '@/components/ui/button'
import { Copy, Send } from 'lucide-react'
import moment from 'moment/moment'
import React from 'react'
import { toast } from 'sonner'

function InterviewCard ({interview}) {
    const url = process.env.NEXT_PUBLIC_HOST_URL + '/' + interview?.interview_id

    const copyLink = () => {
        navigator.clipboard.writeText(url);
        toast('Link copied to clipboard!');
    }

    const onSend = () => {
        window.location.href = 'mailto:' + interview?.email + '?subject=Interview Link&body=Please find the interview link below:\n\n' + url;
    }

    return (
        <div className='p-5 border rounded-lg bg-white flex flex-col h-full'>
            <div className='flex items-center justify-between'>
                <div className='h-[40px] w-[40px] bg-primary rounded-full flex-shrink-0' />
                <h2 className='text-sm'>{moment(interview?.created_at).format('DD MMM YYYY')}</h2>
            </div>
            <div className='flex-1'>
                <h2 className='mt-3 font-bold text-lg'>{interview?.jobPosition}</h2>
                <h2 className='mt-2'>{interview?.duration} min</h2>
            </div>
            <div className='flex gap-3 mt-5'>
                <Button 
                    variant='outline' 
                    className='flex-1 min-w-0' 
                    onClick={copyLink}
                >
                    <Copy className='w-4 h-4 mr-2 flex-shrink-0' />
                    <span className='truncate'>Copy</span>
                </Button>
                <Button 
                    className='flex-1 min-w-0' 
                    onClick={onSend}
                >
                    <Send className='w-4 h-4 mr-2 flex-shrink-0' />
                    <span className='truncate'>Send</span>
                </Button>
            </div>
        </div>
    )
}

export default InterviewCard