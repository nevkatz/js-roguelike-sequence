
function addAdjacentRoom(room, roomBefore) {
 /**
  * @TODO: Write logic for creating one room after another.
  */ 
}
function sequentialRooms() {
   game.resetMap();

   const center = {
      x:Math.round(COLS/2),
      y:Math.round(ROWS/2)
   };

   /**
    * @TODO: Make the room smaller.
    */ 
   let baseRoom = addRoom(center, 40, 10, 'wide');

   /**
    * @TODO: Create multiple rooms using a loop.
    */ 
   drawMap(0, 0, COLS, ROWS);
  
   return true;

}
