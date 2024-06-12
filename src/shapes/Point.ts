interface IPoint{
    x: number
    y: number
    getX: ()=> number
    setX: (x: number)=> void 

    distance: (point: IPoint) => number
}

export default class Point implements IPoint{
    x: number
    y: number
    constructor(x:number, y:number){
        this.x = x
        this.y = y
    }

    getX= () => this.x
    setX= (x: number) => {
        this.x = x
    }

    distance = (point: IPoint) => {
        return Math.sqrt(Math.pow(point.x - this.x,2) + Math.pow(point.y - this.y,2))
    }
}
