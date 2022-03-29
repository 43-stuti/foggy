export default class node {
    constructor(r, c, canvas, ctx, spacing) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.r = r;
        this.c = c;
        this.spacing = spacing;
    }
    drawGrid = () => {
        this.canvas.width = this.r*this.spacing;
        this.canvas.height =this.c*this.spacing;
        let w = this.canvas.width;
        let h = this.canvas.height;
        this.ctx.beginPath();
      
        this.ctx.strokeStyle = 'rgb(0, 0, 0, 1)';
        this.ctx.lineWidth = 1;
      
        for (var x=0; x<=w; x+=this.spacing) {
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, h);
         }
      
          for (var y=0;y<=h;y+=this.spacing) {
              this.ctx.moveTo(0, y);
              this.ctx.lineTo(w, y);
          }
        this.ctx.stroke();
    };
}
