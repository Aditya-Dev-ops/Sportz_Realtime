import { number } from "zod";
import { match_status } from "../validation/matches";

export function getMatchedStatus(startTime , endTime , now=new Date()){
    const start = new Date(startTime);
    const end = new Date(endTime);

    if(Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())){
        return null;
    }
    if(now < start){
        return match_status.scheduled;
    }

    if(now >= end){
        return match_status.finished;
    }
    
    return match_status.live;
};

export async function syncMatchStatus(match , updateStatus){
    const nextStatus = getMatchedStatus(match.startTime , match.endTime);

    if(!nextStatus){
        return match.status;
    }
    if(match.status !== nextStatus){
        return nextStatus;
    }
    return match.status;
}