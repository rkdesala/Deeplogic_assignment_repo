let stringdata = "ddadjaldkadkaddssdlkd/..<h1>ramakrishna</h1>;";
let modifiedtext = stringdata.replace(/<\/?[^>]+(>|$)/g, "");
console.log(modifiedtext);
