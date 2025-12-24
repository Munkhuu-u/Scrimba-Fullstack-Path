let homeScore = 0
let guestScore = 0
let leaderEl = document.getElementById("leader")
let periodNum = 0


function addOnePointHome(){
    console.log("home +1 point")
    homeScore += 1
    document.getElementById("homeScore").textContent = homeScore
    console.log("HOME: home: ", homeScore, "guest: ", guestScore)
    leader()
}
function addOnePointGuest(){
    console.log("guest +1 point")
    guestScore += 1
    document.getElementById("guestScore").textContent = guestScore
    console.log("GUEST: home: ", homeScore, "guest: ", guestScore)
    leader()
}

function leader(){
    console.log("LEADER: home: ", homeScore, "guest: ", guestScore)
    if (guestScore == homeScore && homeScore == 0) 
            {console.log("new game")}
            else   
            // { leaderEl.textContent = "Leader: -" } 
        {if  ( guestScore == homeScore ) 
                {leaderEl.textContent = "Tie" } 
                else
            {if ( guestScore < homeScore ) 
                    {leaderEl.textContent = "Leader: HOME" }
                else {leaderEl.textContent = "Leader: GUEST" }
            }
        }
}
function newGame(){
    homeScore =0
    guestScore =0
    document.getElementById("homeScore").textContent = 0
    document.getElementById("guestScore").textContent = 0
    leaderEl.textContent = "Leader: "
    periodNum = 0
    document.getElementById("period").textContent = "Period: " + periodNum
    
    clearInterval(myInterval)
    time = 600
    timeEl.textContent = "Time: " + `${Math.floor(time/60)}` + ":" + `${time % 60}`
}

function plusPeriod(){
    periodNum += 1   
    document.getElementById("period").textContent = "Period: " + periodNum
}

function lowerPeriod(){
    periodNum -= 1   
    document.getElementById("period").textContent = "Period: " + periodNum
}


let time = 600
let timeEl = document.getElementById("timer")
// setInterval(countdown,1000)
let myInterval = 601


function timerID(){
    if(myInterval == 601){
       myInterval = setInterval(function(){
            console.log("setInterval working...")
            time --
            timeEl.textContent = "Time: " + `${Math.floor(time/60)}` + ":" + `${time % 60}`
        },1000)
    }else{
        console.log("else working...")
        clearInterval(myInterval)
        myInterval = 601
        timeEl.textContent = "Time: " + `${Math.floor(time/60)}` + ":" + `${time % 60}`
    }

}