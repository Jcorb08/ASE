var left2right: number[] = [4,9,14,19,24,28,32,36,40,43,46,49,51,53,54];
var right2left: number[] = [0,5,10,15,20,25,29,33,37,41,44,47,50,52,54];
var left2left: number[] = [20,21,22,23,24,37,38,39,40,47,48,49,52,53,54];
var right2right: number[] = [0,1,2,3,4,25,26,27,28,41,42,43,50,51,54];
var startcorner = 1;
var rowArray = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];       //just temporary
var startPlace = rowArray;
var workPlace:number[] = rowArray


if (startcorner = 1){


    //if()
    while(workPlace.filter(x => !left2right.includes(x))){//go left
    //push workplace
    //increcease all values in workplace by 1
    workPlace = workPlace.map(x => x + 1);



    }
    workPlace = startPlace; //reset workplace

        while(workPlace.filter(x => !left2left.includes(x))){//go down
            //push workplace
            for(var i = 0; i < workPlace.length; i++){
       
                if ( workPlace[i] > 24 ){
                  workPlace[i] = workPlace[i] + 5;
                }
                else if(workPlace[i] <40){
                    workPlace[i] = workPlace[i] + 4;
                }
                else if(workPlace[i] <49){
                    workPlace[i] = workPlace[i] + 3;
                }
                else if(workPlace[i] <53){
                    workPlace[i] = workPlace[i] + 2;
                }
                else if(workPlace[i] <54){
                    workPlace[i] = workPlace[i] + 1;
                }
            }
        }
        workPlace = startPlace;

        //this needs encapsulation
//go in

while(workPlace.filter(x => !left2left.includes(x))){//go down
    //push workplace
    for(var i = 0; i < workPlace.length; i++){

        if ( workPlace[i] > 24 ){
          workPlace[i] = workPlace[i] + 6;
        }
        else if(workPlace[i] <40){
            workPlace[i] = workPlace[i] + 5;
        }
        else if(workPlace[i] <49){
            workPlace[i] = workPlace[i] + 4;
        }
        else if(workPlace[i] <53){
            workPlace[i] = workPlace[i] + 3;
        }
        else if(workPlace[i] <54){
            workPlace[i] = workPlace[i] + 2;
        }
    }
}
workPlace = startPlace;
//call that encapsulation

for(var i = 0; i < workPlace.length; i++){//next level
       
    if ( workPlace[i] < 24 ){
        if(workPlace[i] < 4){
        workPlace[i] = workPlace[i] + 25;
        }
        else if (workPlace[i] < 9){
            workPlace[i] = workPlace[i] + 24;
        }
        else if (workPlace[i] < 14){
            workPlace[i] = workPlace[i] + 23;
        }
        else if (workPlace[i] < 19){
            workPlace[i] = workPlace[i] + 22;
        }
        else if (workPlace[i] < 24){
            workPlace[i] = workPlace[i] + 21;
        }
    }
    else if(workPlace[i] <40 && workPlace[i] > 24){
        if(workPlace[i] < 28){
            workPlace[i] = workPlace[i] + 16;
            }
            else if (workPlace[i] < 32){
                workPlace[i] = workPlace[i] + 15;
            }
            else if (workPlace[i] < 36){
                workPlace[i] = workPlace[i] + 14;
            }
            else if (workPlace[i] < 40){
                workPlace[i] = workPlace[i] + 13;
            }
    }
    else if(workPlace[i] <49 && workPlace[i] > 40){
        if(workPlace[i] < 43){
            workPlace[i] = workPlace[i] + 9;
            }
            else if (workPlace[i] < 46){
                workPlace[i] = workPlace[i] + 8;
            }
            else if (workPlace[i] < 49){
                workPlace[i] = workPlace[i] + 7;
            }
                
    }
    else if(workPlace[i] <53 && workPlace[i] > 49){
       if(workPlace[i] < 51){
        workPlace[i] = workPlace[i] + 4;
       }
       else if (workPlace[i] < 53){
        workPlace[i] = workPlace[i] + 3;
       }
    }
    else if(workPlace[i] <54){
        workPlace[i] = workPlace[i] + 1;
    }
}
startPlace= workPlace;





    
    ////left 2 left transform workplace
    
    
    

startcorner ++;





}

