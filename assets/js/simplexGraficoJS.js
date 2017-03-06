var entradaCapturada = false;
var numVariables = 2;
var cleanCanvas,canvas;
var numRestricciones;
var ctx,ctxClean;
var x1Array,x2Array,zArray,pendientes,lineas;
var escalaX1,escalaX2;
var cuadro;
var maxX1, maxX2;
var zX1,zX2;
var zRes;
var colores;
var intersecciones,areaFactible;
function entrada_variables() {
	numRestricciones = parseInt(document.getElementById('restricciones').value);
	if(isNaN(numRestricciones))
	{
		alert("Los datos no son válidos");
		return;
	}
	if(entradaCapturada)
		return;
	entradaCapturada = true;
	var mensajePrimero = document.getElementById('mensajePrimero1');
	if(mensajePrimero != null)
	{
		mensajePrimero.parentNode.removeChild(mensajePrimero);
		mensajePrimero = document.getElementById('mensajePrimero2');
		mensajePrimero.parentNode.removeChild(mensajePrimero);
	}
	tabla = document.getElementById('tabla');
	var cabeceras, cabeza;
	
	//Se agregan las cabeceras de la tabla de restricciones
	cabeceras = document.getElementById('cabeceras');
	for (var i = 0; i < numVariables; i++) {
		cabeceras.insertAdjacentHTML('beforeEnd','<th>X' + (i+1) + '</th>');
		cabeceras.insertAdjacentHTML('beforeEnd','<th style="min-width:20px;"></th>');
	}
	cabeceras.insertAdjacentHTML('beforeEnd','<th style="min-width:20px"></th>');
	cabeceras.insertAdjacentHTML('beforeEnd','<th style="min-width:20px"></th>');
	cabeceras.insertAdjacentHTML('beforeEnd','<th>R</th>');
	cabeceras.insertAdjacentHTML('beforeEnd','<tr>');
	
	//Se agregan las cabeceras de la tabla de la función objetivo
	cabeza = document.getElementById('cabeza');
	cabeza.insertAdjacentHTML('beforeEnd','<th>Z</th>');
	for (var i = 0; i < numVariables; i++) {
		cabeza.insertAdjacentHTML('beforeEnd','<th style="min-width:20px"></th>');
		cabeza.insertAdjacentHTML('beforeEnd','<th>X' + (i+1) + '</th>');
	}
	//Se agregan los campos a la tabla de la función objetivo
	tablaObjetivo = document.getElementById('funcionObjetivo');
	tablaObjetivo.insertAdjacentHTML('beforeEnd','<tr id="coeficientesObjetivo"></tr>');
	for (var i = 0; i < numVariables+1; i++) {
		if(i==0)
		{
			document.getElementById('coeficientesObjetivo').insertAdjacentHTML('beforeEnd','<td><input style="text-align:center" type="number" placeholder="Z" class="span1 m-wrap" value="1" readonly></td>');
			document.getElementById('coeficientesObjetivo').insertAdjacentHTML('beforeEnd','<td>=</td>');
		}
		else
		{
			if(i!=1)
				document.getElementById('coeficientesObjetivo').insertAdjacentHTML('beforeEnd','<td><label>+</label></td>');
			document.getElementById('coeficientesObjetivo').insertAdjacentHTML('beforeEnd','<td><input type="number" class="coeficientes span1 m-wrap" ></td>');
		}
	}

	colores = new Array();
	
	for(i=0;i<numRestricciones;i++)
	{
		tabla.insertAdjacentHTML('beforeEnd','<tr id="fila' + (i+1) + '"></tr>');
		fila = document.getElementById('fila' + (i+1));
		console.log(fila);
		var randomColor = colorAleatorio(1);
		colores.push(randomColor);
		//Se agrega cada entrada de coeficientes de cada restricción
		for(j=1;j<=numVariables+2;j++)
		{
			if(j==numVariables+1)
				{
					fila.insertAdjacentHTML('beforeEnd','<td></td>');
					fila.insertAdjacentHTML('beforeEnd','<td> <select name="desigualdad" class="span1 m-wrap"> <option value="0">&lt;=</option><option value="1">=</option><option value="2">&gt;=</option></select> </td>');
				}
				else
				{
					if(j==numVariables+2)
						fila.insertAdjacentHTML('beforeEnd','<td></td>');
					else if(j!=1)
						fila.insertAdjacentHTML('beforeEnd','<td><label>+</label></td>');
					fila.insertAdjacentHTML('beforeEnd','<td><input type="number" class="coeficientes span1 m-wrap"></td>');
				}
		}
	}
			//console.log("Número de variables : " + numVariablesHolgura);
	//console.log("Número de restricciones : " + numRestricciones);
	tabla.insertAdjacentHTML('afterEnd','<button class="btn btn-success" onclick="graficar()">Graficar</button>')
	mensajePrimero = document.getElementById('objetivoTabA');
	mensajePrimero.click();
	mensajePrimero = document.getElementById('restriccionesTabA');
	mensajePrimero.click();
}


function graficar()
{

	var coeficientes = document.getElementsByClassName('coeficientes');
	for(i=0;i<coeficientes.length;i++)
	{
		if(isNaN(parseFloat(coeficientes[i].value)))
		{
			alert('Introduce todos los campos correctamente');
			return;
		}
	}
	var intersecciones = new Array(2);
	intersecciones[0]=new Array();
	intersecciones[1]=new Array();


	var mensajePrimero = document.getElementById('mensajePrimero3');
	if(mensajePrimero != null)
		mensajePrimero.parentNode.removeChild(mensajePrimero);
	
	mensajePrimero = document.getElementById('graficoTabA');
	mensajePrimero.click();

	document.getElementById('grafica').insertAdjacentHTML('beforeEnd','<div style="overflow:auto;" class="span10"><canvas style="margin-left:10px;" id="myCanvas" width="880" height="850"></canvas> </div> <div  class="span4" id="letrero">Lista de Funciones graficadas al momento</div>');
	canvas = document.getElementById('myCanvas');
	cleanCanvas = document.createElement('canvas');
	cleanCanvas.height = 850;
	cleanCanvas.width = 880;

	ctx = document.getElementById('myCanvas').getContext("2d");
	ctxClean = cleanCanvas.getContext("2d");
	ctx.lineWidth =1;



	document.getElementById('myCanvas').addEventListener('mousemove', function(e) {
		cuadro = canvas.getBoundingClientRect();
	    var x = e.pageX - (cuadro.left+window.scrollX);
	    var y = e.pageY - (cuadro.top+window.scrollY);
	   // console.log("El Y es " + e.pageY);
	    //console.log("(" + x + "," + y + ")");
	    var str = 'X1 : ' + ((x-40)/800*maxX1).toFixed(2) + ', ' + 'X2 : ' + ((810-y)/800*maxX2).toFixed(2) + ', Z= ' + (((x-40)/800*maxX1)*zX1+((810-y)/800*maxX2)*zX2).toFixed(2);
	    //console.log(str);
	    zRes = (((x-40)/800*maxX1)*zX1+((810-y)/800*maxX2)*zX2);

	    ctx.clearRect(0,0,880,850);
	    ctx.drawImage(cleanCanvas,0,0);

	    var tooltipWidth = ctx.measureText(str).width;
	    if((y+10+30) > 850)
	    	y-=(10+30);
	    else
	    	y+=10;
	    if((x+10+tooltipWidth+20)>880)
	    	x-=(10+20+tooltipWidth);
	    else
	    	x+=10;

	    drawLine(0,zRes/zX2,zRes/zX1,0,"#ff0000");
	    ctx.fillStyle = '#ddd';
	    ctx.fillRect(x, y, tooltipWidth+20, 30);
	    ctx.fillStyle = '#000';
	    ctx.font = '15px sans-serif';
	    ctx.fillText(str, x + 10, y + 20);

	});

	
	var x1Array = new Array();
	var x2Array = new Array();
	var zArray = new Array();
	var pendientes = new Array();
	var lineas = new Array(numRestricciones);

	
	zX1=parseFloat(coeficientes[0].value);
	zX2=parseFloat(coeficientes[1].value);




	for(i=0;i<numRestricciones;i++)
	{
		x1Array.push(parseFloat(coeficientes[2+(i*3)].value));
		x2Array.push(parseFloat(coeficientes[2+(i*3)+1].value));
		zArray.push(parseFloat(coeficientes[2+(i*3)+2].value));
	}

	for(i=0;i<numRestricciones;i++)
	{
		lineas[i] = new Array();
		if(x1Array[i] == 0 )
		{
			console.log("Asintota horizontal");
			lineas[i].push(0);
			lineas[i].push(zArray[i]/x2Array[i]);
			lineas[i].push('INF');
			lineas[i].push(zArray[i]/x2Array[i]);
		}
		else if(x2Array[i] == 0)
			{
				console.log("Asintota vertical");

				lineas[i].push(zArray[i]/x1Array[i]);
				lineas[i].push(0);
				lineas[i].push(zArray[i]/x1Array[i]);
				lineas[i].push('INF');
			}
		else
		{
			lineas[i].push(0);
			lineas[i].push(zArray[i]/x2Array[i]);
			lineas[i].push(zArray[i]/x1Array[i]);
			lineas[i].push(0);
		}
	}	

	for(i=0;i<numRestricciones;i++)
		console.log(lineas[i]);

	maxX1=-1,maxX2=-1;
	for(i=0;i<numRestricciones;i++)
	{

		for(j=0;j<2;j++)
		{
			if(lineas[i][j*2]!='INF')
				maxX1=Math.max(maxX1,lineas[i][j*2]);
		}
		for(j=0;j<2;j++)
		{
			if(lineas[i][j*2+1]!='INF')
				maxX2=Math.max(maxX2,lineas[i][j*2+1]);
		}
	}
	console.log("El X1 máximo es " + maxX1);
	console.log("El X2 máximo es " + maxX2);


	var pot = parseInt(Math.log10(maxX1));
	escalaX1 = parseInt(maxX1/(Math.pow(10,pot)));
	escalaX1++;
	escalaX1*=(Math.pow(10,pot));
	

	console.log(escalaX1);

	var pot = parseInt(Math.log10(maxX2));
	escalaX2 = parseInt(maxX2/(Math.pow(10,pot)));
	escalaX2++;
	escalaX2*=(Math.pow(10,pot));
	maxX1=escalaX1;
	maxX2=escalaX2;

	console.log(escalaX2);

	for(i=0;i<numRestricciones;i++)
	{

		for(j=0;j<2;j++)
		{
			if(lineas[i][j*2]=='INF')
				lineas[i][j*2]=escalaX1;
		}
		for(j=0;j<2;j++)
		{
			if(lineas[i][j*2+1]=='INF')
				lineas[i][j*2+1]=escalaX2;
		}
	}

	escalaX1=800/escalaX1;
	escalaX2=800/escalaX2;
	for(i=0;i<numRestricciones;i++)
		console.log(lineas[i]);

	console.log(escalaX1);
	console.log(escalaX2);
	console.log(maxX1);
	console.log(maxX2);


	//Se dibujan los orígenes
	drawLine(0,0,0,maxX2,'#BDBDBD');
	drawLine(0,0,maxX1,0,'#BDBDBD');

	//Se dibujan las paralelas y ordenadas
	for(i=1;i<=10;i++)
	{
		drawLine(maxX1/10*i,0,maxX1/10*i,maxX2,'#BDBDBD');
		drawLine(0,maxX2/10*i,maxX1,maxX2/10*i,'#BDBDBD');
	}

	//Se escribe la escala para X1
	for(i=0;i<11;i++)
	{
		str = (maxX1/10*i).toFixed(2);
		var len = ctx.measureText(str).width/2;	
		ctx.fillText(str,40+80*i-len,820);
	}

	//Se escribe la escala para X2
	for(i=0;i<11;i++)
	{
		str = (maxX2/10*i).toFixed(2);
		var len = ctx.measureText(str).width;	
		var hei = ctx.measureText(str).height;	
		console.log("La longitud es " + len);
		console.log(str);
		ctx.fillText(str,40-len-5,800-80*i+8);
	}


	
	for(i=0;i<numRestricciones;i++)
	{
		drawLine(lineas[i][0], lineas[i][1], lineas[i][2], lineas[i][3],colores[i]);
	}


	//En esta parte se calculan las intersecciones de las rectas
	for(i=0;i<numRestricciones;i++)
	{
		intersecciones[0].push(lineas[i][0]);
		intersecciones[1].push(lineas[i][1]);
		intersecciones[0].push(lineas[i][2]);
		intersecciones[1].push(lineas[i][3]);
	}
	console.log(intersecciones[0]);
	console.log(intersecciones[1]);

	for(i=0;i<numRestricciones-1;i++)
	{
		console.error("Se calcula una intersección");
		for(j=i+1;j<numRestricciones;j++)
		{
			if(parseFloat(coeficientes[2+i*3+1].value)==0)
			{	
				x1tmp = parseFloat(coeficientes[2+i*3+2].value)/parseFloat(coeficientes[2+i*3].value)
				console.log("para el caso de asintota x1 = " + x1tmp );
				x2tmp = (parseFloat(coeficientes[2+j*3+2].value) -  parseFloat(coeficientes[2+j*3].value)*x1tmp) / parseFloat(coeficientes[2+j*3+1].value);
				console.log("para el caso de asintota x2 = " + x2tmp );

			}
			else
			{
				x2tmp = parseFloat(coeficientes[2+j*3+1].value)/parseFloat(coeficientes[2+i*3+1].value);
				console.log(parseFloat(coeficientes[2+j*3+1].value) + " / " + parseFloat(coeficientes[2+i*3+1].value));
				x1tmp = parseFloat(coeficientes[2+i*3].value)*x2tmp - parseFloat(coeficientes[2+j*3].value);
				console.log(x1tmp);
				x1tmp  = (parseFloat(coeficientes[2+i*3+2].value)*x2tmp-parseFloat(coeficientes[2+j*3+2].value))/x1tmp;
				console.log(x1tmp);
				x2tmp = (parseFloat(coeficientes[2+i*3+2].value) -  parseFloat(coeficientes[2+i*3].value)*x1tmp) / parseFloat(coeficientes[2+i*3+1].value);
				console.log("Las intersecciones son (" + x1tmp.toFixed(2) + " , " + x2tmp.toFixed(2) + " )" ); 
			}
			if(x1tmp>= 0.0 && x2tmp>=0.0)
			{
				intersecciones[0].push(x1tmp);
				intersecciones[1].push(x2tmp);
			}
		}
	}




	intersecciones[0].push(0.0);
	intersecciones[1].push(0.0);
	console.log(intersecciones[0]);
	console.log(intersecciones[1]);

	var puntos = new Array();
	for(i=0;i<intersecciones[0].length;i++)
		puntos.push({x:intersecciones[0][i],y:intersecciones[1][i]});



	var areaFactible= new Array();
	//Se valida si cada punto entra dentro de las restricciones

	desigualdades = document.getElementsByName('desigualdad');
	var areaLineal = false;

	for(i=0;i<intersecciones[0].length;i++)
	{
		var dentro = true;
		for(j=0;j<numRestricciones;j++)
		{
			evaluacion = intersecciones[0][i] * parseFloat(coeficientes[2+j*3].value) + intersecciones[1][i] * parseFloat(coeficientes[2+j*3 + 1 ].value);  
			desigualdad = parseInt(desigualdades[j].value);

			switch(desigualdad)
			{
				case 0:
					if(evaluacion <= parseFloat(coeficientes[2+j*3+2].value))
						break;
					else
					{
						dentro = false;
						console.error(intersecciones[0][i] + " *  " + parseFloat(coeficientes[2+j*3].value)  + " + " +  intersecciones[1][i] + " * "  + parseFloat(coeficientes[2+j*3 + 1 ].value) + "  [[ " + evaluacion +  "]] !<= " + coeficientes[2+j*3+2].value + "  (" + intersecciones[0][i]+ " , " + intersecciones[1][i]+ ")");

					}
					break;
				case 1:
					areaLineal = true;
					if(evaluacion == parseFloat(coeficientes[2+j*3+2].value))
						break;
					else
					{
						console.error(intersecciones[0][i] + " *  " + parseFloat(coeficientes[2+j*3].value)  + " + " +  intersecciones[1][i] + " * "  + parseFloat(coeficientes[2+j*3 + 1 ].value) + "  [[" + evaluacion +  "]] != " + coeficientes[2+j*3+2].value + "  (" + intersecciones[0][i]+ " , " + intersecciones[1][i]+ ")");
						dentro = false;
					}
					break;
				case 2:
					if(evaluacion >= parseFloat(coeficientes[2+j*3+2].value))
						break;
					else
					{
						console.error(intersecciones[0][i] + " *  " + parseFloat(coeficientes[2+j*3].value)  + " + " +  intersecciones[1][i] + " * "  + parseFloat(coeficientes[2+j*3 + 1 ].value) + "  [[" + evaluacion +  "]] !>= " + coeficientes[2+j*3+2].value + "  (" + intersecciones[0][i]+ " , " + intersecciones[1][i]+ ")");
						dentro = false;
					}
					break;
				default:
					console.error("No entró en ninguna");
					break;
			}
		}
		if(dentro==true)
		{
			areaFactible.push(puntos[i]);
		}
	}
	console.error("Los puntos que entraron son ");
	
	console.log(areaFactible);

	dibujarAreaFactible(convexHull(areaFactible));

	var minZ=Number.POSITIVE_INFINITY, maxZ=Number.NEGATIVE_INFINITY;
	var pMax, pMin;
	for(i=0;i<areaFactible.length;i++)
	{
		if(minZ>areaFactible[i].x*parseFloat(coeficientes[0].value) + areaFactible[i].y*parseFloat(coeficientes[1].value))
		{
			console.error(areaFactible[i].x*parseFloat(coeficientes[0].value) + areaFactible[i].y*parseFloat(coeficientes[1].value));
			minZ =  areaFactible[i].x*parseFloat(coeficientes[0].value) + areaFactible[i].y*parseFloat(coeficientes[1].value);
			pMin = areaFactible[i];
		}

		if(maxZ<areaFactible[i].x*parseFloat(coeficientes[0].value) + areaFactible[i].y*parseFloat(coeficientes[1].value))
		{
			console.error(areaFactible[i].x*parseFloat(coeficientes[0].value) + areaFactible[i].y*parseFloat(coeficientes[1].value));
			maxZ =  areaFactible[i].x*parseFloat(coeficientes[0].value) + areaFactible[i].y*parseFloat(coeficientes[1].value);
			pMax = areaFactible[i];
		}
	}

	var letrero = document.getElementById('letrero');
	letrero.insertAdjacentHTML('beforeEnd','<ul id="lista"></ul>');
	letrero = document.getElementById('lista');
	for(i=0;i<numRestricciones;i++)
	{
		letrero.insertAdjacentHTML('beforeEnd','<li style="color:'+colores[i] + '" >' + coeficientes[2+(i*3)].value+ 'X1 + ' +  coeficientes[2+(i*3)+1].value +'X2 = ' + coeficientes[2+(i*3)+2].value +  '</li>');
	}
	if(areaLineal==true)
		letrero.insertAdjacentHTML('afterEnd','<p class="error">No se dibuja un área factible debido a que hay restricciones del tipo "=" </p>')
	letrero.insertAdjacentHTML('afterEnd','<h3>Z : ' + maxZ + '</h3>');
	letrero.insertAdjacentHTML('afterEnd','<h3>X2 : ' + pMax.y + '</h3>');
	letrero.insertAdjacentHTML('afterEnd','<h3>X1 : ' + pMax.x + '</h3>');
	letrero.insertAdjacentHTML('afterEnd','<h2>Punto máximo</h2>');

	letrero.insertAdjacentHTML('afterEnd','<h3>Z : ' + minZ + '</h3>');
	letrero.insertAdjacentHTML('afterEnd','<h3>X2 : ' + pMin.y + '</h3>');
	letrero.insertAdjacentHTML('afterEnd','<h3>X1 : ' + pMin.x + '</h3>');
	letrero.insertAdjacentHTML('afterEnd','<h2>Punto mínimo</h2>');

	ctxClean.drawImage(canvas,0,0);
	

}


function drawLine(x1,y1,x2,y2,color)
{
	ctx.strokeStyle = color;
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(x1*escalaX1+40,(810-y1*escalaX2));
	ctx.lineTo(x2*escalaX1+40,(810-y2*escalaX2));
	ctx.stroke();
	ctx.closePath();
	ctx.lineWidth = 1;


}

function aleatorio(inferior,superior)
{
	numPosibilidades = superior - inferior
	aleat = Math.random() * numPosibilidades
	aleat = Math.floor(aleat)
	return parseInt(inferior) + aleat
}

function colorAleatorio(alpha)
{
   return "rgba(" + aleatorio(0,200) + "," + aleatorio(0,200) + "," + aleatorio(0,200) + "," + alpha + ")";
}

function dibujarAreaFactible(area)
{

	if(area.length<3)
	{
		alert("No se puede crear el poligono");
		return;
	}
	ctx.fillStyle = "rgba(124, 255, 44, 0.3)";
	
	
	/*
	for(i=2;i<area.length;i++)
	{
		a= area[i-2];
		b=area[i-1];
		c=area[i];


		ctx.beginPath();
		ctx.moveTo(a.x*escalaX1+40,(810-a.y*escalaX2));
		ctx.lineTo(b.x*escalaX1+40,(810-b.y*escalaX2));
		ctx.lineTo(c.x*escalaX1+40,(810-c.y*escalaX2));
		ctx.closePath();
		ctx.fill();

	}
	*/
	ctx.beginPath();
	ctx.moveTo(area[0].x*escalaX1+40,(810-area[0].y*escalaX2));

	for(i=1;i<area.length;i++)
	{
		ctx.lineTo(area[i].x*escalaX1+40,(810-area[i].y*escalaX2));
	}
	ctx.closePath();
	ctx.fill();

	
}

	function convexHull(points) {
        points.sort(function (a, b) {
            return a.x != b.x ? a.x - b.x : a.y - b.y;
        });

        var n = points.length;
        var hull = [];

        for (var i = 0; i < 2 * n; i++) {
            var j = i < n ? i : 2 * n - 1 - i;
            while (hull.length >= 2 && removeMiddle(hull[hull.length - 2], hull[hull.length - 1], points[j]))
                hull.pop();
            hull.push(points[j]);
        }

        hull.pop();
        return hull;
    }

    function removeMiddle(a, b, c) {
        var cross = (a.x - b.x) * (c.y - b.y) - (a.y - b.y) * (c.x - b.x);
        var dot = (a.x - b.x) * (c.x - b.x) + (a.y - b.y) * (c.y - b.y);
        return cross < 0 || cross == 0 && dot <= 0;
    }