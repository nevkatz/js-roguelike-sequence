
function addAdjacentRoom(room, roomBefore) {
 /**
  * @TODO: Write logic for creating one room after another.
  */ 
}
function sequentialRooms() {
   game.resetMap();

   let r1 = {
      x:Math.round(COLS/2),
      y:Math.round(ROWS/2)
   };

   /**
    * @TODO: Make the room smaller and create multiple rooms using a loop
    */ 
   let baseRoom = addRoom(r1, 40, 10, 'wide');

   drawMap(0, 0, COLS, ROWS);
  
   return true;

}
/***
 * @TODO: Add a relic at the end of each passageway
 */