
function addAdjacentRoom(room, roomBefore) {
 // let axis = Math.random() <= 0.5 ? 'x' : 'y';

  let { width, height } = genDim();

  const distBetween = (axis) => {
      let buff = 2;
      let newSize = axis == 'y' ? height : width;
      let roomSize = room.end[axis] - room.start[axis];
      return Math.ceil((newSize+roomSize)/2) + buff; 
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

  let possibleCenters = (diff=0) => {
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

  let range = 3;
  for (var i = -1*range; i <= range; ++i) {
   for (center of possibleCenters(range)) {
     let r = generateRoom(center, width, height);

     if (withinLimits(r) && !overlapsAny(r)) {
       possibleRooms.push(r);
     }
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

   let r1 = {
      x:Math.round(COLS/2),
      y:Math.round(ROWS/2)
   };
   console.log(r1);

   let baseRoom = addRoom(r1);

   let maxRooms = 20;
  /**
   * @TODO: Add the while loop
   */ 
     for (var i = 0; i < maxRooms; ++i) {
        let newRoom = addAdjacentRoom(baseRoom);
        if (!newRoom) {
          break;
        }
        // new
        baseRoom.connectRoom(newRoom);
        baseRoom = newRoom;
     }

   drawMap(0, 0, COLS, ROWS);
   labelRooms();
   return true;

}
/***
 * @TODO: Add a relic at the end of each passageway
 */