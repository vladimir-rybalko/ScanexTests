L.TileLayer.NDVI = L.TileLayer.extend({
    options: {},

    initialize: function(url, options) {
        options.crossOrigin = true;
        L.TileLayer.prototype.initialize.call(this, url, options);

        this.on('tileload', function(e) {
            this._makeNdvi(e.tile);
        });
    },

    _makeNdvi: function(img) {
        if (img.getAttribute('ndvi'))
            return;

        img.crossOrigin = '';
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        var imgd = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var pix = imgd.data;
        for (var i = 0, n = pix.length; i < n; i += 4) {
        	var sum = pix[i]/256 + pix[i + 1]/256 + pix[i + 2]/256;
        	if(sum < 0.5){
        		pix[i] = 0;
        		pix[i+1] = 0;
        		pix[i+2] = 0;
        	}
        	if(sum > 0.5 && sum <= 1){
        		pix[i] = 50;
        		pix[i+1] = 205;
        		pix[i+2] = 50;
        	}
        	if( sum > 1 && sum <= 1.5){
        		pix[i] = 34;
        		pix[i+1] = 139;
        		pix[i+2] = 34;
        	}
        	if( sum > 1.5 && sum <= 2){
        		pix[i] = 0;
        		pix[i+1] = 128;
        		pix[i+2] = 0;
        	}
        	if(sum > 2){
        		pix[i] = 0;
        		pix[i+1] = 100;
        		pix[i+2] = 0;
        	}
        }
        ctx.putImageData(imgd, 0, 0);
        img.setAttribute('ndvi', true);
        img.src = canvas.toDataURL();
    }
});

L.tileLayer.ndvi = function(url, options) {
    return new L.TileLayer.NDVI(url, options);
};