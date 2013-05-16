                            canobie.js
                            ==========

              Manipulate images as arrays of pixel data. 
                       Render with the canvas. 
          Accessability and abstraction before performance.
        
                         Have fun with it. 



    1. There is a temporary(?) jQuery dependency
    2. It is still very much in development
    3. This is not a high-performance graphics library.
       It allows you to write readable functions to
       manipulate or analyze pixel data.
        
        
     Core
     
     can.get(id, type);
     ------------------
     Retrieve image data from element. Can be img or video. 
     Type can be 'rgba' (def), 'rgb', 'flat', 'flatrgb'.
         rgba    = {r: 255, g: 255, b: 255, a: 1}
         rgb     = {r: 255, g: 255, b: 255}
         flat    = [255, 255, 255, 1]
         flatrgb = [255, 255, 255]
     
     example: 
     
     <img id="puppy" src="puppy.jpg" />
     <script>
         var puppyData = can.get('puppy');
         //puppyData = [[{r: 200, g: 200, b: 255, a: 1}, {r: 192, g: 201, b: 245, a: 1},....]]
     </script>
     
     
     can.set(id, data);
     ------------------
     Set image data to canvas element. 
     Works for all types.
     
     example: 
     
     <canvas id="canvas"></canvas>
     <script>
         can.set('canvas', puppyData);
     </script>
     
     
     can.px(data, x, y, w, h);
     -------------------------
     Retrieves pixel data at point or selection. 
     Returns single pixel or array.
     
     example:
     
     <script>
         var single = can.px(puppyData, 0, 0);
         // single = {r: 200, g: 200, b: 255, a: 1}
         var arr = can.px(puppyData, 0, 0, 10, 10);
         // arr = [[{r: 200, g: 200, b: 255, a: 1}, {r: 192, g: 201, b: 245, a: 1},....]]
     </script>
     
