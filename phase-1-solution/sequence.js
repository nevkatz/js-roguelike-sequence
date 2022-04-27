
function addAdjacentRoom(room, roomBefore) {

}
function sequentialRooms() {
   game.resetMap();

   const center = {
      x:Math.round(COLS/2),
      y:Math.round(ROWS/2)
   };

   let width = 50, height = 40;

   let baseRoom = generateRoom(center, width, height);
   
   game.curRoomId++;
   game.carveRoom(baseRoom);
   game.rooms.push(baseRoom);

   drawMap(0, 0, COLS, ROWS);
  
   return true;

}
