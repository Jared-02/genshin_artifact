const { parse } = require("node-html-parser");
const axios = require("axios");

let url = process.argv[2];

function toStr(arr) {
    let temp = "[";
    for (let i = 0; i < arr.length; i++) {
        let item = arr[i];
        if (i === arr.length - 1) {
            temp = temp + item + "]";
        } else {
            temp = temp + item + ", ";
        }
    }
    return temp;
}

function removeZero(str) {
    return str.replace(/0*$/, "");
}

async function func() {
    response = await axios.post(url);

    root = parse(response.data);
    skill = root.querySelectorAll("table.wikitable");
    skill = skill.filter(item => {
        let text = item.rawText.toLowerCase();
        return text.indexOf("lv11") !== -1; 
    });

    for (let i = 0; i < skill.length; i++) {
        let table = skill[i];
        let rows = table.querySelectorAll("tr").filter(row => {
            let text = row.rawText.toLowerCase();
            return text.indexOf("%") !== -1;
        });

        for (let row of rows) {
            let cells = row.querySelectorAll("td").filter(cell => cell.rawText.indexOf("%") !== -1);
            
            let datas = [];
            for (let cell of cells) {
                let matches = cell.innerHTML.match(/\d+(\.\d+)?%/g);
                let data = [];
                for (let match of matches) {
                    let value = (parseFloat(match) / 100).toFixed(4);
                    data.push(removeZero(value));
                }
                datas.push(data);
            }
            
            for (let i = 0; i < datas[0].length; i++) {
                let temp = datas.map(item => item[i]);
                console.log(toStr(temp));
            }
        }
    }

    // console.log(skill);
}

func();