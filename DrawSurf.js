function DrawSurf(el) 
{
	if (el)
	{
		this.can = document.getElementById(el);
	}
	else
	{
		this.can = document.createElement('canvas');
	}
	this.ctx = this.can.getContext('2d');
}

DrawSurf.prototype.addToPage = function(pageElement)
{
	pageElement.appendChild(this.can);
}

DrawSurf.prototype.setSize = function(w, h)
{
	if (h == undefined)
	{
		h = w;
	}
	this.can.width = w;
	this.can.height = h;
}

DrawSurf.prototype.clearSurf = function()
{
	this.can.width = this.can.width;
}

DrawSurf.prototype.setComposite = function(comp)
{
	this.ctx.globalCompositeOperation = comp;
}

DrawSurf.prototype.drawImg = function(img, x, y)
{
	this.ctx.drawImage(img, x, y);
}

DrawSurf.prototype.setAlpha = function(a)
{
	this.ctx.globalAlpha = a;
}

