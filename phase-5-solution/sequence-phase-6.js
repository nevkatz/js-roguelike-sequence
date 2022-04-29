
function addAdjacentRoom(room) {

  let { width, height } = genDim();

  const distBetween = (axis) => {
      let passageLength = 1;
      let newSize = (axis == 'y') ? height : width;
      let roomSize = room.end[axis] - room.start[axis] + 1;
      return Math.ceil(newSize/2)+Math.ceil(roomSize/2) + passageLength; 
  }  
  const withinLimits = (room)=> {
   return room.start.x >= OUTER_LIMIT &&
          room.start.y >= OUTER_LIMIT &&
          room.end.x <= COLS - OUTER_LIMIT &&
          room.end.y <= ROWS - OUTER_LIMIT;
  }
  const overlapsAny = (myRoom) => {
     for (var gameRoom of game.rooms) {
      if (myRoom.overlaps(gameRoom, 1)) {
         return true;
      }
    }
   return false;
  };

  const possibleCenters = (diff=0) => {
   return [
   // above
    {
      x:room.center.x + diff,
      y:room.center.y - distBetween('y')
    },
    // below
    {
      x:room.center.x + diff,
      y:room.center.y + distBetween('y')
    },
    //left
    {
      x:room.center.x - distBetween('x'),
      y:room.center.y + diff
    },
    // right
    {
      x:room.center.x + distBetween('x'),
      y:room.center.y + diff
    }
  ];
  } 



  let possibleRooms = [];

  const maxDiff = 3;
  for (var diff = -1*maxDiff; diff <= maxDiff; ++diff) {
   for (let center of possibleCenters(diff)) {
     let r = generateRoom(center, width, height);

     if (withinLimits(r) && !overlapsAny(r)) {
       possibleRooms.push(r);
     }
   } // end possibleCenters loop
  } // end range loop

  let newRoom = null;

  if (possibleRooms.length > 0) {
     let idx = Math.floor(Math.random()*possibleRooms.length);
     newRoom = possibleRooms[idx];

     game.curRoomId++;

     game.carveRoom(newRoom);
     game.rooms.push(newRoom);
  }
  return newRoom;
}
function addCenterRoom() {
    // central room
   const center = {
      x:Math.round(COLS/2),
      y:Math.round(ROWS/2)
   };

   let { width, height } = genDim();

   let room = generateRoom(center, width, height);
   
   game.curRoomId++;
   game.carveRoom(room);
   game.rooms.push(room);

   return room;
}
function buildSequence() {
   //  more sophisticated algorithm that is conscious of room sequences.
    roomSequence = [];
     for (var i = 0; i < maxSeqLen; ++i) {

        let newRoom = addAdjacentRoom(baseRoom);

         if (!newRoom) {
            // we can't keep getting the root room of the sequence.
            if (roomSequence.length > 1 && baseRoom.tileCount(RELIC_CODE)==0) {
              let coords = baseRoom.selectFreeCoords();

              if (coords) { 
              
                placeItem(coords, RELIC_CODE); 
              }
            }
            // ending the loop here....

          break;
        }
        // new
        let min = 3;
        baseRoom.directConnect(newRoom);

        // new
        if (i == maxSeqLen -1 && !newRoom.tileCount(RELIC_CODE)) {
             let coords = newRoom.generateFreeCoords();

             if (coords) { 
              placeItem(coords, RELIC_CODE); 
            }

        }
        roomSequence.push(newRoom);
       
        baseRoom = newRoom;
     } // end for loop
    return roomSequence;
}
// new function that places relics at the end of each sequence.
function sequentialRooms() {
   game.resetMap();

   let baseRoom = addCenterRoom();

   // start a room sequence
   let roomSequence = [baseRoom];

   // create the array of sequences so we can be conscious of which one.
   // this is effectively a 2D array of rooms.
   // include diagram
   let sequences = [roomSequence];

   // room sequence
   const maxSeqLen = 8;
   const minTotalRooms = 24;
   const maxTries = 100;
   let tries = 0;

   // iterate through the length of the sequence
   while (game.rooms.length < minTotalRooms && tries < maxTries) {

    // let's select a sequence from a list of available sequences.
    let seqIdx= Math.floor(Math.random()*sequences.length);

    roomSequence = sequences[seqIdx];
     
    let roomIdx = Math.floor(Math.random()*(roomSequence.length-1));

    baseRoom = roomSequence[roomIdx];

    roomSequence = buildSequence(baseRoom);

     if (roomSequence.length > 0) { 
      console.log('push in finished sequence of ' + roomSequence.length);
      sequences.push(roomSequence); 


     }
     tries++;
   }
   drawMap(0, 0, COLS, ROWS);
   return true;

}