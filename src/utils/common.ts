
export function getRandomInt(min: number, max:number){
    return min + Math.floor((max-min) * Math.random())
}

export function clamp(value: number, min:number,max:number){
    return Math.min(Math.max(value,min),max)
}