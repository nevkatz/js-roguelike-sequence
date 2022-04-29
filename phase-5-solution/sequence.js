
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
function sequentialRooms() {
   game.resetMap();

    // central room
   const center = {
      x:Math.round(COLS/2),
      y:Math.round(ROWS/2)
   };

   let { width, height } = genDim();

   let baseRoom = generateRoom(center, width, height);
   
   game.curRoomId++;
   game.carveRoom(baseRoom);
   game.rooms.push(baseRoom);

   // room sequence
   const maxSeqLen = 10;
   const minTotalRooms = 20;
   const maxTries = 100;
   let tries = 0;

   // start a room sequence
   let roomSequence = [baseRoom];

   // create the array of sequences.
   let sequences = [roomSequence];

   // iterate through the length of the sequence
   while (game.rooms.length < minTotalRooms && tries < maxTries) {

    // let's select a sequence from a list of available sequences.
    let seqIdx= Math.floor(Math.random()*sequences.length);

    roomSequence = sequences[seqIdx];
     
    let roomIdx = Math.floor(Math.random()*(roomSequence.length-1));

    console.log('roomIdx: ' + roomIdx + ' len: ' + roomSequence.length);
    
    baseRoom = roomSequence[roomIdx];

    console.log('baseRoomID: ' + baseRoom.id + ' last id: ' + roomSequence[roomSequence.length-1].id);
    
    console.log('clear room sequence');
    //  more sophisticated algorithm that is conscious of room sequences.
    roomSequence = [];
     for (var i = 0; i < maxSeqLen; ++i) {

        let newRoom = addAdjacentRoom(baseRoom);

         if (!newRoom) {
            // we can't keep getting the root room of the sequence.
            if (roomSequence.length > 1 && baseRoom.tileCount(RELIC_CODE)==0) {
              let coords = baseRoom.selectFreeCoords();

              if (coords) { 
                 console.log('in breakout; adding relic to ' + baseRoom.id + '; room seq len is ' + roomSequence.length);
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
                 console.log('end of seq; adding relic to ' + baseRoom.id);
              placeItem(coords, RELIC_CODE); 
            }

        }
        console.log(`baseRoom ${baseRoom.id} adds room ${newRoom.id}`);
        roomSequence.push(newRoom);
       
        baseRoom = newRoom;
     } // end for loop

     if (roomSequence.length > 0) { 
      console.log('push in finished sequence of ' + roomSequence.length);
      sequences.push(roomSequence); 


     }
     tries++;
   }
   drawMap(0, 0, COLS, ROWS);
   return true;

}