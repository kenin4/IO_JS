	var metodo = 0;	
	var numVariables, numVariablesHolgura, numVariablesArtificial, numVariablesExceso, numRestricciones;
	var variablesHolgura, variablesArtificial, variablesExceso; 
	var variablesBasicas, variablesNoBasicas;
	var matriz; 
	var entradaCapturada = false;
	var modoSegundaFase;
	var fase;
	var coeficientesObjetivoFaseUno;
	var error = false;
	var mensajeError = "";
	var historial = new Array();
	var historialFilaPivote, historialColumnaPivote;
	var ladoDerechoDosFases;
	var pagina = 0;
	var inicializado = false;
	function entrada_variables() {
		numVariables = parseInt(document.getElementById('variables').value);
		numRestricciones = parseInt(document.getElementById('restricciones').value);
		if(isNaN(numVariables) || isNaN(numRestricciones))
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
		for (var i = 0; i < numVariables+2; i++) {
			if(i==0)
				{
					document.getElementById('coeficientesObjetivo').insertAdjacentHTML('beforeEnd','<td><input type="number" placeholder="Z" class="coeficientes span1 m-wrap" value="1" readonly></td>');
					document.getElementById('coeficientesObjetivo').insertAdjacentHTML('beforeEnd','<td>=</td>');
				}
			else
				if(i==numVariables+1)
					document.getElementById('coeficientesObjetivo').insertAdjacentHTML('beforeEnd','<td hidden><input type="number" class="coeficientes" value="0" hidden></td>');
				else
				{
					if(i!=1)
						document.getElementById('coeficientesObjetivo').insertAdjacentHTML('beforeEnd','<td><label>+</label></td>');
					document.getElementById('coeficientesObjetivo').insertAdjacentHTML('beforeEnd','<td><input type="number" class="coeficientes span1 m-wrap" ></td>');
				}
		}
			




		for(i=0;i<numRestricciones;i++)
		{
			tabla.insertAdjacentHTML('beforeEnd','<tr id="fila' + (i+1) + '"></tr>');
			fila = document.getElementById('fila' + (i+1));
			console.log(fila);
			

			//Se agrega cada entrada de coeficientes de cada restricción
			for(j=0;j<=numVariables+2;j++)
			{
				if(j==0) //Se pone el coeficiente correspondiente a la columna de los coeficientes de Z
					fila.insertAdjacentHTML('beforeEnd','<td hidden><input type="number" class="coeficientes" value="0" hidden></td>');
				else if(j==numVariables+1)
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
		tabla.insertAdjacentHTML('afterEnd','<button class="btn btn-success" onclick="pasoAPaso()">Solución paso a paso</button>')

		mensajePrimero = document.getElementById('objetivoTabA');
		mensajePrimero.click();
		mensajePrimero = document.getElementById('restriccionesTabA');
		mensajePrimero.click();


	}
	

	function pasoAPaso() {

		coeficientes = document.getElementsByClassName('coeficientes');
		for(i=0;i<coeficientes.length;i++)
		{
			if(isNaN(parseFloat(coeficientes[i].value)))
			{
				alert('Introduce todos los campos correctamente');
				return;
			}
		}

		//document.getElementById('collapse-group').insertAdjacentHTML('beforeEnd','<div class="accordion-group widget-box"><div class="accordion-heading"><div class="widget-title"> <a data-parent="#collapse-group" href="#collapseGOne" data-toggle="collapse"> <span class="icon"><i class="icon-magnet"></i></span><h5>Accordion Example 1</h5></a> </div></div><div class="collapse in accordion-body" id="collapseGOne"><div class="widget-content"> It has multiple paragraphs and is full of waffle to pad out the comment. Usually, you just wish these sorts of comments would come to an end. </div></div>');
		//document.getElementById('collapse-group').insertAdjacentHTML('beforeEnd','<div class="accordion-group widget-box"><div class="accordion-heading"><div class="widget-title"> <a data-parent="#collapse-group" href="#collapseGTwo" data-toggle="collapse"> <span class="icon"><i class="icon-magnet"></i></span><h5>Accordion Example 1</h5></a> </div></div><div class="collapse in accordion-body" id="collapseGTwo"><div class="widget-content"> It has multiple paragraphs and is full of waffle to pad out the comment. Usually, you just wish these sorts of comments would come to an end. </div></div>');

		tabla = document.getElementById('collapse-group');
		tabla.insertAdjacentHTML('beforeEnd','<h3 style="text-align:center">Solución al problema</h3>');

		if(dosFases()!=true)
		{
			fase = 0;
			alert("Se usa el modo normal");
			iterarSolucion();

			historial.push(arrayClone(matriz));
			imprime_matriz(arrayClone(historial[historial.length-1]),historial.length-1,"Matriz Resuelta","",false);

			var resultados = document.getElementById('tabla' + (pagina-1));
			resultados.childNodes[2].childNodes[0].childNodes[numVariables+numVariablesHolgura+numVariablesArtificial+numVariablesExceso+2].className = "resultado";
			for(i=1;i<=numVariables;i++)
			{
				console.log("estoy buscando al " + i);
				if(variablesBasicas.indexOf(i)!=-1 && matriz[variablesBasicas.indexOf(i)+1][i]==1) //La variable inicial es una variable básica
				{
					console.log(variablesBasicas.indexOf(i)+3);
					console.log(numVariables+numVariablesHolgura+numVariablesArtificial+numVariablesExceso+2);
					resultados.childNodes[variablesBasicas.indexOf(i)+3].childNodes[0].childNodes[numVariables+numVariablesHolgura+numVariablesArtificial+numVariablesExceso+2].className = "resultado";
				}
			}



			for(i=numVariables;i>=1;i--)
			{
				if(variablesBasicas.indexOf(i)!=-1 && matriz[variablesBasicas.indexOf(i)+1][i]==1) //La variable inicial es una variable básica
					resultados.insertAdjacentHTML('afterEnd','<p>X' + i + ' = ' + strip(matriz[variablesBasicas.indexOf(i)+1][numColumnas-1]) + '</p>');
					//console.log("El valor de X" + i + " = " +  strip(matriz[variablesBasicas.indexOf(i)+1][numColumnas-1]))
				else
					resultados.insertAdjacentHTML('afterEnd','<p>X' + i + ' = 0</p>');
			}
			for(i=0;i<numFilas;i++)
			{
				if(matriz[i][0]==1)
				{
					resultados.insertAdjacentHTML('afterEnd','<p>Z  = ' + strip(matriz[i][numColumnas-1]) + '</p>');
					break;
				}
			}
			//og_array(matriz,"La matriz después de eliminar los variables básicas!!!!!!!!!!!!!!!!!!!!!!!!")1;
			/*
			for (k = 0; k < historial.length; k++) {
				imprime_matriz( arrayClone(historial[k]),k, '<h2>Tableo #' + (k+1) + '</h2>');
			}*/
		}
		else
		{
			//La primer fase consiste en un problema de minización siempre
			fase = 1;
			alert("Se usará el método de las dos fases debido a las restricciones");
			modoSegundaFase= document.getElementById('radioMinMax').checked;	//Se guarda el objetivo inicial
			document.getElementById('radioMinMax').checked=true					//El modo de dos fases siempre minimiza primero



			iterarSolucion();	//Comienza la primer fase

			
			


			/*for (k = 0; k < historial.length; k++) 
				imprime_matriz( arrayClone(historial[k]),k,'<h2>Tableo #' + (k+1) + '</h2>');
		
			var k2= historial.length;
			*/

			fase = 2; //Inicia la fase dos del método
			inicializado = false;
			console.error("COMIENZA AHORA LA SEGUNDA FASE");
			document.getElementById('radioMinMax').checked= modoSegundaFase;
			iterarSolucion();/*
			for (k = k2; k < historial.length; k++) 
				imprime_matriz( arrayClone(historial[k]),k,'<h2>Tableo #' + (k+1) + '</h2>');*/
			historial.push(arrayClone(matriz));
			imprime_matriz(arrayClone(historial[historial.length-1]),historial.length-1,"Matriz Resuelta","",false);

			var resultados = document.getElementById('tabla' + (pagina-1));
			resultados.childNodes[2].childNodes[0].childNodes[numVariables+numVariablesHolgura+numVariablesArtificial+numVariablesExceso+2].className = "resultado";

			for(i=1;i<=numVariables;i++)
			{
				console.log("estoy buscando al " + i);
				if(variablesBasicas.indexOf(i)!=-1 && matriz[variablesBasicas.indexOf(i)+1][i]==1) //La variable inicial es una variable básica
				{
					console.log(variablesBasicas.indexOf(i)+3);
					console.log(numVariables+numVariablesHolgura+numVariablesArtificial+numVariablesExceso+2);
					resultados.childNodes[variablesBasicas.indexOf(i)+3].childNodes[0].childNodes[numVariables+numVariablesHolgura+numVariablesArtificial+numVariablesExceso+2].className = "resultado";
				}
			}



			for(i=numVariables;i>=1;i--)
			{
				if(variablesBasicas.indexOf(i)!=-1 && matriz[variablesBasicas.indexOf(i)+1][i]==1) //La variable inicial es una variable básica
					resultados.insertAdjacentHTML('afterEnd','<p>X' + i + ' = ' + strip(matriz[variablesBasicas.indexOf(i)+1][numColumnas-1]) + '</p>');
					//console.log("El valor de X" + i + " = " +  strip(matriz[variablesBasicas.indexOf(i)+1][numColumnas-1]))
				else
					resultados.insertAdjacentHTML('afterEnd','<p>X' + i + ' = 0</p>');
			}
			for(i=0;i<numFilas;i++)
			{
				if(matriz[i][0]==1)
				{
					resultados.insertAdjacentHTML('afterEnd','<p>Z  = ' + strip(matriz[i][numColumnas-1]) + '</p>');
					break;
				}
			}

			
		}
	}
	//Esta función itera sobre la matriz principal para hallar la solución
	function iterarSolucion() {
		if(inicializado==false)
		{
			inicializarMatriz();	

		}
		console.log("====== SE INICIA EL ALGORITMO ======");
		if(fase==1)//Se tiene que llevar los coeficientes de las variables artificiales de la función objetivo a 0
		{
			
			for(i=numVariables+numVariablesHolgura+1;i<numVariables+numVariablesHolgura+numVariablesArtificial+1;i++)
			{
				console.log("Entro 1");

				for(j=1;j<=numRestricciones;j++)
				{
					console.log("Entro 2");
					if(matriz[j][i]==1)
					{
						var coArtificial = matriz[0][i];
						for(k=0;k<numColumnas;k++)
						{
							matriz[0][k] += (matriz[j][k]*coArtificial*-1); 
							console.log("Valor es " + matriz[j][k]);
						}
						break;
					}
				}
			}
			historial.push(arrayClone(matriz));
			imprime_matriz(arrayClone(historial[historial.length-1]),historial.length-1,"Se llevan los coeficientes artificiales a 0","",false);
			log_array(matriz,"Matriz después de eliminar las variables arficiales");
		}
		if(fase==2)//Debemos verificar que los coeficientes de las variables de básicas	 en Z sean 0
		{
			console.log("Los valores son ");
			for(i=0;i<matriz[0].length;i++)
				console.log(matriz[0][i] + " || ");
			for(i=0;i<numRestricciones;i++)
			{
				if(matriz[0][variablesBasicas[i]]!=0)
				{
					console.log("El valor de Z a eliminar es : " + matriz[0][variablesBasicas[i]] +" que es la variable con índice " + variablesBasicas[i] );
					for(j=1;j<numFilas;j++)
					{

						if(matriz[j][variablesBasicas[i]]==1)
						{
							aux = -matriz[0][variablesBasicas[i]];
							console.log("Se debe multiplicar por " + aux);
							for(k=0;k<numColumnas;k++)
							{
								//console.log(matriz[j][k] + " x " + aux + " = " + (matriz[j][k]*aux));
								//console.log( matriz[0][k] + " + " + (matriz[j][k]*aux) + " = " + strip(strip(matriz[0][k])+(matriz[j][k]*aux )))
								matriz[0][k]=strip(strip(matriz[0][k])+(matriz[j][k]*aux ));
								
							}

							break;
						}
					}
				}
			}
			historial.push(arrayClone(matriz));
			imprime_matriz(arrayClone(historial[historial.length-1]),historial.length-1,"Se llevan los coeficientes básicas a 0","",false);
			log_array(matriz,"La matriz después de eliminar los variables básicas!!!!!!!!!!!!!!!!!!!!!!!!");
			
		}
		while(matriz_resuelta()!=true)
		{

			columna = columna_pivote();
			fila = fila_pivote(columna);
			if(fila==-1)	//Solución no acotada
			{
				error=true;
				mensajeError = "Solución no acotada";
				break;
			}
			historialColumnaPivote.push(columna);
			historialFilaPivote.push(fila);
		//	historial.push(matriz);
				//Se selecciona el elemento de la fila y columna pivote como pivote
			pivote = matriz[fila][columna];

			historial.push(arrayClone(matriz));
			imprime_matriz(arrayClone(historial[historial.length-1]),historial.length-1,"Selección de fila y columna pivote","",true);
			log_array(matriz,"Se elige el elemento pivote");
			variablesBasicas[fila-1]=columna;


				//Dividir los coeficientes de la fila pivote, entre el valor pivote
			for(i=0;i<numColumnas;i++)
			{
				matriz[fila][i]= matriz[fila][i]/pivote;
			}
				pivote= pivote/pivote;
				//Eliminar los coeficientes de la columna pivote usando al pivot
			for(i=0;i<numFilas;i++)
			{
				if(i!=fila)
				{
					var temporal = (-matriz[i][columna])/pivote;
					for(j=0;j<numColumnas;j++)
					{
						matriz[i][j] = matriz[i][j] + temporal*matriz[fila][j];  
					}
				}
			}
			historial.push(arrayClone(matriz));
			imprime_matriz(arrayClone(historial[historial.length-1]),historial.length-1,"La matriz después de aplicar Gauss-Jordan","Se divide la fila pivote entre el elemento pivote. <br>Se eliminan los valores distintos de 0 en la columna pivote",false);
			log_array(matriz,"La matriz después de aplicar Gauss-Jordan");
		}	
		if(error==true)
		{
			alert(mensajeError);
			return;
		}
		console.log("Terminó el algoritmo");
		console.log("Índices de las variables básicas");
		for(i=0;i<variablesBasicas.length;i++)
			console.log(variablesBasicas[i]);
		//Se busca en la columna de Z por el primer 1
		



		if(fase==1)
		{
			for(i=0;i<matriz.length;i++)
				for(j=0;j<numVariablesArtificial;j++)
					matriz[i].splice(numVariables+numVariablesHolgura+1,1) 	//Quitamos la columna de las variables artificiales
			for(i=0;i<variablesBasicas.length;i++)
				if(variablesBasicas[i]>(numVariables+numVariablesHolgura))
					variablesBasicas[i]-=numVariablesArtificial;			//Reducimos los índices de las variables básicas que sean más grandes que las artificiales
			console.log("Índices de las variables básicas después de quitar las artificiales");
			for(i=0;i<variablesBasicas.length;i++)
				console.log(variablesBasicas[i]);

			numColumnas-=numVariablesArtificial;
			numVariablesArtificial = 0;



			for(i=0;i<numFilas;i++)
			{
				for(j=0;j<matriz[i].length;j++)
					matriz[i][j]= strip(matriz[i][j]);
			}
			log_array(matriz,"La matriz al quitarle las variables artificiales y truncar números");
			historial.push(arrayClone(matriz));
			imprime_matriz(arrayClone(matriz),historial.length-1,"Matriz después de quitar las variables artificiales","",false);
		}


			/*
			for(i=0;i<numVariables;i++)
			{
				var encontrado = false;
				for(j=0;j<numFilas;j++)
				{
					if(matriz[j][i+1]==1)
					{
						console.log("El valor de X" + (i+1) + " : " + matriz[j][numColumnas-1]);
						encontrado = true;
						break;
					}
				}
				if(encontrado==false)
					console.log("El valor de X" + (i+1) + " : 0");

			}*/
		
	}
	
	function dosFases()
	{
		x = document.getElementsByName('desigualdad');
		for(i=0;i<x.length;i++)
			if(x[i].value!=0)
				return true;

		return false;
	}
	function columna_pivote() {
		if(document.getElementById('radioMinMax').checked==true) //Es minimización
		{
			console.log("Es el caso de minimización");
			var maximo = Number.NEGATIVE_INFINITY;
			var indice = -1
			for(i=1;i<=numVariables+numVariablesHolgura+numVariablesArtificial+numVariablesExceso;i++)
			{
				if(matriz[0][i]>0 && matriz[0][i]>maximo) //Valor más grande estrictamente positivo 
				{
					maximo=matriz[0][i];
					indice=i;
				}
			}
				console.log("El valor de la columna pivote es " + maximo);	
				return indice;
		}
		else 													//Es maximización
		{
			//console.log("Es el caso de Maximización");
			var minimo = Number.POSITIVE_INFINITY;
			var indice = -1
			for(i=1;i<=numVariables+numVariablesHolgura+numVariablesArtificial+numVariablesExceso;i++)
			{
				if(matriz[0][i]<0 && matriz[0][i]<minimo) //Valor más pequeño estrictamente negativo 
				{
					minimo=matriz[0][i];
					indice=i;
				}
			}
				console.log("El valor de la columna pivote es " + minimo);	
				return indice;
		}
	}

	function fila_pivote(indice_columna_pivote) {

		var minimo = Number.POSITIVE_INFINITY;
		var indice = -1
		
		/*if(document.getElementById('radioMinMax').checked==true) //Es minimización
		{
			for(i=1;i<=numRestricciones;i++)
			{
				if(matriz[i][indice_columna_pivote]<0)
					if(Math.min(minimo,(matriz[i][numColumnas-1]/matriz[i][indice_columna_pivote]))<minimo)
					{
						minimo=matriz[i][numColumnas-1]/matriz[i][indice_columna_pivote];
						indice = i;
					}
			}
		}
		else 													 //Es maximización
		{*/
			for(i=1;i<=numRestricciones;i++)
			{
				if(matriz[i][indice_columna_pivote]>0)
					if(Math.min(minimo,(matriz[i][numColumnas-1]/matriz[i][indice_columna_pivote]))<minimo)
					{
						minimo=matriz[i][numColumnas-1]/matriz[i][indice_columna_pivote];
						indice = i;
					}
			}
		//}
		if(indice==-1)
			console.error("No existe variable candidata a salir. Solución no acotada");
		else
			console.log("El elemento pivote está en [" + indice + "][" + indice_columna_pivote + "] = " + matriz[indice][indice_columna_pivote]);
		return indice;	



	}



	//Esta función almacena los valores de entrada a una matriz de javascript para facilitar su uso
	function inicializarMatriz() {
		x = document.getElementsByName('desigualdad');
		arregloDesigualdad = new Array(x.length);
		for(i=0;i<x.length;i++) //Se itera el array de selects con los operadores de las desigualdades
			arregloDesigualdad[i]=x[i].value; //Se copian los valores del tipo de operador de desigualdad a un Array de javascript

		numVariablesHolgura = numVariablesExceso = numVariablesArtificial = 0;
		variablesHolgura = new Array();
		variablesArtificial = new Array();
		variablesExceso = new Array();


		
		//Iteramos en los operadores para determinar el número de variables de holgura, artificiales y exceso
		for(i=0;i<arregloDesigualdad.length;i++)
		{
			if(arregloDesigualdad[i]=="0")
				variablesHolgura.push(i+1);
			if(arregloDesigualdad[i]=="1" && fase!= 2) 
				variablesArtificial.push(i+1);
			if(arregloDesigualdad[i]=="2")
			{
				if(fase!=2)
					variablesArtificial.push(i+1);
				variablesExceso.push(i+1);
			}
		}

		numVariablesHolgura = variablesHolgura.length;
		numVariablesArtificial = variablesArtificial.length;
		

		numVariablesExceso = variablesExceso.length;
		console.log("Variables de holgura: " + numVariablesHolgura);
		console.log("Variables artificiales: " + numVariablesArtificial);
		console.log("Variables de exceso: " + numVariablesExceso);



		numFilas = numRestricciones+1;
		numColumnas = numVariables + numVariablesHolgura + numVariablesArtificial + numVariablesExceso + 2;	

		

		//Se crea la matriz con la que se realizará el algoritmo
		if(fase!=2)
		{
			matriz = new Array(numRestricciones+1);
			for (var i = 0; i < matriz.length; i++) 
				matriz[i] = new Array(numVariables + numVariablesHolgura + numVariablesArtificial + numVariablesExceso + 2); //+2 para los coeficientes Z y R
		

			//Se ponen todos los valores a 0
			for(i=0;i<matriz.length;i++)
				for(j=0;j<matriz[i].length;j++)
					matriz[i][j]=0;
			log_array(matriz, "Valores en 0");
		}
		coeficientes = document.getElementsByClassName("coeficientes");
		matriz[0][0]=1;

		//Se agregan los coeficientes de la función objetivo multiplicando por -1

		if(fase==1) //Cambiamos la función objetivo por la suma de las variables artificiales
		{
			for(i=0;i<numVariablesArtificial;i++)
			{
				matriz[0][1+numVariables+numVariablesHolgura+i]=parseFloat(1)*-1; 
			}
		}
		else //Usamos la función objetivo 
		{
			for(i=1;i<=numVariables;i++)
				matriz[0][i]=parseFloat(coeficientes[i].value)*-1;
		}
		log_array(matriz, "Valores de la función objetivo");

		if(fase!=2)
		{
			//Se agregan todos los valores del lado derecho
			for(i=1;i<numFilas;i++)
				matriz[i][numColumnas-1]=parseFloat(coeficientes[(i+1)*(numVariables+2)-1].value);
			log_array(matriz, "Se agregan los valores lado derecho");

			//Se agregan los coeficientes de las restricciones
			for(i=1;i<numFilas;i++)
				for(j=1;j<=numVariables;j++)
					matriz[i][j]=parseFloat(coeficientes[i*(numVariables+2)+j].value);

			//Se agregan los coeficientes 1 de todas las variables de holgura en las filas que guarda el vector variablesHolgura
			for(i=0;i<numVariablesHolgura;i++)
			{
				matriz[variablesHolgura[i]][numVariables+i+1]=1;
			}

			//Se agregan los coeficientes 1 de todas las variables artificiales en las filas que guarda el vector variablesArtificial
			for(i=0;i<numVariablesArtificial;i++)
			{
				matriz[variablesArtificial[i]][numVariables+numVariablesHolgura+i+1]=1;
			}

			//Se agregan los coeficientes -1 de todas las variables de exceso en las filas que guarda el vector variablesExceso
			for(i=0;i<numVariablesExceso;i++)
			{
				matriz[variablesExceso[i]][numVariables+numVariablesHolgura+numVariablesArtificial+i+1]=-1;
			}

			while(historial.length>0)
					historial.pop();
		}
		if(fase!=2)
		{
			historialFilaPivote = new Array();
			historialColumnaPivote = new Array();
		}	
		console.log("El número de variables son " + (numVariablesHolgura + numVariablesArtificial + numVariablesExceso));
		log_array(matriz);
		var matriz_temporal = arrayClone(matriz);
		historial.push(matriz_temporal);

		if(fase!=2)
		{
			variablesBasicas = new Array(numRestricciones);
			for(i=0;i<numRestricciones;i++)
			{
				for(j=1;j<=numRestricciones;j++)
				{
					console.log("matriz[ " +j + "][" +  (numVariables + i + 1) + "]");
					if(matriz[j][numVariables+i + 1] == 1)
					{
						console.log("ES ACÁ");
						variablesBasicas[j-1]=numVariables+i+1;
					}
				}
			}
		}

		switch(fase)
		{
			case 0: 
				imprime_matriz(matriz_temporal, historial.length-1, "Tableo Inicial", "Se usan los coeficientes de la función objetivo" ,false);
				break;
			case 1:
				imprime_matriz(matriz_temporal, historial.length-1, "Tableo Inicial Fase 1", "Se cambia la función objetivo por la suma de las variables artificiales del problema. <strong>SIEMPRE MINIMIZACIÓN</strong>",	 false);
				break;
			case 2:
				imprime_matriz(matriz_temporal, historial.length-1, "Tableo Inicial Fase 2","Se regresan los coeficientes de la función objetivo original. <strong>SE CONTINUA CON EL CASO ORIGINAL</strong>", false);
				break;
		}
		
		inicializado = true;
	}

	function matriz_resuelta() {
		if(document.getElementById('radioMinMax').checked==true) //Es minimización
		{
			for(i=1;i<=numVariables+numVariablesHolgura+numVariablesArtificial+numVariablesExceso;i++)
				if(strip(matriz[0][i])>0)
					return false;
		}
		else 													 //Es maximización
		{
			for(i=1;i<=numVariables+numVariablesHolgura+numVariablesArtificial+numVariablesExceso;i++)
				if(strip(matriz[0][i])<0)
					return false;
		}
		return true;

	}

	function arrayClone( arr ) {

		var copy = new Array();
	    for(i=0;i<arr.length;i++)
	    {
	    	var nuevoArray = new Array();
	    	copy.push(nuevoArray);
	    	for(j=0;j<arr[i].length;j++)
	    	{
	    		copy[i][j]= arr[i][j];
	    	}
	    }
	    return copy;

	}

	function log_array(arr, mensaje)
	{
		console.log(mensaje);
		for(i=1;i<matriz.length;i++)
		{
			cadena = matriz[i][matriz[i].length-1];
			for(j=1;j<matriz[i].length-1;j++)
				cadena += " " +  matriz[i][j];
 			console.log (cadena);
		}
		cadena = matriz[0][matriz[0].length-1];
		for(j=1;j<matriz[0].length-1;j++)
			cadena += " " +  matriz[0][j];
		console.log(cadena);
		console.log("" );
	}
	function imprime_matriz(tableo,indiceTableo, mensaje, submensaje, especial) {
		
		var abierto;
		pagina++;
		if(pagina==1)
			abierto = "in";
		else
			abierto= "";
		tabla = document.getElementById('collapse-group');
		tabla.insertAdjacentHTML('beforeEnd','<div class="collapsible widget-box"><div class=""><div class="widget-title"> <a data-parent="#collapse-group" href="#pagina' + pagina +  '" data-toggle="collapse"> <span class="icon"><i class="icon-table"></i></span><h5> ' + mensaje + '</h5></a> </div></div><div class="collapse ' + abierto + ' " id="pagina' + pagina + '"><div class="widget-content" id="contenidoPagina' + pagina + '"></div></div>');
		
		tabla = document.getElementById('contenidoPagina' + pagina);
		if(submensaje!="")
			tabla.insertAdjacentHTML('beforeEnd','<p>' +  submensaje + '</p>');
		tabla.insertAdjacentHTML('beforeEnd','<table id="tabla' + indiceTableo + '" style="text-align:center" class="table table-bordered" > </table>');
		tablaTemporal = document.getElementById('tabla' + indiceTableo);
		var nuevaFila = "<tr>";
		for (i = 0; i < numColumnas; i++) {
			if (i==0) 
				nuevaFila+='<th style="max-width:10px">Variables básicas</th>';
			if(i>0 && i<=numVariables)
				nuevaFila+="<th>X" + i + "</th>";
			if(i>numVariables && i<=numVariables+numVariablesHolgura)
				nuevaFila+="<th>S" + (i-numVariables) + "</th>";
			if(i>numVariables+numVariablesHolgura && i<=numVariables+numVariablesHolgura+numVariablesArtificial)
				nuevaFila+="<th>A" + (i-numVariables-numVariablesHolgura) + "</th>";
			if(i>numVariables+numVariablesHolgura+numVariablesArtificial && i<=numVariables+numVariablesHolgura+numVariablesArtificial+numVariablesExceso)
				nuevaFila+="<th>E" + (i-numVariables-numVariablesHolgura-numVariablesArtificial) + "</th>";
			if(i==numColumnas-1)
				nuevaFila+="<th>R.H.S.</th>";

		}	
		if(especial)
			nuevaFila+="<th>Cociente</th>";
		nuevaFila+="</tr>";
		tablaTemporal.insertAdjacentHTML('beforeEnd',nuevaFila);
		console.log("Hay " + historialFilaPivote.length + " datos en el historial de las filas pivotes");
		if(especial)
		{
			//console.error("Sí entro al modo especial");
			var filaP = historialFilaPivote.pop();
			var colP = historialColumnaPivote.pop();
			var sum = 0;
			if (fase==2)
				sum = 1;
			for(var i=0;i<numFilas;i++)
			{
				if(filaP == i)
					nuevaFila ='<tr style="background-color:#F7BE81"> ';
				else
					nuevaFila ='<tr> ';

				for(var j=0;j<numColumnas;j++)
					if(j == 0)
						if (i == 0)
							nuevaFila+='<td style="background-color:#6FD3FF; text-align:center"> ' + "Z" +"</td>";   //Se pinta el cuadro de Z
						else
							nuevaFila+='<td style="text-align:center"> ' + getVariableBasica(variablesBasicas[i-1]) +"</td>";
					else if(colP == j)
							if(filaP == i)
								nuevaFila+='<td style="background-color:#8AF781; text-align:center"> ' + truncarNumero(tableo[i][j]) +"</td>"; //Es el valor pivote
							else
								nuevaFila+='<td style="background-color:#F7BE81; text-align:center"> ' + truncarNumero(tableo[i][j]) +"</td>"; //Pertenece a la fila o columna pivote
						else
							nuevaFila+='<td 	style="text-align:center">' + truncarNumero(tableo[i][j]) +"</td>";

				if(i!=0)
					nuevaFila+='<td style="text-align:center">' + truncarNumero(tableo[i][numColumnas-1]) + " / " + truncarNumero(tableo[i][colP]) + " = " + truncarNumero(tableo[i][numColumnas-1]/tableo[i][colP])  +   '</td>';
				else
					nuevaFila+='<td style="text-align:center"> No aplica </td>'
				nuevaFila+="</tr>";
				tablaTemporal.insertAdjacentHTML('beforeEnd',nuevaFila);
			}
		}
		else
		{
			for(var i=0;i<numFilas;i++)
			{
				nuevaFila ='<tr> ';
				for(var j=0;j<numColumnas;j++)
					if(j == 0)
						if(i==0)
							nuevaFila+='<td style="background-color:#6FD3FF; text-align:center"> ' + "Z" +"</td>";
						else
							nuevaFila+='<td style="text-align:center"> ' + getVariableBasica(variablesBasicas[i-1]) +"</td>";
					else
						nuevaFila+='<td style="text-align:center">' +  truncarNumero(tableo[i][j])	 +"</td>";
				nuevaFila+="</tr>";
				tablaTemporal.insertAdjacentHTML('beforeEnd',nuevaFila);
			}
		}


	}

	function strip(number) {
    	return parseFloat(number.toFixed(10));
	}

	function truncarNumero(number)
	{
		numString = number.toFixed(4);
		numDecimal = 0;
		len = numString.length;
		for(i=1;i<=4;i++)
			if(numString[len-i]!='0')
				break;
			else
				numDecimal++;
		console.log("El numero truncado es " + parseFloat(number.toFixed(4-numDecimal)));
		return parseFloat(number.toFixed(4-numDecimal));
	}	

	function getVariableBasica(indice)
	{
		;
		if(indice >=1 && indice< numVariables+1)
		{
			console.log("[1 | " + indice + " | " + (numVariables+1) + " ]");
			return "X" + indice;
		}
		if(indice >=1+numVariables && indice< numVariablesHolgura+numVariables+1)
		{
			console.log("[ " + (1+numVariables) + " | " + indice + " | " + (numVariablesHolgura+numVariables+1) + " ]");
			return "S" + (indice - numVariables);
		}
		if(indice >=1+numVariables+numVariablesHolgura && indice< (numVariablesArtificial + numVariablesHolgura+numVariables+1))
		{
			console.log("[ " + (1+numVariables+numVariablesHolgura) + " | " + indice + " | " + (numVariablesArtificial + numVariablesHolgura+numVariables+1) + " ]");
			return "A" + (indice - (numVariables+numVariablesHolgura));
		}
		if(indice >=1+numVariables+numVariablesHolgura+numVariablesArtificial && indice< (numVariablesExceso+numVariablesArtificial+numVariablesHolgura+numVariables+1))
		{
			console.log("[ " + (1+numVariables+numVariablesHolgura+numVariablesArtificial) + " | " + indice + " | " + (numVariablesExceso+numVariablesArtificial+numVariablesHolgura+numVariables+1) + " ]");

			return "E" + (indice - (numVariables+numVariablesHolgura+numVariablesArtificial));
		}
	}