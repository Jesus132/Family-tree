const persons =[
	{"name":"Bart", "father": "Homer", "mother": "Marge"},
	{"name":"Lisa", "father": "Homer", "mother": "Marge"},
	{"name":"Maggie", "father": "Homer", "mother": "Marge"},
	{"name":"Homer", "father": "Abraham", "mother": "Mona"},
	{"name":"Herb", "father": "Abraham", "mother": "Mona"},
	{"name":"Marge", "father": "Clancy", "mother": "Jackie"},
	{"name":"Patty", "father": "Clancy", "mother": "Jackie"},
	{"name":"Selma", "father": "Clancy", "mother": "Jackie"},
	{"name":"Ling", "father": "", "mother": "Selma"},
	{"name":"Nediana Flanders", "father": "Nedsel Flanders", "mother": "Agnes Turnipseed"},
	{"name":"Ned Flanders", "father": "Nedsel Flanders", "mother": "Agnes Turnipseed"},
	{"name":"Rodd", "father": "Ned Flanders", "mother": "Maude"},
	{"name":"Todd", "father": "Ned Flanders", "mother": "Maude"}
];

let arbol = [];
let arbolSvg = [];
let Coord = [];
let test = [];
let X = -100;
let Y = -50;
let data = '';
const Graph = document.getElementById('graph');

async function AgregarHijos(Son) {
        await Son.map( (son) =>{
                persons.map( async (person) =>{
                        if( person.father === son || person.mother === son){
                                if (arbol.filter(item => item.mother === son || item.father === son).length === 0) {
                                        arbol.push({
                                            mother: person.mother,
                                            father: person.father,
                                            son: [person.name]
                                        });
                                        arbolSvg.push({
                                                name: person.mother,
                                                X: X,
                                                Y: Y
                                        });
                                        arbolSvg.push({
                                                name: person.father,
                                                X: X + 100,
                                                Y: Y
                                        });
                                        X += 200;
                                    } else {
                                        await arbol.map((item, index) => {
                                            if (son === item.mother || son === item.father) {
                                                if( arbol[index].son.filter( (item) => item ===  person.name ).length === 0 ){
                                                    arbol[index].son.push(person.name);
                                                }
                                            }
                                        });
                                    }
                        }
                });
                if(arbol.filter(item => item.mother === son || item.father === son).length === 0){
                        arbolSvg.push({
                                name: son,
                                X: X,
                                Y: Y
                        });
                        X += 100;
                }
        });

}
    
async function Parseabol(persons) {
        let searchArbol = true;
        await persons.map(async (itemI, indexI) => {
                let father = true;
                await persons.map((itemJ) => {
                    if (itemI.mother === itemJ.name || itemI.father === itemJ.name) {
                        father = false;
                    }
                });
            
                if (father) {
                    if (searchArbol) {
                        arbol.push({
                            mother: itemI.mother,
                            father: itemI.father,
                            son: []
                        });
                        arbolSvg = [... [
                                {
                                        name: itemI.mother,
                                        X: X,
                                        Y: Y
                                },
                                {
                                        name: itemI.father,
                                        X: X + 100,
                                        Y: Y
                                }
                        ]];
                        searchArbol = false;
                    }
            
                    if (arbol.filter(item => item.mother === itemI.mother && item.father === itemI.father).length === 0) {
                        X += 200;
                        arbol.push({
                            mother: itemI.mother,
                            father: itemI.father,
                            son: [itemI.name]
                        });
                        arbolSvg.push({
                                name: itemI.mother,
                                X: X,
                                Y: Y
                        });
                        arbolSvg.push({
                                name: itemI.father,
                                X: X + 100,
                                Y: Y
                        });
                    } else {
                        arbol.map((item, index) => {
                            if (itemI.mother === item.mother && itemI.father === item.father) {
                                arbol[index].son.push(itemI.name);
                            }
                        });
                    }
                }
            
            });
            let i = 0;
            while(!searchArbol){
                X = -100;
                Y += 50;
                await arbol.map( (item, index) =>{
                        if( index >= i){
                            AgregarHijos(item.son);
                            i++;
                        }
                });
                if(arbol.length === i){
                        searchArbol = true;
                }
        }

        await arbolSvg.map( (item) =>{
            data += `<text x="${item.X+100}" y="${item.Y+100}" class="label-title">${item.name}</text>`;
        });

        await arbol.map( async (partner, index) =>{
            Coord.push({});
            await arbolSvg.map( (person) =>{
                if(person.name === partner.mother){
                    Coord[Coord.length - 1].X1 = person.X;
                    Coord[Coord.length - 1].Y1 = person.Y;
                }
                if(person.name === partner.father){
                    Coord[Coord.length - 1].X2 = person.X;
                    Coord[Coord.length - 1].Y2 = person.Y;
                }
                
            });
            await partner.son.map( async (son) => {
                Coord.push({});
                await arbolSvg.map( (person) => {
                    if(son === person.name){
                        Coord[Coord.length - 1].X1 = person.X - 20;
                        Coord[Coord.length - 1].Y1 = person.Y - 10;
                        Coord[Coord.length - 1].X2 = (Coord[index].X1 + Coord[index].X2)/2;
                        Coord[Coord.length - 1].Y2 = Coord[index].Y2;
                    }
                });
            });

        });
        await Coord.map( (coord) =>{
            data += `<line x1="${coord.X1 + 130}" y1="${coord.Y1 + 100}" x2="${coord.X2 + 100}" y2="${coord.Y2 + 100}" style="stroke:rgb(255,0,0);stroke-width:2" />
            `;
        });

        Graph.insertAdjacentHTML('afterbegin', `
        <svg class="graph"  >

        ${data}
        
        </svg>
        `);


}

Parseabol(persons);
