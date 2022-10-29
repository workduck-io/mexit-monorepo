import { loremIpsum } from "./lorem_ipsum";
const generateLoremIpsum = () =>{
    let data = "";
    for(let i = 1 ; i <= 5 ; i++){
        data += loremIpsum[i];
    }
    return data
}

export default generateLoremIpsum;