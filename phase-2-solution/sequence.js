
function addAdjacentRoom(room) {

  let width = 11, height = 6;

  const distBetween = (axis) => {
      let passageLength = 1;
      let newSize = (axis == 'y') ? height : width;
      let roomSize = room.end[axis] - room.start[axis] + 1;
      return Math.ceil(newSize/2)+Math.ceil(roomSize/2) + passageLength; 
  } 
  const withinLimits =(room)=> {
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


  for (let center of possibleCenters()) {
    
     let r = generateRoom(center, width, height);

     if (withinLimits(r) && !overlapsAny(r)) {
       possibleRooms.push(r);
     }
   }

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

   const center = {
      x:Math.round(COLS/2),
      y:Math.round(ROWS/2)
   };

   let width = 11, height = 6;

   let baseRoom = generateRoom(center, width, height);

   game.curRoomId++;
   game.carveRoom(baseRoom);
   game.rooms.push(baseRoom);

   const maxSeqLen = 20;

     for (var i = 0; i < maxSeqLen; ++i) {
        let newRoom = addAdjacentRoom(baseRoom);
        if (!newRoom) {
          break;
        }
        // new
        baseRoom.directConnect(newRoom);
        baseRoom = newRoom;
     }

   drawMap(0, 0, COLS, ROWS);

   return true;

}
