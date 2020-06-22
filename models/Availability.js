let Timeblock = require('./Timeblock.js');

let data = {};
/**
 *
 * @param availDays        List of Dates available for users to input their availability
 * @return                 A Availability representing a availability of a grEAT
 */
class Availability {
  /**
   * Adds a new availability for a greating given the date range and
   * time range.
   */
  static createAvailability(availDays, timeRange, length, greatID, range = true) {
    // time range is a 2-element Date list taking the starting hr and min
console.log(availDays);
console.log(timeRange);
    let availDict = {};
    let day = new Date(availDays[0]);
    let timeRangeBegin = new Date(timeRange[0]);
    let timeRangeEnd = new Date(timeRange[1]);
    if(range){
      while(day.getTime() <= new Date(availDays[1]).getTime()){
        let time = new Date(day.getFullYear(), day.getMonth(),day.getDate()).getTime();
        availDict[time] = [];
        for(let i = 0; i < 60*24; i+=15){
          if(i >= timeRangeBegin.getHours()*60 + timeRangeBegin.getMinutes() && i < timeRangeEnd.getHours()*60 + timeRangeEnd.getMinutes()){
            availDict[time].push(Timeblock(new Date(day.getFullYear(), day.getMonth(),day.getDate(), Math.floor(i/60), i%60)));
          }else{
            let tb = Timeblock(new Date(day.getFullYear(), day.getMonth(),day.getDate(), Math.floor(i/60), i%60));
            tb.setIsActive(false);
            availDict[time].push(tb);
          }
        }
        day = new Date(day.getTime() + 86400000);
      }
    }
    // else{ // given a list of possible days instead of a range
    //   for(let day of availDays){
    //     let time = new Date(day.getFullYear(), day.getMonth(),day.getDate()).getTime();
    //     availDict[time] = [];
    //     for(let i = timeRangeBegin.getHours()*60 + timeRangeBegin.getMinutes(); i < timeRangeEnd.getHours()*60 + timeRangeEnd.getMinutes(); i+=15){
    //       availDict[time].push(Timeblock(new Date(day.getFullYear(), day.getMonth(),day.getDate(), Math.floor(i/60), i%60)));
    //     }
    //   }
    // }
    data[greatID] = {
      availabilityDict: availDict,
      length: length*60000,
      max: 0,
      info: {availDays,timeRange,length}
    };
  }

  /**
   * Gets the starting times with the most amount of people available.
   */
  static bestAvailability(id){
    let maxUsers = data[id].max;
    let maxBlocks = {};
    let out = []
    let copy = {...data[id].availabilityDict};
    while(out.length === 0){
      for(let day of Object.keys(copy)){
        maxBlocks[day] = [];
        for(let block of copy[day]){
          if( block.getIsActive() && block.getNumAvailableUsers() >= maxUsers){
            maxBlocks[day].push(block);
          }
        }
        out.push.apply(out,Availability.range(data[id].length,maxBlocks[day]));
      }
      maxUsers--;
    }
    return out;
  }

  /**
   * Helper function for bestAvailability.
   */
  static range(length, blocks){
    let i_add = (length-900000)/900000;
    let fit = [];
    for(let i = 0; i < blocks.length; i++){
      let x = blocks[i].getStartTime().getTime();
      if(i + i_add < blocks.length){
        let y = blocks[i+i_add].getEndTime().getTime() - length;
        if(x === y){fit.push(x);}
      }else{
        break;
      }
    }
    return fit;
  }

  /**
   * Changes the length of the greating.
   * @newLength is the new length of the greating in milliseconds.
   */
  static updateInfo(id, body, range=true){
    let greatAvail = data[id];
    let startDay = new Date(body.availDays[0]);
    let endDay = new Date(body.availDays[1]);
    let timeRangeBegin = new Date(body.timeRange[0]);
    let timeRangeEnd = new Date(body.timeRange[1]);
    let availDict = greatAvail.availabilityDict;
    while(startDay.getTime() <= endDay.getTime()){
      let time = new Date(startDay.getFullYear(), startDay.getMonth(),startDay.getDate()).getTime();
      if(availDict[time] === undefined){
        availDict[time] = [];
        for(let i = 0; i < 60*24; i+=15){
          if(i >= timeRangeBegin.getHours()*60 + timeRangeBegin.getMinutes() && i < timeRangeEnd.getHours()*60 + timeRangeEnd.getMinutes()){
            availDict[time].push(Timeblock(new Date(startDay.getFullYear(), startDay.getMonth(),startDay.getDate(), Math.floor(i/60), i%60)));
          }else{
            let tb = Timeblock(new Date(startDay.getFullYear(), startDay.getMonth(),startDay.getDate(), Math.floor(i/60), i%60));
            tb.setIsActive(false);
            availDict[time].push(tb);
          }
        }
      }else{
        for(let block of availDict[time]){
          if(block.getStartTime().getHours()*60 + block.getStartTime().getMinutes() >= timeRangeBegin.getHours()*60 + timeRangeBegin.getMinutes()
          && block.getStartTime().getHours()*60 + block.getStartTime().getMinutes() < timeRangeEnd.getHours()*60 + timeRangeEnd.getMinutes()){
            block.setIsActive(true);
          }else{
            block.setIsActive(false);
          }
        }
      }
      startDay = new Date(startDay.getTime() + 86400000);
    }
    for(let key of Object.keys(data[id].availabilityDict)){
      if(parseInt(key) < new Date(body.availDays[0]).getTime() || parseInt(key) > new Date(body.availDays[1]).getTime()){
        for(let block of data[id].availabilityDict[key]){
          block.setIsActive(false);
        }
      }
    }
    greatAvail.info = body;
    greatAvail.length = body.length*60000;
  }

  /**
   * Gets the length of the greating.
   */
  static getInfo(id){
    return data[id].info;
  }

  /**
   * @user email username of the user to update
   * @returns the availability of this user.
   */
  static myAvailability(id,user){
    let out = {}
    for(let day of Object.keys(data[id].availabilityDict)){
      out[day] = [];
      let count = 0;
      for(let block of data[id].availabilityDict[day]){
        if(block.getIsActive()){
          count++;
          out[day].push({time: block.getStartTime().getTime(), available: block.includes(user)});
        }
      }
      if(count === 0){delete out[day];}
    }
    return out;
  }

  /**
   * @returns the all of the timeblocks and the available users to that respective time block.
   */
  static getAvailUsers(id){
    let out = {}
    for(let day of Object.keys(data[id].availabilityDict)){
      for(let block of data[id].availabilityDict[day]){
        if(block.getIsActive()){
          out[block.getStartTime().getTime()] = block.getAvailableUsers();
        }
      }
    }
    return out;
  }

  /**
   * @timeblocks dictionary of times as keys and values being a bool whether a user is available or not
   * @user email username of the user to update
   */
  static update(id, timeblocks, user){
    for(let day of Object.keys(data[id].availabilityDict)){
      for(let block of data[id].availabilityDict[day]){
        if(block.getIsActive()){
          if(timeblocks[block.getStartTime().getTime()]){
            block.addUser(user);
          }else{
            block.deleteUser(user);
          }
          if(block.getAvailableUsers().length > data[id].max){
            data[id].max = block.getAvailableUsers().length;
          }
        }
      }
    }
  }

  /**
   * @timeblocks dictionary of times as keys and values being a bool whether a user is available or not
   * @user email username of the user to update
   */
  static clearUser(id, user){
    for(let day of Object.keys(data[id].availabilityDict)){
      for(let block of data[id].availabilityDict[day]){
        if(block.getIsActive()){
          block.deleteUser(user);
        }
      }
    }
  }

  // might not need these functions anymore

  /**
   * @time is the timeblock, given in datetime milliseconds,
   * that the user is looking for
   * @returns that timeblock
   */
  static findTimeblock(time){
    for(let day of Object.keys(availDict)){
      for(let block of availDict[day]){
        if(block.getStartTime().getTime() == time){
          return block;
        }
      }
    }
  }
}

module.exports = Availability;
