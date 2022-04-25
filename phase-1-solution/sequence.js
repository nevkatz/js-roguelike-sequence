
function addAdjacentRoom(room, roomBefore) {

}
function sequentialRooms() {
   game.resetMap();

   const center = {
      x:Math.round(COLS/2),
      y:Math.round(ROWS/2)
   };

   let baseRoom = addRoom(center, 40, 10, 'wide');

   drawMap(0, 0, COLS, ROWS);
  
   return true;

}
