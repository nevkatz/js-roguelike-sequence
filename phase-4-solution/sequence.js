
function addAdjacentRoom(room) {

  const distBetween = (axis) => {
      let buff = 2;
      let newSize = axis == 'y' ? height : width;
      let roomSize = room.end[axis] - room.start[axis];
      return Math.ceil((newSize+roomSize)/2) + buff; 
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

  let { width, height } = genDim();

  let range = 3;
  for (var i = -1*range; i <= range; ++i) {
   for (let center of possibleCenters(range)) {

     let r = generateRoom(center, width, height);

     if (withinLimits(r) && !overlapsAny(r)) {
       possibleRooms.push(r);
     }
   }
  }
  let newRoom = null;
  console.log('possible rooms: ' + possibleRooms.length);
  if (possibleRooms.length > 0) {
     let idx = Math.floor(Math.random()*possibleRooms.length);
     newRoom = possibleRooms[idx];
     game.curRoomId++;
     console.log('placing room...');
     console.log(newRoom);
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

   let baseRoom = addRoom(center);

   let maxRooms = 20;
   let minRooms = 20;

   while (game.rooms.length < minRooms) {
     
     let idx = Math.floor(Math.random()*game.rooms.length);
     baseRoom = game.rooms[idx];

     for (var i = 0; i < maxRooms; ++i) {
        let newRoom = addAdjacentRoom(baseRoom);
        if (!newRoom) {
          /**
           * @TODO: Add relic to some spot in the room.
           */ 
          break;
        }
        // new
        let min = 3;
        baseRoom.directConnect(newRoom,min,true);
        baseRoom = newRoom;
     }
   }
   // maybe talk about these to get different results
  // for (var room of game.rooms) {
   //   let success = room.findFacingRooms(3);

     // let success = room.nearestNeighbor();

      //console.log(`Room${room.id} success: ${success}`);
  // }

   // after this, select other rooms to branch off of

   drawMap(0, 0, COLS, ROWS);


   return true;

}
/***
 * @TODO: Add a relic at the end of each passageway
 */